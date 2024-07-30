-- USER is a reserved keyword with Postgres
-- You must use double quotes in every query that user is in:
-- ex. SELECT * FROM "user";
-- Otherwise you will have errors!
CREATE TABLE "user" (
    "id" SERIAL PRIMARY KEY,
    "username" VARCHAR (80) UNIQUE NOT NULL,
    "password" VARCHAR (1000) NOT NULL
);

SELECT * FROM "user"
WHERE id = '2';

-- Insert Statement for Demographics
INSERT INTO "user" (
"email", "password", 
"name", "phone_number", "street", "city", "state", "zip_code", "birthdate") VALUES (
	'justin@yahoo.com',
	'justin',
	'Justin Hopkins',
	'(701) 288-9202',
	'510 MN Lane',
	'Vergus', 
	'MN',
	'52645',
	'09-08-1965'
	);
	
-- GET STATEMENT for Demorgraphics
SELECT * FROM "user";
	
-- INSERT STATEMENT FOR RESTRICTIONS
INSERT INTO restrictions ("name") VALUES (
	'Not available on Monday'
	);

-- GET STATEMENT for Restrictions
SELECT * FROM "restrictions";
	
-- INSERT STATEMENT FOR DISCOUNTS
INSERT INTO discounts ("name") VALUES (
	'$10 off 18 hole'
	);
	
--	INSERT STATEMENT FOR GOLF COURSES
INSERT INTO golf_courses ("name", street, city, state, zip_code, latitude, longitude, phone_number) VALUES (
	'Oxbow Country Club',
	'10 ST NW',
	'Fargo',
	'ND',
	'56822',
	'47.03465',
	'-98.38672',
	'(701) 288-8475'
	);
