// @ts-check
import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import neo4j from 'neo4j-driver';
import mysql from 'mysql';

dotenv.config();

/**
 *  Connect to neo4j tag database
 */
let tagDriver;
try {
  const [neoid, neopw] = process.env.NEO4J_AUTH?.split('/') ?? ['', ''];
  tagDriver = neo4j.driver(
    process.env.TAG_DATABASE_HOST ?? '',
    neo4j.auth.basic(neoid, neopw)
  );
  const serverInfo = await tagDriver.getServerInfo();
  console.log('Connection established');
  console.log(serverInfo);
} catch (err) {
  console.log(`Tag Database Connection error\n${err}\nCause: ${err.cause}`);
  process.exit(1);
}

/**
 * Connect to alcohol main database
 */
/** @type {mysql.ConnectionConfig} */
const connectOption = {
  host: process.env.MAIN_DATABASE_HOST,
  user: process.env.MAIN_DATABASE_USERNAME,
  password: process.env.MAIN_DATABASE_PASSWORD,
  database: process.env.MAIN_DATABASE_NAME,
};
/** @type {mysql.Connection} */
let mainConn;
try {
  mainConn = mysql.createConnection(connectOption);
  console.log('Connection established');
  console.log({ ...connectOption, password: undefined });
} catch (err) {
  console.log(`Main Database Connection error\n${err}\nCause: ${err.cause}`);
  process.exit(1);
}

/**
 * Start server
 */
const app = express();
const port = process.env.SERVER_PORT;

if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined'));
} else {
  app.use(morgan('dev'));
}

app.get('/', (req, res) => {
  res.send('Hello world!');
});

app.get('/tag/byalc/:alcId', (req, res) => {
  res.send('Not implemented');
});

app.get('/tag/bytag/:tagId', (req, res) => {
  res.send('Not implemented');
});

app.post('/_local/alcohol-update', (req, res) => {
  let mainSql = 'SELECT id, title FROM alcohols;';
  mainConn.query(mainSql, (err, rows) => {
    if (err) throw err;
    res.send(rows);
  });
});

app.post('/_local/add-tag', (req, res) => {
  res.send('Not implemented');
});

app.listen(port, () => {
  console.log(
    `Example app listening on port ${port} with ${process.env.NODE_ENV}`
  );
});

await tagDriver.close();
