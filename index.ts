import express from "express";
import * as pg from "pg";
import { visitFunctionBody } from "typescript";
import * as util from "util";
import * as uuid from "uuid";
import * as http from "http";

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

async function checkLoggedIn(
  headers: http.IncomingHttpHeaders,
  res: any // TODO: Figure out the right type for our HTTP responses.
): Promise<boolean> {
  const sessionKey = headers["gec-session-key"];
  console.log("Request made", { sessionKey });

  if (typeof sessionKey !== "string") {
    sessionKey;
    res.send(
      "Invalid request - multiple or zero header values for session key"
    );
    return false;
  }

  if (!(await isLoggedIn(sessionKey))) {
    res.send("You are not logged in");
    return false;
  }

  return true;
}

app.get("/events", async (req, res) => {
  if (!(await checkLoggedIn(req.headers, res))) {
    return;
  }

  console.log("querystring", req.query);

  const groupId = req.query["group_id"];

  if (typeof groupId !== "string") {
    res.send("Group ID not provided");
    console.log(groupId);
    return;
  }

  const events = await getAllEventsForGroup(groupId);

  const eventsObject: Record<string, { name: string, location: string, startDate: Date, endDate: Date }> = {};

  for (const event of events) {
    eventsObject[event.id] = { name: event.name, location: event.location, startDate: event.startDate, endDate: event.endDate };
  }

  res.send(eventsObject);
});

app.get("/groups", async (req, res) => {
  if (!(await checkLoggedIn(req.headers, res))) {
    return;
  }

  const groups = await getAllGroups();
  const groupsObject: Record<string, { name: string }> = {};

  for (const group of groups) {
    groupsObject[group.id] = { name: group.name };
  }

  res.send(groupsObject);
});

// curl --verbose -X PUT http://localhost:3000/groups  -H 'Content-Type: application/json' -H 'GEC-Session-Key: abc5365731695765183758165253' -d '{"name": "lucy group"}'
app.put("/groups", async (req, res) => {
  if (!(await checkLoggedIn(req.headers, res))) {
    return;
  }

  console.log("Request", req.body);

  const body: unknown = req.body;

  if (!(typeof body === "object" && body !== null)) {
    res.send("not an object");
    return;
  }

  if (!("name" in body)) {
    res.send("name missing");
    return;
  }
  // TODO: Improve type checking with superstruct library or similar.
  await addNewGroup((body as any).name);

  res.send({ ok: {} });
});

//
app.delete("/groups/:id", async (req, res) => {
  if (!(await checkLoggedIn(req.headers, res))) {
    return;
  }

  console.log("Request", req.body);

  await deleteGroup(req.params.id);
  res.send("test delete");
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

async function getAllEventsForGroup(
  id: string
): Promise<Array<{ id: string; name: string; location: string; startDate: Date; endDate: Date }>> {
  const client = await getPgClient();
  const res = await client.query(
    `SELECT "id", "name", "location", "start_date", "end_date" FROM "event" WHERE "group_id" = $1`,
    [id]
  );

  console.log(util.inspect(res.rows, { colors: true, depth: Infinity }));
  await client.end();
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

async function deleteGroup(id: string): Promise<void> {
  const client = await getPgClient();
  await client.query(`DELETE FROM "group" WHERE "id" = $1`, [id]);
  await client.end();
}
