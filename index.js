import bodyParser from "body-parser";
import express from "express";
import PG from "pg";
import "dotenv/config";

let PORT = 5000;

let dbUser = process.env.POSTGRES_USER;
let dbHost = process.env.POSTGRES_HOST;
let dbItself = process.env.POSTGRES_DB;
let dbPass = process.env.POSTGRES_PASSWORD;
let dbPort = process.env.POSTGRES_PORT;
let timeout = 1500000;

const app = express();

const client = new PG.Client({
  user: dbUser,
  host: dbHost,
  database: dbItself,
  password: dbPass,
  port: dbPort
});

// connect once
client.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello world! 🚀");
});

app.get("/passengers", (req, res) => {
  console.log("Fetching passengers");

  let table = "passengers";
  let query = `SELECT * FROM ${table}`;
  let passengers = getInfo(query);

  res.send(passengers);
});

app.get("/passengers/:id", async (req, res, next) => {
  console.log(`Fetching passenger with ID ${req.params.id}`);

  let table = "passengers"
  let query = `SELECT * FROM ${table} WHERE id = $1`;
  let passenger = await getInfoById(query, req.params.id);

  console.log(`Fetched passenger ${passenger.rows[0].firstname} ${passenger.rows[0].lastname}`);

  res.send(passenger.rows[0]);
});

app.get("/flightinfo", async (req, res, next) => {
  console.log("Fetching flights");

  let table = "flightinfo";
  let query = `SELECT * FROM ${table}`;
  let flights = await getInfo(query);

  res.send(flights.rows);
});

app.get("/flightinfo/:id", async (req, res, next) => {
  let query = "SELECT * FROM flightinfo WHERE id = $1";
  let flight = await getInfoById(query, req.params.id);

  console.log(`Fetching flight ${flight.rows[0].flightnumber}`);

  res.send(flight.rows);
});

async function getInfo(query) {
  return await client.query(query);
}

async function getInfoById(query, id) {
  return await client.query(query, [id]);
}

function generateString(characters, length) {
  var result = "";
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
   }
   return result;
}

// send url from postman
app.post("/api", (req, res) => {
  try {
    // get user-supplied URL from postman params
    let passInUrl = req.query.url;
    console.log("Fetching", passInUrl);

    gatherSiteInformation(passInUrl).then((result) => {
      let values = [result.title, result.url, result.metaInformation, new Date()];

      let insertQuery = "INSERT INTO webinfo (title, url, meta, created_at) values ($1, $2, $3, $4) RETURNING *";

      client.query(insertQuery, values, (err, res) => {
        if (err) {
          console.log(err.stack);
        } else {
          console.log(res.rows[0]);
        }
      });

      console.log("Done.");
      res.send(values);
    });
  } catch (error) {
    res.send({ error: error.toString() });
  }
});

// const bookingID = generateString("ABCDEFGHIJKLMNOPQRSTUVWXYZ23456789", 6);
// const flightNumber = `FIN${generateString("0123456789", 4)}`;
// console.log(`Flight number ${flightNumber}`);
// console.log(`Booking ID ${bookingID}`);

app.listen(PORT);
console.log(`🚀 App is listening on http://localhost:${PORT}/ 🚀`);
