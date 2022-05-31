# Pre-assignment
Our inflight crew needs passenger data in their apps. We had a planning session with the apps’ product owners and decided to create two REST API endpoints: one for a list of passengers in a flight, and one for a single passenger in a flight.

Your job is to create a data model layer for the endpoints.
1. Create modules/classes that model the data.
2. Create a database and database modules/classes that create a couple mock objects of each model. 
3. Create a connection between the model classes and the database classes.
4. Create a controller that can be used to simulate sample requests.

## Endpoint:

`GET /passengers?flightNumber=<flight-number>&departureDate=<departure-date>`

Your booking reference consists of six characters that can be either letters or numbers from 2 to 9. You can find it on your booking confirmation or e-ticket.

Response body:
```
[ 
	{
	  "passengerId": "string",
	  "firstName": "string",
	  "lastName": "string",
	  "bookingId": "string, 6 chars"
	},
]
```
## Endpoint:

`GET /passengers/<passenger-id>`

Response body:
```
{
  "passengerId": "string",
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "bookingId": "string, 6 chars",
  "flights": [
    {
      "flightNumber": "string, carrier code + flight number", 
      "departureAirport": "string, 3 chars", 
      "arrivalAirport": "string, 3 chars",
      "departureDate": "string, yyyy-mm-dd",
      "arrivalDate": "string, yyyy-mm-dd"
    },
    ... 
  ]
}
```
## Notes:
- A booking can have multiple passengers, and a passenger can be in one booking.
- A booking can have multiple flights, and a flight can have multiple bookings.
- Do the assignment the way you would do it at work, but not everything has to be production-ready.
- Use the programming language and framework you’re most familiar with.

---

# Running the project:
- I worked on this project on a MacBook, but it also works on Linux (tested with Ubuntu 20.04)
- Copy the environment variables config: `cp sample.env .env`; the default values should work for your db connection.
- Install node_modules: `npm install` at the root of the project
- I used Postgres in a Docker container, accessed via `docker-compose up` at the root of this project
- If the database intialization script in `docker-compose.yml` doesn't work, `init.sql` contains the queries for creating the tables and dummy data that I used to develop this application, and you can run them to mimic my dev environment.
- To view & query the database directly, I used Postico (Mac) & SQLectron (Linux); any Postgres/SQL method of accessing the container/db should be fine
- In a browser or in Postman, you should be able to hit these URLs (these values correspond to my data, otherwise substitute your own flight number & passenger IDs):
  - http://localhost:3000/passengers/1
  - http://localhost:3000/passengers?flightNumber=FIN1035&departureDate=2022-07-05
