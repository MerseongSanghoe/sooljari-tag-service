// @ts-check
import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import neo4j, { Driver } from 'neo4j-driver';
import mysql from 'mysql';

dotenv.config();

/**
 *  Connect to neo4j tag database
 */
/** @type {Driver} */
let tagDriver;
try {
  const [neoid, neopw] = process.env.NEO4J_AUTH?.split('/') ?? ['', ''];
  tagDriver = neo4j.driver(
    process.env.TAG_DATABASE_HOST ?? '',
    neo4j.auth.basic(neoid, neopw),
    { disableLosslessIntegers: true } // 없으면 숫자가 { low, high }로 나옴
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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hello world!');
});

app.get('/tag/byalc/:alcId', async (req, res) => {
  // node 개수 확인해 없으면 return 404
  const { records: nodeCount } = await tagDriver.executeQuery(
    'MATCH (a:Alcohol {dbid: $dbid}) RETURN count(a) AS count',
    { dbid: parseInt(req.params.alcId, 10) },
    { database: 'neo4j' }
  );

  if (nodeCount[0].get('count') <= 0) {
    res.status(404).send({
      data: [],
      err: `No alcohol node with ${req.params.alcId}`,
      count: 0,
    });
    return;
  }

  const { records } = await tagDriver.executeQuery(
    'MATCH (a:Alcohol {dbid: $dbid})-[i:LINKED]->(t:Tag)\
    RETURN a, t.title AS tag, i.weight AS weight\
    ORDER BY i.weight;',
    { dbid: parseInt(req.params.alcId, 10) },
    { database: 'neo4j' }
  );
  const toSend = records.map((e) => {
    return {
      title: e.get('tag'),
      weight: e.get('weight'),
    };
  });

  res.status(200).send({
    data: toSend,
    count: records.length,
  });
});

app.get('/tag/bytag/:tagTitle', async (req, res) => {
  // node 개수 확인해 없으면 return 404
  const { records: nodeCount } = await tagDriver.executeQuery(
    'MATCH (t:Tag {title: $title}) RETURN count(t) AS count',
    { title: req.params.tagTitle },
    { database: 'neo4j' }
  );

  if (nodeCount[0].get('count') <= 0) {
    res.status(404).send({
      data: [],
      err: `No tag node with ${req.params.tagTitle}`,
      count: 0,
    });
    return;
  }

  const { records } = await tagDriver.executeQuery(
    'MATCH (t:Tag {title: $title})<-[i:LINKED]-(a:Alcohol)-[n:LINKED]->(t2:Tag)\
    RETURN i.weight AS weight, a AS alcohol, collect({title: t2.title, weight: n.weight}) AS otherTags\
    ORDER BY i.weight;',
    { title: req.params.tagTitle },
    { database: 'neo4j' }
  );
  const toSend = records.map((e) => {
    const alc = e.get('alcohol');
    return {
      weight: e.get('weight'),
      id: alc.id,
      title: alc.title,
      degree: alc.degree,
      category: alc.category,
      otherTags: e.get('otherTags'),
    };
  });

  res.status(200).send({
    data: toSend,
    count: records.length,
  });
});

app.post('/_local/alcohol-update', (req, res) => {
  console.warn('Alcohol database update start...');

  let mainSql = 'SELECT id, title FROM alcohols;';
  mainConn.query(mainSql, async (err, rows) => {
    if (err) throw err;
    for (let i = 0; i < rows.length; ++i) {
      const data = rows[i];

      await tagDriver.executeQuery(
        'MERGE (al:Alcohol {dbid: $dbid})\
        SET al.title = $title, al.degree = $degree, al.category = $cate;',
        {
          dbid: parseInt(data.id, 10),
          title: data.title,
          degree: parseFloat(data.degree),
          cate: data.category,
        },
        { database: 'neo4j' }
      );
    }
    res.sendStatus(200);
    console.warn('Alcohol database update end');
  });
});

app.post('/_local/add-tag', async (req, res) => {
  /**
   * @type { {password: string, alcId: string, tags: {title: string, weight: string?}[]} }
   */
  const { password, alcId, tags } = req.body;
  const alcIdNum = parseInt(alcId, 10);

  if (password !== process.env.LOCAL_AUTH) {
    res.sendStatus(403);
    return;
  }
  if (
    alcId === undefined ||
    isNaN(alcIdNum) ||
    tags === undefined ||
    tags.length === 0
  ) {
    res.sendStatus(400);
    return;
  }

  for (let tag of tags) {
    if (tag.title === undefined) continue;

    let weight = parseInt(tag.weight ?? '0', 10);
    if (isNaN(weight)) weight = 0;

    await tagDriver.executeQuery(
      'MATCH (al:Alcohol {dbid: $dbid})\
      MERGE (tg:Tag {title: $title})\
      MERGE (al)-[ln:LINKED]->(tg)\
      ON MATCH SET ln.weight = ln.weight + $weight\
      ON CREATE SET ln.weight = $weight;',
      { dbid: alcIdNum, title: tag.title, weight: weight },
      { database: 'neo4j' }
    );
  }

  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(
    `neo4j api app listening on port ${port} with ${process.env.NODE_ENV}`
  );
});
