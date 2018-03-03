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
const admin = require('firebase-admin');

const serviceAccount = require("./db/vocalfb.json");
const async = require('async');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://vocalcoin-69799.firebaseio.com"
});

// Passport for middleware HTTP bearer authentication strategy for the blockchain routes
const passport = require('passport');
const Strategy = require('passport-http-bearer').Strategy;
const db = require('./db');
const neolib = require('./neolib');

const requirePostgres = true;
const PORT = 9007;

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

// custom libraries.
const vocal = require('./vocal');

const dbUser = process.env.ADMIN_DB_USER;
const dbPass = process.env.ADMIN_DB_PASS;
const dbName = 'vocal';
const connectionString = process.env.VOCAL_DATABASE_URL || `postgres://${dbUser}:${dbPass}@localhost:5432/${dbName}`;
console.log('connectionString', connectionString);

const pool = new pg.Pool({
    connectionString: connectionString
});

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {origins: '*:*'});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// TODO: use reduced cors in production.
// const whitelist = ['https://vocalcoin.com', 'https://www.vocalcoin.com'];
// app.use(cors({ origin: whitelist }));

app.use(cors());

const ISSUE_COST = vocal.ISSUE_COST;

pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err)
    process.exit(-1)
});

app.get('/api/hello', (req, res) => {
    return res.json("hello world");
});

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

function getBalanceAndExecute(userId, cb) {

    getUserAndExecute(userId, (user) => {
        const keyPair = neolib.getKeyPairFromSecret(user.seed);
        console.log('got keypair', JSON.stringify(keyPair));
        // Get balances for the newly created account from the neolib blockchain.
        neolib.getBalances(keyPair, (account) => {
            // Select only the vocal coin balance.
            console.log('account', JSON.stringify(account));
            // TODO: replace once neolib fully in place.
            // const vocalBalance = neolib.getVocalBalance(account.balances);
            const vocalBalance = db.users.getBalance(userId);
            const retVal = {'address': keyPair.publicKey(), 'balance': vocalBalance};
            console.log('Vocal balance:', JSON.stringify(retVal));
            cb(retVal);
        });
    });
}

// Sends or Pulls money between the specified userId and the master (issuer) NEO account for Vocal.
function modifyBalanceAndExecute(userId, amount, cb) {
    try {
        let actionMessage;
        let sourceAddress;
        let sourceKey;
        let destAddress;
        getUserAndExecute(userId, (user) => {
            if (amount > 0) {
                sourceAddress = neolib.NEO_ISSUER_ADDRESS;
                sourceKey = neolib.NEO_ISSUER_SECRET;
                destAddress = user.address;
                actionMessage = user.username + " earned " + amount;
            } else if (amount < 0) {
                amount = -amount;
                sourceAddress = user.address;
                sourceKey = neolib.decryptKey(user.seed); // seed is encrypted on the user DB object.
                destAddress = neolib.NEO_ISSUER_ADDRESS;
                actionMessage = user.username + " used " + amount;
            } else {
                const errorMessage = "Not completed: 0 value transaction request for " + user.username;
                console.error(errorMessage);
                throw errorMessage;
            }

            // Convert the amount to a string for the neolib transaction.
            amount = amount.toString();
            console.log('amount: ' + amount + " " + typeof(amount));
            console.log('modifyBalanceAndExecute', from.publicKey(), to.publicKey(), amount, actionMessage);

            neolib.sendTransaction(sourceAddress, sourceKey, destAddress, amount, actionMessage,
                (msg) => {
                    console.log('success: ' + msg);
                    cb();
                }, (err) => {
                    console.error('neolib transaction error', JSON.stringify(err));
                    throw err;
                }
            );
        });
    } catch (e) {
        return res.status(500).json(e);
    }
}

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
            console.error(errorMessage);
            return res.status(401).json({data: errorMessage});
        }

        const amount = vocal.calculateVocalCredit(userId);
        // Credit the user.
        modifyBalanceAndExecute(userId, amount, () => {
            // Now add the vote.
            const voteQuery = vocal.insertVoteQuery(vote);
            pool.query(voteQuery, (err, result) => {
                console.log('postVote', err, result);
                if (err) {
                    console.error('postVote error', err);
                    return res.status(500).json(err);
                }
                // pool.end()
                return res.json(result.rows);
            });
        });
    });
});

app.post('/api/issue', passport.authenticate('bearer', {
    session: false
}), (req, res) => {
    const body = req.body;
    const issue = JSON.parse(body.issue);
    const userId = issue.userId;
    try {
        getBalanceAndExecute(userId, (balanceFromBlockchain) => {
            // const balanceFromBlockchain = contract.getBalance(address);
            const balance = parseFloat(balanceFromBlockchain['balance']);
            if (balance < ISSUE_COST) {
                const errorMessage = `Insufficient balance (${balance}), require ${ISSUE_COST}`;
                return res.status(401).json(new Error(errorMessage));
            }

            modifyBalanceAndExecute(userId, -ISSUE_COST, () => {
                // Now insert the new issue.
                const query = vocal.insertIssueQuery(issue);
                pool.query(query, (err, result) => {
                    console.log('postIssue', err, result);
                    if (err) {
                        console.error('postIssue error', err);
                        return res.status(500).json(new Error(err));
                    }
                    // pool.end()
                    return res.json(result.rows);
                });
            })

        })
    } catch (e) {
        return res.status(500).json(new Error(e));
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
        console.log('delete issue', err, result);
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

function getUserAndExecute(userId, cb) {
    const query = vocal.getUserQuery(userId);
    pool.query(query, (err, result) => {
        console.log('get user', err, result)

        if (err) {
            console.error('get user error', err);
            throw err;
        }

        const rows = result.rows;
        const user = rows[0];
        cb(user);
    });
}

app.post('/api/signin', (req, res) => {
    const body = req.body;
    console.log(body);
    const userId = body.userId;
    const email = body.email;
    const username = body.username;

    // Look up the user.

    const query = vocal.getUserQuery(userId);
    pool.query(query, (err, result) => {
        console.log('get user', err, result);

        if (err) {
            console.error('get user error', err);
            return res.status(500).json(err);
        }

        const rows = result.rows;

        if (rows instanceof Array && rows.length && rows[0] && rows[0]['address']) {
            const user = rows[0];
            // User already created with address.
            console.log('found user', user);
            const address = user['address'];

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

        } else {
            // User does not exist
            const username = body.username;
            const seed = neolib.createPrivateKey();
            const keypair = neolib.createKeyPair(seed);
            const publicKey = keypair.publicKey;
            const address = keypair.address;
            console.log('createNewUser', address, seed, publicKey);

            const encSeed = neolib.encryptKey(seed);

            neolib.createAccount(keypair,
                (accErr) => {
                    console.error('create account error', accErr);
                    return res.status(500).json(accErr);
                },
                (accRes) => {
                    const userQuery = vocal.insertUserQuery(userId, email, address, encSeed, username);
                    console.log('userQuery', userQuery);
                    pool.query(userQuery, (err, result) => {
                        console.log('insert user', err, JSON.stringify(result));
                        if (err) {
                            console.error('create user error', err);
                            return res.status(500).json(err);
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
                }
            );

        }

    });
});

/* Query methods */

app.get('/api/balance/:userId', passport.authenticate('bearer', {
    session: false
}), (req, res) => {
    const userId = req.params.userId;
    try {
        getBalanceAndExecute(userId, (retVal) => {
            res.json(retVal);
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
        return res.status(500).json(err)
    }
});

// Socket IO handlers //
io.origins('*:*'); // for latest version
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

neolib.getBalances(neolib.VOCAL_ISSUER_KEYPAIR, (vocalIssuerAccount) => {
    console.log('Vocal Issuer Account Balance', JSON.stringify(neolib.getVocalBalance(vocalIssuerAccount.balances)));


    pool.connect((err, client, done) => {
        if (err) {
            console.error('postgres connection error', err);
            if (requirePostgres) {
                console.error('exiting');
                return;
            }
            console.error('continuing with disabled postgres db');
        }

        server.listen(PORT, () => {
            console.log('Express server listening on localhost port: ' + PORT);
        });
    });
});
