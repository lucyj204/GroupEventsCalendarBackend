CREATE TABLE "group" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

INSERT INTO "group" ("id", "name") VALUES ('321413513', 'London dnb crew');
INSERT INTO "group" ("id", "name") VALUES ('4134324234', 'Brighton dingbats');
INSERT INTO "group" ("id", "name") VALUES ('43124324', 'Family');
INSERT INTO "group" ("id", "name") VALUES ('32143242341', 'Football team');


CREATE TABLE "session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user" TEXT NOT NULL,
    "expiry" TEXT NOT NULL
);

INSERT INTO "session" ("id", "user", "expiry") VALUES ('abc5365731695765183758165786', 'lucyj204', '2021-11-30T00:11:00Z');
INSERT INTO "session" ("id", "user", "expiry") VALUES ('abc5365731695765183758165253', 'lucyj20', '2021-11-30T00:11:00Z');
INSERT INTO "session" ("id", "user", "expiry") VALUES ('abc5365731695765183758165352', 'lucyj2', '2021-11-30T00:11:00Z');
INSERT INTO "session" ("id", "user", "expiry") VALUES ('abc5365731695765183758162362', 'lucyj2040', '2021-11-30T00:11:00Z');
INSERT INTO "session" ("id", "user", "expiry") VALUES ('abc5365731695765183758162322', 'lucyj4', '2021-11-30T00:11:00Z');
INSERT INTO "session" ("id", "user", "expiry") VALUES ('abc5365731695765183757586844', 'lucyj0', '2021-11-30T00:11:00Z');
