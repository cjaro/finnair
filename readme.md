# FinnAir Code Assignment

Create two REST API endpoints: one for a list of passengers in a flight, and one for a single passenger in a flight. See [notes.md](notes.md) for more extensive instructions & guidelines.

## Running the project:
- I worked on this project on a MacBook, but it also works on Linux (tested with Ubuntu 20.04)
- Copy the environment variables config: `cp sample.env .env`; the default values should work for your db connection.
- Install node_modules: `npm install` at the root of the project
- I used Postgres in a Docker container, accessed via `docker-compose up` at the root of this project
- If the database intialization script in `docker-compose.yml` doesn't work, `init.sql` contains the queries for creating the tables and dummy data that I used to develop this application, and you can run them to mimic my dev environment.
- To view & query the database directly, I used Postico (Mac) & SQLectron (Linux); any Postgres/SQL method of accessing the container/db should be fine
- In a browser or in Postman, you should be able to hit these URLs (these values correspond to my data, otherwise substitute your own flight number & passenger IDs):
  - http://localhost:3000/passengers/1
  - http://localhost:3000/passengers?flightNumber=FIN1035&departureDate=2022-07-05
