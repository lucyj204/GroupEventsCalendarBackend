import express from "express";
import * as pg from "pg";
import { isIfStatement } from "typescript";
import * as util from "util";

const app = express();
const port = 3000;

type SessionKey = string;

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
    groups[0].id;
    res.send(groups);
  } else {
    res.send("You are not logged in");
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

// Unused
async function testPg() {
  const client = new pg.Client({
    user: "postgres",
    password: "mysecretpassword",
  });
  await client.connect();
  const res = await client.query("SELECT 421424 AS foo;");
  console.log(util.inspect(res.rows, { colors: true, depth: Infinity }));
  await client.end();
}

async function isLoggedIn(id: string): Promise<boolean> {
  const client = new pg.Client({
    user: "postgres",
    password: "mysecretpassword",
  });
  await client.connect();
  const res = await client.query(`SELECT "id" FROM "session"`);
  console.log(util.inspect(res.rows, { colors: true, depth: Infinity }));
  await client.end();

  for (const row of res.rows) {
    if (row.id === id) {
      return true;
    }
  }
  return false;
}

async function getAllGroups(): Promise<Array<{ id: string; name: string }>> {
  const client = new pg.Client({
    user: "postgres",
    password: "mysecretpassword",
  });
  await client.connect();
  const res = await client.query(`SELECT "id", "name" FROM "group"`);
  console.log(util.inspect(res.rows, { colors: true, depth: Infinity }));
  await client.end();
  // WARNING: res.rows is any here - we must guarantee ourselves that the data has both id and name properties.
  return res.rows;
}
