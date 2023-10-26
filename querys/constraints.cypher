// Alcohol data
CREATE CONSTRAINT FOR (a:Alcohol) REQUIRE (a.title), (a.dbid) IS UNIQUE;

// Tag data
CREATE CONSTRAINT FOR (t:Tag) REQUIRE (t.title) IS UNIQUE;

// Tag Group data
CREATE CONSTRAINT FOR (tg:TagGroup) REQUIRE (tg.title) IS UNIQUE;

// User data
CREATE CONSTRAINT FOR (u:User) REQUIRE (u.dbid) IS UNIQUE;
