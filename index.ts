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

  const eventsObject: Record<
    string,
    { name: string; location: string; startDate: Date; endDate: Date }
  > = {};

  for (const event of events) {
    eventsObject[event.id] = {
      name: event.name,
      location: event.location,
      startDate: event.startDate,
      endDate: event.endDate,
    };
  }

  console.log("LOGGY LOG JSON", JSON.stringify(eventsObject));

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

app.put("/events", async (req, res) => {
  if (!(await checkLoggedIn(req.headers, res))) {
    return;
  }

  console.log("Request", req.body);

  // TODO: Reduce copypasta, maybe use something like io-ts or superstruct to help here.

  const body: any = req.body;

  if (!(typeof body === "object" && body !== null)) {
    res.send("not an object");
    return;
  }

  if (!("name" in body)) {
    res.send("name missing");
    return;
  }

  if (!("location" in body)) {
    res.send("location missing");
    return;
  }

  let startDate: Date;
  if (("startDate" in body)) {
    const bodyStartDate = body.startDate;
    if (typeof bodyStartDate === "string") {
      startDate = new Date(bodyStartDate);
    } else {
      res.send("start date was unexpected type (not string)");
      return;
    }
  } else {
    res.send("start date missing");
    return;
  }

  let endDate: Date;
  if (("endDate" in body)) {
    const bodyEndDate = body.endDate;
    if (typeof bodyEndDate === "string") {
      endDate = new Date(bodyEndDate);
    } else {
      res.send("end date was unexpected type (not string)");
      return;
    }
  } else {
    res.send("end date missing");
    return;
  }

  if (!("groupId" in body)) {
    res.send("Group ID missing");
    return;
  }

  await addNewEvent(
    (body as any).name,
    (body as any).location,
    startDate,
    endDate,
    (body as any).groupId
  );
  res.send({ ok: {} });
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

async function getAllEventsForGroup(id: string): Promise<
  Array<{
    id: string;
    name: string;
    location: string;
    startDate: Date;
    endDate: Date;
  }>
> {
  const client = await getPgClient();
  const res = await client.query(
    `SELECT "id", "name", "location", "start_date", "end_date" FROM "event" WHERE "group_id" = $1`,
    [id]
  );

  console.log(util.inspect(res.rows, { colors: true, depth: Infinity }));
  await client.end();
  return res.rows.map((x) => ({
    id: x.id,
    name: x.name,
    location: x.location,
    startDate: x.start_date,
    endDate: x.end_date,
  }));
}

async function addNewGroup(name: string): Promise<void> {
  const client = await getPgClient();
  await client.query(`INSERT INTO "group" ("id", "name") VALUES ($1, $2)`, [
    uuid.v4(),
    name,
  ]);
  await client.end();
}

async function addNewEvent(
  name: string,
  location: string,
  startDate: Date,
  endDate: Date,
  groupId: string
): Promise<void> {
  const client = await getPgClient();
  const res = await client.query(
    'INSERT INTO "event" ("id", "name", "location", "start_date", "end_date", "group_id") VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [uuid.v4(), name, location, startDate, endDate, groupId]
  );

  console.log(util.inspect(res.rows, { colors: true, depth: Infinity }));
  await client.end();

}

async function deleteGroup(id: string): Promise<void> {
  const client = await getPgClient();
  await client.query(`DELETE FROM "group" WHERE "id" = $1`, [id]);
  await client.end();
}
