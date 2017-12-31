'use strict';
// Server code for vocal project.
// Author: Chris Buonocore (2017)
// Co-Author: Anup Vasudevan (2017)
// License: Apache License 2.0

const axios = require('axios');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');
const https = require('https');
const pg = require('pg');
const path = require('path');
const admin = require('firebase-admin')
const ethers = require('ethers');
const Wallet = ethers.Wallet;

const serviceAccount = require("./db/vocalfb.json");
const async = require('async');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://vocalcoin-69799.firebaseio.com"
});

// Passport for middleware HTTP bearer authentication strategy for the blockchain routes
var passport = require('passport');
const Strategy = require('passport-http-bearer').Strategy;
var db = require('./db');

passport.use(new Strategy(
    function (token, cb) {
        db.users.findByToken(token, function (err, user) {
            if (err) {
                return cb(err);
            }
            if (!user) {
                return cb(null, false);
            }
            return cb(null, user);
        });
    }));

// Variable and Server Setup //
const prod = false;

// custom libraries.
const vocal = require('./vocal');
const contract = require('./contract');

const vocalContract = contract.vocalContract;

const dbUser = process.env.ADMIN_DB_USER;
const dbPass = process.env.ADMIN_DB_PASS;
const kPass = process.env.K_PASS;
const dbName = 'vocal';
// const connectionString = process.env.VOCAL_DATABASE_URL || `postgres://${dbUser}:${dbPass}@localhost:5432/${dbName}`;
const connectionString = process.env.VOCAL_DATABASE_URL || `postgres://${dbUser}:${dbPass}@localhost:5432/${dbName}`;
console.log('connectionString', connectionString);

const pool = new pg.Pool({
    connectionString: connectionString,
})

const PORT = 9007;

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    origins: '*:*'
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// TODO: use reduced cors in production.
// const whitelist = ['https://vocalcoin.com', 'https://www.vocalcoin.com'];
// app.use(cors({ origin: whitelist }));

app.use(cors());

// Test Ethereum Network (INFURAnet)
const infuraTestNet = "https://infuranet.infura.io/";
const infuraAccessToken = process.env.INFURA_ACCESS_TOKEN;
const infuraMnemonic = process.env.INFURA_MNEMONIC;

pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err)
    process.exit(-1)
});

function isBlank(str) {
    return (!str || /^\s*$/.test(str));
}

// Endpoints //

app.get('/api/hello', (req, res) => {
    return res.json("hello world");
});

/* Map endpoints */

app.post('/api/issues/region', (req, res) => {
    const body = req.body;
    const lat1 = body.lat1;
    const lat2 = body.lat2;
    const lng1 = body.lng1;
    const lng2 = body.lng2;

    const query = vocal.getIssuesForRegionQuery(lat1, lng1, lat2, lng2);

    pool.query(query, (err, result) => {
        console.log('issues', err, result);
        if (err) {
            console.error('issues', err);
            return res.status(500).json(err)
        }
        // Return the rows that lie within the bounds of the map view.
        return res.json(result.rows);
    });
});

/**
 * Start of Blockchain Routes.
 *
 * The below routes check for http bearer tokens. If one does not exist in the request,
 * access will be denied.
 *
 * Example curl command to test routes:
 * curl -v -H "Authorization: Bearer 123456789" -X POST http://127.0.0.1:9007/api/vote
 */

function getAddressAndExecute(userId, cb) {
    const query = vocal.getAddress(userId);
    pool.query(query, (err, result) => {
        console.log('vocal address', err, result)
        if (err || !result.rows) {
            console.error('vocal address error', err);
            throw err;
        }
        const address = result.rows[0]['address'];
        console.log('got address', address);
        cb(address);
    });
}

function modifyBalanceAndExecute(address, amount, cb) {
    const query = vocal.modifyBalance(address, amount);
    pool.query(query, (err, result) => {
        console.log('modify balance', query, err, result)
        if (err) {
            console.error('modify balance error', err);
            throw err
        }
        cb();
    });
}

function getBalanceAndExecute(address, cb) {
    const query = vocal.getBalance(address)
    pool.query(query, (err, result) => {
        console.log('getbalance', err, result)
        if (err) {
            console.error('getbalance error', err);
            throw err;
        }

        const rows = result.rows;
        if (rows) {
            const balance = rows[0]['balance'];
            console.log('balance', address, balance)
            cb(balance);
            return;
        }
        cb(0);
    });
}

app.post('/api/vote', passport.authenticate('bearer', {
    session: false
}), (req, res) => {
    const body = req.body;
    const vote = JSON.parse(body.vote);

    const userId = vote.userId;
    const issueId = vote.issueId;

    const checkVoteQuery = vocal.checkVoteQuery(userId, issueId);
    pool.query(checkVoteQuery, (err, result) => {
        console.log('check vote', checkVoteQuery);
        console.log('checkVote', err, result);
        if (err) {
            console.error('postVote error', err);
            return res.status(500).json(err);
        }

        if (result.rows.length > 0) {
            // if we already have a vote for this user and issue, return.
            const errorMessage = "user already voted on this issue";
            console.error(errorMessage)
            return res.status(401).json({data: errorMessage});
        }

        // Ok. Insert the vote into the DB.
        getAddressAndExecute(userId, (address) => {
            const voteQuery = vocal.insertVoteQuery(vote);
            const amount = vocal.calculateVocalCredit(userId);
            // Credit the user.
            modifyBalanceAndExecute(address, amount, () => {
                // Now add the vote.
                pool.query(voteQuery, (err, result) => {
                    console.log('postVote', err, result);
                    if (err) {
                        console.error('postVote error', err);
                        return res.status(500).json(err);
                    }
                    // pool.end()
                    return res.json(result.rows);
                });
            })
        })
    });
});

app.post('/api/issue', passport.authenticate('bearer', {
    session: false
}), (req, res) => {
    const body = req.body;
    const issue = JSON.parse(body.issue);
    const userId = issue.userId;
    try {
        getAddressAndExecute(userId, (address) => {
            getBalanceAndExecute(address, (balanceFromBlockchain) => {
                // const balanceFromBlockchain = contract.getBalance(address);
                if (balanceFromBlockchain < vocal.ISSUE_COST) {
                    const errorMessage = `Insufficient balance (${balanceFromBlockchain}), require ${vocal.ISSUE_COST}`;
                    return res.status(401).json({data: errorMessage})
                }

                modifyBalanceAndExecute(address, -vocal.ISSUE_COST, () => {
                    // Now insert the new issue.
                    const query = vocal.insertIssueQuery(issue);
                    pool.query(query, (err, result) => {
                        console.log('postIssue', err, result)
                        if (err) {
                            console.error('postIssue error', err);
                            return res.status(500).json(err);
                        }
                        // pool.end()
                        return res.json(result.rows);
                    });
                })

            })
        });
    } catch (e) {
        return res.json(e);
    }


});

app.post('/api/issue/delete', passport.authenticate('bearer', {
    session: false
}), (req, res) => {
    const body = req.body;
    const userId = body.userId;
    const issueId = body.issueId;

    const query = vocal.deleteIssueQuery(userId, issueId);

    pool.query(query, (err, result) => {
        console.log('delete issue', err, result)
        if (err) {
            console.error('delete issue error', err);
            return res.status(500).json(err);
        }
        return res.json(result.rows);
    });
});

/* Dashboard routes */

app.get('/api/issues/:userId', passport.authenticate('bearer', {
    session: false
}), (req, res) => {
    const userId = req.params.userId;
    const query = vocal.getIssuesForUserQuery(userId);
    pool.query(query, (err, result) => {
        console.log('getIssues', err, result)

        if (err) {
            console.error('getIssues error', err);
            return res.status(500).json(err);
        }
        // pool.end()
        return res.json(result.rows);
    });
});

app.get('/api/hasvoted/:userId/:issueId', passport.authenticate('bearer', {
    session: false
}), (req, res) => {
    const userId = req.params.userId;
    const issueId = req.params.issueId;
    const checkVoteQuery = vocal.checkVoteQuery(userId, issueId);
    pool.query(checkVoteQuery, (err, result) => {
        console.log('query', checkVoteQuery);
        console.log('has voted', err, result);

        if (err) {
            console.error('postVote error', err);
            return res.status(500).json(err);
        }

        const rows = result.rows;
        return res.json(rows.length > 0);
    });
});

app.get('/api/votes/:issueId', passport.authenticate('bearer', {
    session: false
}), (req, res) => {
    const issueId = req.params.issueId;
    const query = vocal.getVotesForIssueIdQuery(issueId);

    pool.query(query, (err, result) => {
        console.log('getVotes', err, result)
        if (err) {
            console.error('getVotes error', err);
            return res.status(500).json(err);
        }
        // pool.end()
        return res.json(result.rows);
    });
});

function produceAddress(address, cb) {
    console.log('produce address', address);
    if (address && address !== 'undefined') {
        cb(address)
    }
    console.log('creating new vault');
    // TODO: preserve private key.
    const w = Wallet.createRandom();
    const addr = w.address;
    cb(addr);
}

app.post('/api/signin', (req, res) => {
    const body = req.body;
    console.log(body);
    const userId = body.userId;
    const email = body.email;
    const username = body.username;
    try {
        produceAddress(body.address, (address) => {
            // Attempt to add the new user with address if set.
            const query = vocal.getUserQuery(userId);
            pool.query(query, (err, result) => {
                console.log('get user', err, result)

                // TODO: Fix the race condition here between getting the user and
                // returning the auth token.
                if (err) {
                    console.error('get user error', err);
                    return res.status(500).json(err);
                }

                const rows = result.rows;
                const user = rows[0];
                if (rows instanceof Array && user && user['address'] && user['address'] !== 'undefined') {
                    console.log('found user', user);
                    // User already created with address.
                } else {
                    const username = body.username;
                    const userQuery = vocal.insertUserQuery(userId, email, address, username);
                    console.log('userQuery', userQuery);
                    pool.query(userQuery, (err, result) => {
                        console.log('insert user', err, JSON.stringify(result));
                        if (err) {
                            console.error('create user error', err);
                            // TODO: fix and silently continue.
                        }
                    });
                }

                // Return the auth token after the user is confirmed.
                admin.auth().createCustomToken(userId).then((customToken) => {
                    // Send token back to client.
                    console.log(userId, customToken);
                    db.users.assignToken(userId, customToken);
                    return res.json({
                        "token": customToken,
                        "address": address
                    });
                }).catch((error) => {
                    console.error("Error creating custom token:", error);
                    return res.json(error);
                });

            });

        });
    } catch (e) {
        return res.json(e);
    }
});

/* Query methods */

app.get('/api/balance/:userId', passport.authenticate('bearer', {
    session: false
}), (req, res) => {
    const userId = req.params.userId;
    try {
        getAddressAndExecute(userId, (address) => {
            // const balanceFromBlockchain = contract.getBalance(address);
            // return res.json(balanceFromBlockchain);
            getBalanceAndExecute(address, (balance) => {
                res.json(balance);
            });
        });
    } catch (err) {
        return res.json(err);
    }
});

app.get('/api/address/:userId', passport.authenticate('bearer', {
    session: false
}), (req, res) => {
    const userId = req.params.userId;
    try {
        getAddressAndExecute(userId, (address) => {
            return res.json(address);
        });
    } catch (err) {
        return res.json(err)
    }
});

// app.post('/api/vocal/modify', passport.authenticate('bearer', {
//     session: false
// }), (req, res) => {
//     const body = req.body;
//     const userId = body.userId;
//     const amount = body.amount;
//     try {
//         getAddressAndExecute(userId, (address) => {
//             const amount = vocal.calculateVocalCredit(userId);

//             // TODO: this should manipulate the blockchain, and return a success response for adding amount to
//             // the user's token balance.
//             // i.e. some call like contract.sendVocal(amount, etc...) should be here.
//             const query = vocal.modifyBalance(address, amount);
//             pool.query(query, (err, result) => {
//                 console.log('modify balance', query, err, result)
//                 if (err) {
//                     console.error('modify balance error', err);
//                     return res.status(500).json(err);
//                 }
//                 return res.json(true);
//             });

//         });
//     } catch (err) {
//         return res.json(err)
//     }
// });

app.post('/api/address/update', passport.authenticate('bearer', {
    session: false
}), (req, res) => {
    const query = vocal.updateAddressQuery(userId, address)
    pool.query(query, (err, result) => {
        console.log('update address', err, result)
        if (err) {
            console.error('update address error', err);
            return res.status(500).json(err);
        }
        // pool.end()
        return res.json(result.rows);
    });
    // TODO: update this to change the registered public eth address of the give user (indicated by their userId).
    return res.json(true);
});


/**
 * End of Blockchain Routes
 */

// Socket IO handlers //

io.origins('*:*') // for latest version
io.on('connection', function (client) {
    client.on('connect', function () {
        console.log('user connect');
    });
    client.on('action', function (event) {
        const query = vocal.insertEventQuery(event.name, event.time);
        pool.query(query);
        console.log('action', JSON.stringify(event));
        io.emit('incoming', event)
    });
    client.on('disconnect', function () {
        console.log('user disconnect');
    });
});

// DB Connection and Server start //

pool.connect((err, client, done) => {
    if (err) {
        console.error('postgres connection error', err)
        if (prod) {
            console.error('exiting')
            return;
        }
        console.error('continuing with disabled postgres db');
    }

    server.listen(PORT, () => {
        console.log('Express server listening on localhost port: ' + PORT);
    });
})
