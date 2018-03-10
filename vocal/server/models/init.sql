-- Author: Chris Buonocore
-- Vocal Coin SQL schema setup code

-- DROP DATABASE IF EXISTS vocal;
CREATE DATABASE vocal;

\c vocal;
-- A votable topic that can be voted on via an entry in the table below
CREATE TABLE issues (
  ID SERIAL PRIMARY KEY,
  user_id VARCHAR NOT NULL,
  description VARCHAR,
  title VARCHAR NOT NULL,
  lat float(7),
  lng float(7),
  place VARCHAR,
  active BOOLEAN,
  time BIGINT
);

-- Represents a user vote marker and message stored on the map
CREATE TABLE votes (
  ID SERIAL PRIMARY KEY,
  issue_id SERIAL REFERENCES issues(ID),
  user_id VARCHAR NOT NULL,
  lat float(7),
  lng float(7),
  message VARCHAR,
  agree INT NOT NULL,
  time BIGINT
);

/* For socket io */
CREATE TABLE events (
  ID SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  time BIGINT
);

CREATE TABLE users (
  ID VARCHAR PRIMARY KEY,
  email VARCHAR NOT NULL,
  address VARCHAR,
  seed VARCHAR,
  username VARCHAR(16),
  pubkey VARCHAR,
  balance float(8) -- optional
);