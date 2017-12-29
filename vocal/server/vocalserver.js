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

const serviceAccount = require("./db/vocalfb.json");
// const wallet = require('lightwallet/lightwallet');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://vocalcoin-69799.firebaseio.com"
});

// Passport for middleware HTTP bearer authentication strategy for the blockchain routes
var passport = require('passport');
const Strategy = require('passport-http-bearer').Strategy;
var db = require('./db');

passport.use(new Strategy(
    function(token, cb) {
        db.users.findByToken(token, function(err, user) {
            if (err) { return cb(err); }
            if (!user) { return cb(null, false); }
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
const io = require('socket.io')(server, { origins: '*:*'});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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
        console.log('issues', err, count, result);
        if (err) {
            console.error('issues', err);
            return res.status(500).json(err);
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

app.post('/api/vote', passport.authenticate('bearer', { session: false }), (req, res) => {
    const body = req.body;
    const vote = body.vote;
    const checkVoteQuery = vocal.checkVoteQuery(vote);

    pool.query(checkVoteQuery, (err, result) => {
        console.log('postVote', err, result);
        if (err) {
            console.error('postVote error', err);
            return res.status(500).json({"error": err});
        }

        if (result.rows.length > 0) {
            // if we already have a vote for this user and issue, return.
            const errorMessage = "user already voted on this issue";
            console.error(errorMessage)
            return res.status(200).json({"error": errorMessage});
        }

        // Ok. Insert the vote into the DB.
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

app.post('/api/issue', passport.authenticate('bearer', { session: false }), (req, res) => {
    const body = req.body;
    const issue = body.issue;
    const query = vocal.insertIssueQuery(issue);

    pool.query(query, (err, result) => {
        console.log('postIssue', err, count, result)
        if (err) {
            console.error('postIssue error', err);
            return res.status(500).json(err);
        }
        // pool.end()
        return res.json(result.rows);
    });
});

app.post('/api/vocal/add', passport.authenticate('bearer', { session: false }), (req, res) => {
    const body = req.body;
    const userId = body.userId;
    if (!userId) {
        return res.status(400).json({ message: "userId must be defined" });
    }
    // calculate the amount of vocal to credit based on the userId (TODO: and other params).
    const amount = vocal.calculateVocalCredit(userId);
    const query = vocal.addVocalQuery(userId, amount);

    pool.query(query, (err, result) => {
        console.log('vocal add', err, count, result)
        if (err) {
            console.error('vocal add error', err);
            return res.status(500).json(err);
        }
        // pool.end()
        return res.json(result.rows);
    });
});

/* Dashboard routes */

app.get('/api/issues', passport.authenticate('bearer', { session: false }), (req, res) => {
    const userId = req.params.userId;
    const query = vocal.getIssuesForUserQuery(userId);
    pool.query(query, (err, result) => {
        console.log('getIssues', err, count, result)

        if (err) {
            console.error('getIssues error', err);
            return res.status(500).json(err);
        }
        // pool.end()
        return res.json(result.rows);
    });
});

app.get('/api/votes', passport.authenticate('bearer', { session: false }), (req, res) => {
    const userId = req.params.issueId;
    const query = vocal.getVotesForIssueQuery(issueId);

    pool.query(query, (err, result) => {
        console.log('getVotes', err, count, result)
        if (err) {
            console.error('getVotes error', err);
            return res.status(500).json(err);
        }
        // pool.end()
        return res.json(result.rows);
    });
});

/* Auth routes */

app.post('/api/signin', (req, res) => {
    const body = req.body;
    const userId = body.userId;

    admin.auth().createCustomToken(userId).then(function(customToken) {
        // Send token back to client.
        console.log(userId, customToken);
        db.users.assignToken(userId, customToken);
        return res.json({"token": customToken});
    })
    .catch(function(error) {
        console.error("Error creating custom token:", error);
        return res.json({"error": error});
    });
});

app.post('/api/user', passport.authenticate('bearer', { session: false }), (req, res) => {
    const body = req.body;
    const userId = body.userId;
    
    const query = vocal.getUserQuery(userId);
    pool.query(query, (err, result) => {
        console.log('get user', err, count, result)
        if (err) {
            console.error('get user error', err);
            return res.status(500).json(err);
        }
        const rows = result.rows;
        if (rows instanceof Array && rows[0]) {
            return res.json(rows[0]);
        } else {
            const username = body.username;
            const email = body.email;
            const account = contract.web3.eth.accounts.create();
            const address = account.address;
            const userQuery = vocal.insertUserQuery(userId, email, address, username);
            pool.query(userQuery, (err, result) => {
                if (err) {
                    console.error('create user error', err);
                    return res.status(500).json(err);
                }
                console.log('inserted new user', JSON.stringify(user));
                
                return res.json(result); 
            });
        }

        // pool.end()
    });
});

/* Query methods */

// TODO: each request below should do an address lookup (based on the past in userId) to find the appropriate address to credit or find the balance for.
// TODO: this request queries the BLOCKCHAIN for the current balance.
app.get('/api/balance', passport.authenticate('bearer', { session: false }), (req, res) => {
    const userId = req.params.userId;
    // TODO: query the blockchain (instead of the local db) for the most recent balance for the user.
    pool.query(`SELECT * FROM balance where userId='${userId}'ORDER BY time DESC limit 1`, (err, result) => {
        console.log('balance', err, count, result)
        if (err) {
            console.error('balance error', err);
            return res.status(500).json(err);
        }
        // pool.end()
        return res.json(result.rows);
    });
});

// Check if the given userId param exists in the DB and contains a non-null address.
app.get('/api/address', passport.authenticate('bearer', { session: false }), (req, res) => {
    const userId = req.params.userId;
    pool.query(`SELECT * FROM users where userId='${userId}'`, (err, result) => {
        console.log('verify address', err, count, result)
        if (err) {
            console.error('verify address', err);
            return res.status(500).json(err);
        }

        if (result.rows) {
            const userRow = result.rows[0];
            // TODO: use an actual ethereum address validator (rather than isBlank).
            const address = userRow['address']
            const hasAddress = !isBlank(address);
            if (hasAddress) {
                return res.json(address)
            }
        }

        // pool.end()
        return res.json("");
    });
});

app.post('/api/address/update', passport.authenticate('bearer', { session: false }), (req, res) => {
    const body = req.body;
    const userId = body.userId;
    const address = body.address;

    const query = vocal.updateAddressQuery(userId, address)
    // TODO: update this to change the registered public eth address of the give user (indicated by their userId).
    return res.json(true);
});

// TODO: query the blockchain for the transactions submitted by the given userId (using the address lookup).
app.get('/api/transactions', passport.authenticate('bearer', { session: false }), (req, res) => {
    const userId = req.params.userId;
    pool.query(`SELECT * FROM transactions where userId='${userId}'`, (err, result) => {
        console.log('transactions', err, count, result)
        if (err) {
            console.error('transactions error', err);
            return res.status(500).json(err);
        }
        // pool.end()
        return res.json(result.rows);
    });
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