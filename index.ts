import express from "express";
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
};

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/bananas", (req, res) => {
  res.send("mmmm bananas");
});

app.get("/groups", (req, res) => {
  const sessionKey = req.headers["gec-session-key"];

  //console.log({headers: req.headers});
  const validSessionKeys = Object.keys(SESSIONS);

  for (const validSessionKey of validSessionKeys) {
    //console.log({validSessionKey, sessionKey});
    if (sessionKey === validSessionKey) {
      res.send(GROUPS);
      return
    } 
  }
  res.send("You are not logged in");
  
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
