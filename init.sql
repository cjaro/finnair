SET statement_timeout TO 15000;

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
VALUES 
('FIN1035',2,3,'2022-07-04','2022-07-05','9O34RM'),
('FIN2946',1,2,'2022-08-07','2022-08-08','P4FG67');

CREATE TABLE passengers (
    id SERIAL PRIMARY KEY,
    firstname character varying(100),
    lastname character varying(100),
    email character varying(100),
    flightid integer REFERENCES flights(id)
);

INSERT INTO passengers(firstname,lastname,email,flightid) 
VALUES 
('catherine','jarocki','cjarocki@gmail.com',1), 
('landon','brodersen','lhbrodersen07@gmail.com',1),
('roosa','pollonen','roosa.pollonen@hotmail.com',1),
('pyry','koskinen','koskinen.pyry@tasteoffinnish.fi',2),
('aino','makinen','aino.makinen@aol.com',2),
('otso','hannola','otso@travelfinland.com',2);
