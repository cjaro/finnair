import bodyParser from "body-parser";
import express from "express";
import PG from "pg";
import "dotenv/config";

let PORT = process.env.PORT;

let dbUser = process.env.POSTGRES_USER;
let dbHost = process.env.POSTGRES_HOST;
let dbName = process.env.POSTGRES_DB;
let dbPass = process.env.POSTGRES_PASSWORD;
let dbPort = process.env.POSTGRES_PORT;
let timeout = 1500000;

const app = express();

const client = new PG.Client({
  user: dbUser,
  host: dbHost,
  database: dbName,
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

app.get("/passengers", async (req, res, next) => {
  console.log("Fetching passengers 👥");

  let table = "passengers";
  let query = `SELECT * FROM ${table}`;
  let passengers = await getInfo(query);

  res.send(passengers.rows);
});

app.get("/passengers/:id", async (req, res, next) => {
  let table = "passengers"
  let query = `SELECT * FROM ${table} WHERE id = $1`;
  let passenger = await getInfoById(query, req.params.id);
  let fname = capitalizeFirstLetter(`${passenger.rows[0].firstname}`);
  let lname = capitalizeFirstLetter(`${passenger.rows[0].lastname}`);

  console.log(`Fetched passenger ${fname} ${lname} 👤`);

  res.send(passenger.rows[0]);
});

// bleh how
app.get("/passengers?flightNumber=:flightNumber&departureDate=:departureDate>", async (req, res, next) => {

});

app.get("/flights", async (req, res, next) => {
  console.log("Fetching flights 🛫 🛬");

  let query = `SELECT flights.bookingid as "Booking ID", flights.flightnumber as "Flight Number", flights.departuredate as "Departure Date", a1.name as "Departure Airport", flights.arrivaldate as "Arrival Date", a2.name as "Arrival Airport" FROM flights LEFT JOIN airports a1 ON flights.departureairport = a1.id LEFT JOIN airports a2 on flights.arrivalairport = a2.id;`;

  let flights = await getInfo(query);

  res.send(flights.rows);
});

app.get("/flights/:id", async (req, res, next) => {
  let table = "flights";
  let query = `SELECT * FROM ${table} WHERE id = $1`;
  let flight = await getInfoById(query, req.params.id);

  console.log(`Fetching flight ${flight.rows[0].flightnumber} ✈️`);

  res.send(flight.rows);
});

async function getInfo(query) {
  return await client.query(query);
}

async function getInfoById(query, id) {
  return await client.query(query, [id]);
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
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
    // get postman params
    let passInFlightNum = req.query.flightNumber;
    let passInBookingId = req.query.bookingId;

    gatherSiteInformation(passInUrl).then((result) => {
      let values = [];

      let insertQuery = "INSERT INTO table () values ($1, $2, $3, $4) RETURNING *";

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
// console.log(`Flight number ${flightNumber}; Booking ID ${bookingID}`);

app.listen(PORT);
console.log(`🚀 App is listening on http://localhost:${PORT}/ 🚀`);
