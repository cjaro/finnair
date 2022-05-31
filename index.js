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

app.get("/passengers/", async (req, res, next) => {
  console.log(`Fetching passengers on flight ${req.query.flightNumber} 👥`);

  let passInFlightNum = req.query.flightNumber;

  let query = `
  SELECT 
    passengers.id,
    passengers.firstname,
    passengers.lastname, 
	  f.bookingId
  FROM passengers
  JOIN flights f ON f.id = passengers."flightId"
  WHERE f.flightnumber = '${passInFlightNum}';`

  let passengers = await getInfo(query);

  let response = []

  for (var i = 0; i < passengers.rows.length; i++) {
    const passenger = {};

    passenger.passengerId = passengers.rows[i].id;
    passenger.firstName = capitalizeFirstLetter(passengers.rows[i].firstname);
    passenger.lastName = capitalizeFirstLetter(passengers.rows[i].lastname);
    passenger.bookingId = passengers.rows[i].bookingid;

    response.push(passenger);
  }
  console.log(`Passengers on flight ${req.query.flightNumber}: ${JSON.stringify(response)}`);
  res.send(response);
});

app.get("/passengers/:id", async (req, res, next) => {
  let passengerInfo = {};
  passengerInfo.flights = []
  let query = `
  SELECT 
	  p.id, p.firstname, p.lastname, p.email,
	  f.bookingId, f.flightnumber, f.departureairport, f.arrivalairport, f.departuredate, f.arrivaldate,
    a2.name as "arrivalAirport"
  FROM passengers p
  LEFT JOIN flights f ON f.id = p."flightId"
  LEFT JOIN airports a1 ON f.departureairport = a1.id
  LEFT JOIN airports a2 on f.arrivalairport = a2.id
  WHERE p.id = $1`;
  
  let passenger = await getInfoById(query, req.params.id);
  let passengerFlights = {}

  passengerInfo.id = passenger.rows[0].id;
  passengerInfo.firstName = capitalizeFirstLetter(`${passenger.rows[0].firstname}`);
  passengerInfo.lastName = capitalizeFirstLetter(`${passenger.rows[0].lastname}`);
  passengerInfo.email = passenger.rows[0].email;
  passengerInfo.bookingId = passenger.rows[0].bookingid;

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

// const bookingID = generateString("ABCDEFGHIJKLMNOPQRSTUVWXYZ23456789", 6);
// const flightNumber = `FIN${generateString("0123456789", 4)}`;
// console.log(`Flight number ${flightNumber}; Booking ID ${bookingID}`);

app.listen(PORT);
console.log(`🚀 App is listening on http://localhost:${PORT}/ 🚀`);
