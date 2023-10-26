import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import neo4j from 'neo4j-driver';

dotenv.config();

let driver;
try {
  const [neoid, neopw] = process.env.NEO4J_AUTH.split('/');
  driver = neo4j.driver(
    process.env.DATABASE_URI,
    neo4j.auth.basic(neoid, neopw)
  );
  const serverInfo = await driver.getServerInfo();
  console.log('Connection established');
  console.log(serverInfo);
} catch (err) {
  console.log(`Connection error\n${err}\nCause: ${err.cause}`);
  process.exit(1);
}

const app = express();
const port = process.env.SERVER_PORT;

if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined'));
} else {
  app.use(morgan('dev'));
}

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(
    `Example app listening on port ${port} with ${process.env.NODE_ENV}`
  );
});

await driver.close();
