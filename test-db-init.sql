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
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "start_date" TIMESTAMP NOT NULL,
    "end_date" TIMESTAMP NOT NULL,
    "group_id" TEXT REFERENCES "group"("id")
);

INSERT INTO "event" ("id", "name", "location", "start_date", "end_date", "group_id") VALUES ('342561840597', 'Spearhead', 'E1', '2021/11/20 18:00:00', '2021/11/20 23:00:00', '321413513');
INSERT INTO "event" ("id", "name", "location", "start_date", "end_date", "group_id") VALUES ('342561840876', 'Kings of The Rollers', 'Printworks', '2021/11/25 12:00:00', '2021/11/25 23:00:00', '321413513');
INSERT INTO "event" ("id", "name", "location", "start_date", "end_date", "group_id") VALUES ('342561265378', 'Ham Samwich', 'Fortune of War', '2021/12/02 17:00:00', '2021/12/02 23:00:00', '4134324234');
INSERT INTO "event" ("id", "name", "location", "start_date", "end_date", "group_id") VALUES ('342561814293', 'Pub Night', 'The Eagle Tavern', '2021/11/20 19:00:00', '2021/11/21 01:00:00', '4134324234');
INSERT INTO "event" ("id", "name", "location", "start_date", "end_date", "group_id") VALUES ('34256184309187', 'Dinner', '22 Watts Avenue', '2021/11/27 17:00:00', '2021/11/27 23:00:00', '43124324');
INSERT INTO "event" ("id", "name", "location", "start_date", "end_date", "group_id") VALUES ('34256184052731', 'Mixed Ability Match', 'Hackney Playing Field', '2021/11/21 11:00:00', '2021/11/21 14:00:00', '32143242341');
INSERT INTO "event" ("id", "name", "location", "start_date", "end_date", "group_id") VALUES ('34256165432', 'Liquicity', 'Electric Brixton', '2021/11/25 17:00:00', '2021/11/25 23:00:00', '321413513');
INSERT INTO "event" ("id", "name", "location", "start_date", "end_date", "group_id") VALUES ('342561235567', 'Lunch', 'Nandos', '2021/11/25 12:00:00', '2021/11/25 14:00:00', '321413513');
INSERT INTO "event" ("id", "name", "location", "start_date", "end_date", "group_id") VALUES ('3425677686786', 'Afterlife', 'Printworks', '2021/11/28 17:00:00', '2021/12/02 23:00:00', '321413513');
INSERT INTO "event" ("id", "name", "location", "start_date", "end_date", "group_id") VALUES ('3467678987532', 'Bcee', 'Peckham Audio', '2021/11/28 17:00:00', '2021/12/02 23:00:00', '321413513');
