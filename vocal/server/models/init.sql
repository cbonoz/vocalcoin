-- DROP DATABASE IF EXISTS vocal;
CREATE DATABASE vocal;

\c vocal;

-- TODO: finalize first version of schema
-- Need to determine mechanism to retrieve/track historic balances of the user,
--  whether that be tracked here or through solidity.
CREATE TABLE transactions (
  ID SERIAL PRIMARY KEY,
  source VARCHAR,
  destination VARCHAR,
  amount BIGINT,
  time BIGINT
);

CREATE TABLE balances (
  ID SERIAL PRIMARY KEY,
  email VARCHAR,
  balance BIGINT,
  time BIGINT
);

/* For socket io */
CREATE TABLE users (
  ID SERIAL PRIMARY KEY,
  email VARCHAR,
  address VARCHAR
);

/* For socket io */
CREATE TABLE events (
  ID SERIAL PRIMARY KEY,
  name VARCHAR,
  time BIGINT
);

-- TODO: add issues table 
-- (or figure out alternative way of indexing/aggregating user issues with the vocal label )

-- INSERT INTO events (name, time)
--   VALUES ('new registration', '1');

-- INSERT INTO issues (id, body, url, languages, title, created, state, creator)
-- VALUES (85198176 ,'Toast Hackathon 3/16/17 - Preorder Aggregation Server',
--         'https://api.github.com/repos/cbuonocore-toasttab/toast-hack-preorder',
--         'JavaScript', 'toast-hack-preorder', '2017-03-16T13:19:40Z', 'open', 'dockerz'
--         );

-- INSERT INTO issues (id, body, url, languages, title, created, state, creator)
-- VALUES (1234 ,'Testing',
--         'https://api.github.com/repos/cbuonocore-toasttab/toast-hack-preorder',
--         'JavaScript', 'test', '2017-03-16T13:19:40Z', 'open', 'rtre84'
--         );