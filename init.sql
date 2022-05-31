create table passengers (
  id SERIAL PRIMARY KEY,
  firstname VARCHAR(100),
  lastname VARCHAR(100),
  email VARCHAR(100)
);

insert into passengers(firstname,lastname,email) 
values 
('catherine','jarocki','cjarocki@gmail.com'), 
('landon','brodersen','lhbrodersen07@gmail.com'),
('roosa','pollonen','roosa.pollonen@hotmail.com'),
('pyry','koskinen','koskinen.pyry@tasteoffinnish.fi'),
('aino','makinen','aino.makinen@aol.com'),
('otso','hannola','otso@travelfinland.com');

create table airports (
	id SERIAL PRIMARY KEY,
	name varchar(100),
	city varchar(100),
	country varchar(100),
	code varchar(3)
);

insert into airports(name,city,country,code)
values
('Minneapolis-Saint Paul International Airport','Saint Paul','United States of America','MSP'),
('John F. Kennedy International Airport','Queens','United States of America','JFK'),
('Helsinki-Vantaan lentoasema','Vantaa','Finland','HEL'),
('Stockholm Arlanda Airport','Kättsta','Sweden','ARN');

create table flights (
  id SERIAL PRIMARY KEY,
  flightNumber VARCHAR(100),
  departureAirport integer REFERENCES airports(id),
  arrivalAirport  integer REFERENCES airports(id),
  departureDate DATE NOT NULL,
  arrivalDate DATE NOT NULL,
  bookingId VARCHAR(6)
);

insert into flights(flightNumber,departureAirport,arrivalAirport,departureDate,arrivalDate,bookingId) 
values ('FIN1035',2,3,'2022-07-04','2022-07-05','9O34RM');