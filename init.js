const sqlite3 = require("sqlite3");
const sqltools = require("./sql.js");

const main = async () => {
  const db = new sqlite3.Database(
    "urls.db",
    sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE
  );

  try {
    await sqltools.execute(
      db,
      `DROP TABLE IF EXISTS urls;

CREATE TABLE urls (
id INTEGER PRIMARY KEY,
shortcode TEXT NOT NULL,
redirect TEXT NOT NULL
);`
    );
    console.log("created table");
  } catch (err) {
    console.log(err);
  } finally {
    db.close();
  }
};

main();
