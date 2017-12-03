Author: Chris Buonocore
Vocal Coin

-- TODO: Figure out migration strategy, rather than drop,  qif these schemas need to evolve once deployed (they almost certainly will).
-- DROP DATABASE IF EXISTS vocal;
CREATE DATABASE vocal;

\c vocal;

-- TODO: finalize first version of schema
-- Need to determine mechanism to retrieve/track historic balances of the user,
--  whether that be tracked here or through solidity. (removed for now)
-- CREATE TABLE transactions (
--   ID SERIAL PRIMARY KEY,
--   source VARCHAR,
--   destination VARCHAR,
--   amount BIGINT,
--   time BIGINT
-- );

-- A votable topic that can be voted on via an entry in the table below
CREATE TABLE issues (
  ID SERIAL PRIMARY KEY,
  user_id SERIAL FOREIGN KEY,
  description VARCHAR,
  title VARCHAR,
  time BIGINT
)

-- Represents a user vote marker and message stored on the map
CREATE TABLE votes (
  ID SERIAL PRIMARY KEY,
  issue_id SERIAL FOREIGN KEY,
  user_id SERIAL FOREIGN KEY,
  lat float(7),
  lng float(7),
  time BIGINT,
  message VARCHAR
)

-- Represents the vocal balances for each user
-- TODO: remove this, should be stored on the blockchain
CREATE TABLE balances (
  ID SERIAL PRIMARY KEY,
  user_id SERIAL FOREIGN KEY,
  balance BIGINT,
  time BIGINT
);

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

-- INSERT INTO users (id, email, address)
--   VALUES (1, 'test@anupvasudevan.com', 'test34243278o324test34');

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