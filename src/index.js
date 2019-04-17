const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const app = express();
const port = 8080;

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  let db = new sqlite3.Database(
    "./src/valve.geodatabase",
    sqlite3.OPEN_READONLY,
    err => {
      if (err) {
        console.error(err.message);
      }
      console.log("Connected to the chinook database.");
    }
  );
  db.serialize(() => {
    db.all(
      `SELECT 'wCurbStopValve' as table_name, ObjectId as id, LocDesc as description, Point_x as longitude, Point_y as latitude FROM wCurbStopValve UNION ALL
      SELECT 'wSystemValve' as table_name, ObjectId as id, LocDesc as description, Point_x as longitude, Point_y as latitude FROM  wSystemValve`,
      (err, rows) => {
        if (err) {
          console.error(err.message);
        }
        res.send(rows);
      }
    );
  });

  db.close(err => {
    if (err) {
      console.error(err.message);
    }
    console.log("Close the database connection.");
  });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
