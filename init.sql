SET statement_timeout TO 15000;

CREATE TABLE passengers (
    id SERIAL PRIMARY KEY,
    firstname character varying(100),
    lastname character varying(100),
    email character varying(100),
    flightid integer REFERENCES flights(id)
);

INSERT INTO passengers(firstname,lastname,email) 
VALUES 
('catherine','jarocki','cjarocki@gmail.com'), 
('landon','brodersen','lhbrodersen07@gmail.com'),
('roosa','pollonen','roosa.pollonen@hotmail.com'),
('pyry','koskinen','koskinen.pyry@tasteoffinnish.fi'),
('aino','makinen','aino.makinen@aol.com'),
('otso','hannola','otso@travelfinland.com');

CREATE TABLE airports (
    id SERIAL PRIMARY KEY,
    name character varying(100),
    city character varying(100),
    country character varying(100),
    code character varying(3)
);

INSERT INTO airports(name,city,country,code)
VALUES
('Minneapolis-Saint Paul International Airport','Saint Paul','United States of America','MSP'),
('John F. Kennedy International Airport','Queens','United States of America','JFK'),
('Helsinki-Vantaan lentoasema','Vantaa','Finland','HEL'),
('Stockholm Arlanda Airport','Kättsta','Sweden','ARN');

CREATE TABLE flights (
    id SERIAL PRIMARY KEY,
    flightnumber character varying(100),
    departureairport integer REFERENCES airports(id),
    arrivalairport integer REFERENCES airports(id),
    departuredate date NOT NULL,
    arrivaldate date NOT NULL,
    bookingid character varying(6)
);

INSERT INTO flights(flightNumber,departureAirport,arrivalAirport,departureDate,arrivalDate,bookingId) 
VALUES ('FIN1035',2,3,'2022-07-04','2022-07-05','9O34RM');