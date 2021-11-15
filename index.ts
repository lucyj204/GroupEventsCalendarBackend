import express from "express";
import * as pg from "pg";
const app = express();
const port = 3000;

type SessionKey = string;

const SESSIONS = {
  abc5365731695765183758165786: {
    user: "lucyj204",
    expiry: "2021-10-30T00:11:00Z",
  },
  abc5365731695765183758165253: {
    user: "lucyj204",
    expiry: "2021-10-30T00:11:00Z",
  },
  abc5365731695765183758165352: {
    user: "lucyj204",
    expiry: "2021-10-30T00:11:00Z",
  },
  abc5365731695765183758162362: {
    user: "lucyj204",
    expiry: "2021-10-30T00:11:00Z",
  },
  abc5365731695765183758162322: {
    user: "lucyj204",
    expiry: "2021-10-30T00:11:00Z",
  },
  abc5365731695765183757586844: {
    user: "alexweej",
    expiry: "2021-10-30T00:11:00Z",
  },
  // image there's loads
};

const GROUPS = {
  "321413513": { name: "London dnb crew" },
  "64737": { name: "Brighton dingbats" },
  "753737": { name: "Family" },
  "846868": { name: "Football team" },
};

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/bananas", (req, res) => {
  res.send("mmmm bananas");
});

app.get("/groups", (req, res) => {
  const sessionKey = req.headers["gec-session-key"];
  console.log('Request made', {sessionKey})
  
  if (typeof sessionKey !== "string") {
    sessionKey;
    res.send(
      "Invalid request - multiple or zero header values for session key"
      );
    return;
  }

  if (Object.prototype.hasOwnProperty.call(SESSIONS, sessionKey)) {
    res.send(GROUPS);
  } else {
    res.send("You are not logged in");
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

async function testPg() {
  const client = new pg.Client({user: "postgres", password: "mysecretpassword"});
  await client.connect();
  const res = await client.query("SELECT 1");
  console.log({res});
  await client.end();
}

testPg();