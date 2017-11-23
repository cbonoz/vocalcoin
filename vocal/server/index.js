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

const dbUser = process.env.ADMIN_DB_USER;
const dbPass = process.env.ADMIN_DB_PASS;
const dbName = 'vocal';
const connectionString = process.env.VOCAL_DATABASE_URL || `postgres://${dbUser}:${dbPass}@localhost:5432/${dbName}`;
console.log('connectionString', connectionString);

const pool = new pg.Pool({
    connectionString: connectionString,
})

const PORT = 9006;

const app = express();
const server = require('http').createServer(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const whitelist = ['https://vocalcoin.com', 'https://www.vocalcoin.com']
app.use(cors({ origin: whitelist }));

pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err)
    process.exit(-1)
})

// Endpoints //

app.get('/api/hello', (req, res) => {
    return res.json("hello world");
});

// app.get('/api/events/:count', (req, res, next) => {
//   const countParam = req.params.count === undefined ? null : req.params.count;
//   const count = Math.min(Math.abs(countParam), 8);

//   pool.query('SELECT * FROM events ORDER BY id DESC limit ' + count, (err, result) => {
//     console.log('getEvents', err, count, result)
//     if (err) {
//       console.error('events error', err);
//       return res.status(500).json(err);
//     }
//     // pool.end()
//     return res.json(result.rows);
//   })
// });


// // Perform the db search for the passed query -> return a list of active issue results
// app.post('/api/search', (req, res) => {
//     const body = req.body;
//     const query = body.query.toLowerCase();
//     // TODO: implement stronger search filtering (including languages).
//     pool.query("select * from issues where (body ILIKE $1 or title ILIKE $1)", [`%${query}%`],
//         function (err, result) {
//             if (err) {
//                 console.error('search error', err);
//                 return res.status(500).json(err);
//             }
//             return res.status(200).json(result.rows);
//         });
// });

// DB Connection and server start //

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