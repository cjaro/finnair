create table passengers (
  id SERIAL PRIMARY KEY,
  firstname VARCHAR(100),
  lastname VARCHAR(100),
  email VARCHAR(100)
);

insert into passengers(firstname,lastname,email) 
values ('catherine','jarocki','cjarocki@gmail.com'), ('landon','brodersen','lhbrodersen07@gmail.com');

create table flightinfo (
  id SERIAL PRIMARY KEY,
  flightNumber VARCHAR(100),
  departureAirport VARCHAR(100),
  arrivalAirport VARCHAR(100),
  departureDate DATE NOT NULL,
  arrivalDate DATE NOT NULL,
  bookingId VARCHAR(6),
  passengerId integer REFERENCES passengers(id)
);

insert into flightinfo (flightNumber,departureAirport,arrivalAirport,departureDate,arrivalDate,bookingId,passengerId) 
values ('FIN1035','JFK','HEL','2022-07-04','2022-07-14','9O34RM',1);

insert into flightinfo (flightNumber,departureAirport,arrivalAirport,departureDate,arrivalDate,bookingId,passengerId) 
values ('FIN9467','DFW','HEL','2022-06-15','2022-06-24','5T7Y2N',2);
