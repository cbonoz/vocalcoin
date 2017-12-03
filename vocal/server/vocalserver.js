'use strict';
// Server code for vocal project.
// Author: Chris Buonocore (2017)
// License: Apache License 2.0

const axios = require('axios');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');
const https = require('https');
const pg = require('pg');
const path = require('path');

// Variable and Server Setup //
const prod = false;

// custom libraries.
const vocal = require('./vocal');

const dbUser = process.env.ADMIN_DB_USER;
const dbPass = process.env.ADMIN_DB_PASS;
const dbName = 'vocal';
const connectionString = process.env.VOCAL_DATABASE_URL || `postgres://${dbUser}:${dbPass}@localhost:5432/${dbName}`;
console.log('connectionString', connectionString);

const pool = new pg.Pool({
    connectionString: connectionString,
})

const PORT = 9007;

const app = express();
const server = require('http').createServer(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const whitelist = ['https://vocalcoin.com', 'https://www.vocalcoin.com'];
app.use(cors({ origin: whitelist }));

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

api.get('/api/issues/region', (req, res) => {

});

app.post('/api/vote', (req, res) => {
    const body = req.body;
    const vote = body.vote;
    const query = vocal.insertVoteQuery(vote);

    pool.query(query, (err, result) => {
        console.log('postVote', err, count, result)
        if (err) {
            console.error('balance error', err);
            return res.status(500).json(err);
        }
        // pool.end()
        return res.json(result.rows);
    });
});

app.post('/api/issue', (req, res) => {
    const body = req.body;
    const issue = body.issue;
    const query = vocal.insertIssueQuery(issue);

    pool.query(query, (err, result) => {
        console.log('postIssue', err, count, result)
        if (err) {
            console.error('balance error', err);
            return res.status(500).json(err);
        }
        // pool.end()
        return res.json(result.rows);
    });

});

// TODO: each request below should do an address lookup (based on the past in email) to find the appropriate address to credit or find the balance for.
// TODO: this request queries the BLOCKCHAIN for the current balance.
app.get('/api/balance/current', (req, res) => {
    const email = req.params.email;
    // TODO: query the blockchain (instead of the local db) for the most recent balance for the user.
    pool.query(`SELECT * FROM balance where email='${email}'ORDER BY time DESC limit 1`, (err, result) => {
        console.log('balance', err, count, result)
        if (err) {
            console.error('balance error', err);
            return res.status(500).json(err);
        }
        // pool.end()
        return res.json(result.rows);
    });
});

// TODO: this request queries POSTGRES for transactions/credits to the user (email) that have NOT been processed yet.
app.get('/api/balance/pending', (req, res) => {
    const email = req.params.email;

    // TODO: Query the infura test network for the most recent balance of the user via jsonrpc call after
    // deploying contracts to Infura Test framework.




    // TODO: query the blockchain (instead of the local db) for the most recent balance for the user.
    pool.query(`SELECT * FROM balance where email='${email}'ORDER BY time DESC limit 1`, (err, result) => {
        console.log('balance', err, count, result)
        if (err) {
            console.error('balance error', err);
            return res.status(500).json(err);
        }
        // pool.end()
        return res.json(result.rows);
    })
});

// Check if the given email param exists in the DB and contains a non-null address.
app.get('/api/address', (req, res) => {
    const email = req.params.email;
    pool.query(`SELECT * FROM users where email='${email}'`, (err, result) => {
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

app.post('/api/address/update', (req, res) => {
    const body = req.body;
    const email = body.email;
    const address = body.address;

    // TODO: update this to change the registered public eth address of the give user (indicated by their email).
    return res.json(true);
    // pool.query(`SELECT * FROM transactions where email='${email}'`, (err, result) => {
    //     console.log('transactions', err, count, result)
    //     if (err) {
    //       console.error('transactions error', err);
    //       return res.status(500).json(err);
    //     }
    //     // pool.end()
    //     return res.json(result.rows);
    //   });

});

// @Deprecated
app.get('/api/history', (req, res) => {
    const email = req.params.email;
    pool.query(`SELECT * FROM balance where email='${email}'`, (err, result) => {
        console.log('history', err, count, result)
        if (err) {
            console.error('history error', err);
            return res.status(500).json(err);
        }
        // pool.end()
        return res.json(result.rows);
    });
});

// TODO: query the blockchain for the transactions submitted by the given email (using the address lookup).
app.get('/api/transactions', (req, res) => {
    const email = req.params.email;
    pool.query(`SELECT * FROM transactions where email='${email}'`, (err, result) => {
        console.log('transactions', err, count, result)
        if (err) {
            console.error('transactions error', err);
            return res.status(500).json(err);
        }
        // pool.end()
        return res.json(result.rows);
    });
});

// TODO: use the email to do an address lookup to add the vocal coin to the user's account.
app.post('/api/vocal/add', (req, res) => {
    const body = req.body;
    const email = body.email;
    if (!email) {
        return res.status(400).json({ message: "email must be defined" });
    }

    // calculate the amount of vocal to credit based on the email (TODO: and other params).
    const amount = vocal.calculateVocalCredit(email);

    // TODO: add insert query into the blockchain or transactions db BEFORE processing the modify request to the balance.
    // If for some reason the request fails (either) rolls back the entire transaction.

    // If the email is in the DB, modify the balance by amount, else create a new balance 
    //TODO: make this an update query, or insert.
    pool.query(`SELECT * FROM balance where email='${email}'`, (err, result) => {
        console.log('vocal add', err, count, result)
        if (err) {
            console.error('vocal add error', err);
            return res.status(500).json(err);
        }
        // pool.end()
        return res.json(result.rows);
    });

});

// Socket IO handlers //

io.origins('*:*') // for latest version
io.on('connection', function (client) {
    client.on('connect', function () {
        console.log('user connect');
    });
    client.on('action', function (event) {
        pool.query('INSERT INTO events(name, time) values($1, $2)', [event.name, event.time]);
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