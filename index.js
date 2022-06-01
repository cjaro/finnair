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
  res.send("Terve ja tervetuloa! 🇫🇮 ✈️");
});

app.get("/passengers/", async (req, res, next) => {
  console.log(`Fetching passengers on flight ${req.query.flightNumber} 👥`);
  // opportunity to validate flight number matches FIN####

  let response = []
  let flightNum = req.query.flightNumber;
  let query = `${process.env.PASSENGERS_QUERY} '${flightNum}';`
  let passengers = await client.query(query);

  for (var i = 0; i < passengers.rows.length; i++) {
    const passenger = {};
    passenger.passengerId = passengers.rows[i].id;
    passenger.firstName = capitalizeFirstLetter(passengers.rows[i].firstname);
    passenger.lastName = capitalizeFirstLetter(passengers.rows[i].lastname);
    passenger.bookingId = passengers.rows[i].bookingid;
    response.push(passenger);
  }
  // res.send(`Passengers on flight ${req.query.flightNumber}: ${JSON.stringify(response)}`);
  res.send(response);
});

app.get("/passengers/:id", async (req, res, next) => {
  let passengerInfo = {};
  passengerInfo.flights = []
  let query = `${process.env.PASSENGER_QUERY} $1;`;
  
  let passenger = await client.query(query, [req.params.id]);
  let passengerFlights = {}

  passengerInfo.id = passenger.rows[0].id;
  passengerInfo.firstName = capitalizeFirstLetter(`${passenger.rows[0].firstname}`);
  passengerInfo.lastName = capitalizeFirstLetter(`${passenger.rows[0].lastname}`);
  passengerInfo.email = passenger.rows[0].email;
  passengerInfo.bookingId = passenger.rows[0].bookingid;

  // a passenger can have more than one flight, find a way to iterate and select multiple flights
  // does that require changing my tables?
  passengerFlights.flightNumber = passenger.rows[0].flightnumber;
  passengerFlights.departureAirport = passenger.rows[0].departureAirport;
  passengerFlights.arrivalAirport = passenger.rows[0].arrivalAirport;
  passengerFlights.departureDate = passenger.rows[0].departuredate;
  passengerFlights.arrivalDate = passenger.rows[0].arrivaldate;

  passengerInfo.flights.push(passengerFlights);

  console.log(`Fetched passenger ${passengerInfo.firstName} ${passengerInfo.lastName} 👤`);
  console.log(`Passenger Info ${JSON.stringify(passengerInfo)}`);

  res.send(passengerInfo);
});

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

// const bookingID = generateString("ABCDEFGHIJKLMNOPQRSTUVWXYZ23456789", 6);
// const flightNumber = `FIN${generateString("0123456789", 4)}`;

app.listen(PORT);
console.log(`🚀 App is listening on http://localhost:${PORT}/ 🚀`);
