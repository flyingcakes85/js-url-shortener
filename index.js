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

app.get("/", (req, res) => {
  res.send("Hello World!");
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
