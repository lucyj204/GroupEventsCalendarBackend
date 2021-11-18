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

CREATE TABLE "event" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "event_name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "start_date" TEXT NOT NULL,
    "end_date" TEXT NOT NULL,
    "group_id" REFERENCES group(id)
);

INSERT INTO "event" ("id", "event_name", "location", "start_date", "end_date", "group_id") VALUES ('342561840597', 'Spearhead', 'E1', '11/20/21 5:00 PM', '11/20/21 11:00 PM', '321413513');
INSERT INTO "event" ("id", "event_name", "location", "start_date", "end_date", "group_id") VALUES ('342561840876', 'Kings of The Rollers', 'Printworks', '11/25/21 12:00 PM', '11/25/21 11:00 PM', '321413513');
INSERT INTO "event" ("id", "event_name", "location", "start_date", "end_date", "group_id") VALUES ('342561840597', 'Ham Samwich', 'Fortune of War', '12/2/21 5:00 PM', '12/2/21 11:00 PM', '4134324234');
INSERT INTO "event" ("id", "event_name", "location", "start_date", "end_date", "group_id") VALUES ('342561840597', 'Pub Night', 'The Eagle Tavern', '11/20/21 7:00 PM', '11/20/21 1:00 AM', '4134324234');
INSERT INTO "event" ("id", "event_name", "location", "start_date", "end_date", "group_id") VALUES ('342561840597', 'Dinner', '22 Watts Avenue', '11/27/21 5:00 PM', '11/27/21 11:00 PM', '43124324');
INSERT INTO "event" ("id", "event_name", "location", "start_date", "end_date", "group_id") VALUES ('342561840597', 'Mixed Ability Match', 'Hackney Playing Field', '11/21/21 11:00 AM', '11/21/21 2:00 PM', '32143242341');

