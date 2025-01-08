const express = require("express");
const sqlite3 = require("sqlite3");
const sqltools = require("./sql.js");

const app = express();
const port = 3000;

function makeid(length) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/:shortcode", async (req, res) => {
  const shortcode = req.params.shortcode;
  const db = new sqlite3.Database("urls.db", sqlite3.OPEN_READ);

  try {
    const dest = await sqltools.fetchFirst(
      db,
      "SELECT redirect FROM urls WHERE shortcode = ?",
      [shortcode]
    );
    // db.close();

    if (typeof dest !== "undefined") {
      res.redirect(302, dest["redirect"]);
    } else {
      res.status(400).json({ msg: "not found" });
    }
  } catch (err) {
    console.log(err);
  } finally {
    db.close();
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

app.post("/", async (req, res) => {
  const dest = req.body.dest;
  const id = Math.floor(Math.random() * 98999999 + 1000000);
  const shortcode = makeid(4);

  const db = new sqlite3.Database("urls.db", sqlite3.OPEN_READWRITE);
  try {
    await sqltools.execute(
      db,
      "INSERT INTO urls (id, shortcode, redirect) VALUES (?,?,?)",
      [id, shortcode, dest]
    );
  } catch (err) {
    console.log(err);
  } finally {
    db.close();
  }
  res.status(200).json({
    id: id,
    shortcode: shortcode,
    dest: dest,
  });
});

app.delete("/", async (req, res) => {
  const id = req.body.id;
  const db = new sqlite3.Database("urls.db", sqlite3.OPEN_READWRITE);
  try {
    await sqltools.execute(db, "DELETE FROM urls WHERE id=?", id);
    res.status(200).json({ msg: "success" });
  } catch (err) {
    console.log(err);
  } finally {
    db.close();
  }
});
