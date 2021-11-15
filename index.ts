import express from "express";
import * as pg from "pg";
import * as util from "util";
import * as uuid from "uuid";

const app = express();
const port = 3000;

type SessionKey = string;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/bananas", (req, res) => {
  res.send("mmmm bananas");
});

app.get("/groups", async (req, res) => {
  const sessionKey = req.headers["gec-session-key"];
  console.log("Request made", { sessionKey });

  if (typeof sessionKey !== "string") {
    sessionKey;
    res.send(
      "Invalid request - multiple or zero header values for session key"
    );
    return;
  }

  if (await isLoggedIn(sessionKey)) {
    const groups = await getAllGroups();
    const groupsObject: Record<string, { name: string }> = {};

    for (const group of groups) {
      groupsObject[group.id] = { name: group.name };
    }

    res.send(groupsObject);
  } else {
    res.send("You are not logged in");
  }
});

// curl --verbose -X PUT http://localhost:3000/groups  -H 'Content-Type: application/json' -H 'GEC-Session-Key: abc5365731695765183758165253' -d '{"name": "lucy group"}'
app.put("/groups", async (req, res) => {
  console.log("Request", req.body);

  const body = req.body;

  addNewGroup(body.name);

  res.send("test");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

async function getPgClient(): Promise<pg.Client> {
  const client = new pg.Client({
    user: "postgres",
    password: "mysecretpassword",
  });
  await client.connect();
  return client;
}

async function isLoggedIn(id: string): Promise<boolean> {
  const client = await getPgClient();
  const res = await client.query(`SELECT "id" FROM "session" WHERE id = $1`, [
    id,
  ]);
  await client.end();

  return res.rows.length === 1;
}

async function getAllGroups(): Promise<Array<{ id: string; name: string }>> {
  const client = await getPgClient();
  const res = await client.query(`SELECT "id", "name" FROM "group"`);
  console.log(util.inspect(res.rows, { colors: true, depth: Infinity }));
  await client.end();
  // WARNING: res.rows is any here - we must guarantee ourselves that the data has both id and name properties.
  return res.rows;
}

async function addNewGroup(name: string): Promise<void> {
  const client = await getPgClient();
  await client.query(`INSERT INTO "group" ("id", "name") VALUES ($1, $2)`, [
    uuid.v4(),
    name,
  ]);
  await client.end();
}

// curl --verbose -X PUT http://localhost:3000/groups  -H 'Content-Type: application/json' -H 'GEC-Session-Key: abc5365731695765183758165253' -d '{"name": "lucy group"}'
