# Chip In for Charity

## Description

Duration: 3 week sprint

Welcome to the Chip In for Charity App. Chip In for Charity offers discount golf punch cards for charitable causes. A punch card gives the golfer a free or discounted round of golf at 88 different courses across North Dakota and western Minnesota.

## Screenshots
<img width="323" alt="Screenshot 2024-07-30 at 12 00 11 AM" src="https://github.com/user-attachments/assets/c80879d4-9093-4750-84cd-019b9c0372ba"> 
<img width="322" alt="Screenshot 2024-07-30 at 12 22 44 AM" src="https://github.com/user-attachments/assets/3771da21-a6f3-4cbd-8f85-a9576041a794">

<img width="1508" alt="Screenshot 2024-07-30 at 12 02 43 AM" src="https://github.com/user-attachments/assets/2bda9b13-7e18-4042-827c-d704f88c1812">



### Prerequisites

- [Node.js](https://nodejs.org/en/)
- PostgreSQL for database

## Installation

1. Create a database named `chip-in-for-charity`,
2. The queries in the `database.sql` file are set up to create all the necessary tables and populate the needed data to allow the application to run correctly. The project is built on [Postgres](https://www.postgresql.org/download/), so you will need to make sure to have that installed. We recommend using Postico to run those queries as that was used to create the queries,
3. Create an account on Stripe (for payment processing) and add your Stripe secret key to a .env file. In the .env file, this should be named "STRIPE_SECRET_KEY".
4. Open up your editor of choice and run an `npm install`
5. Run `npm run server` in your terminal
6. Run `npm run client` in your terminal
7. Navigate to the local host in your browser

## Usage

Find golf courses with discounts
Sort Golf Courses

- Sort by name
- Sort location
- Find courses using the map component

Purchase Punch Cards

- Purchase multiple punch cards
- Rename your punch cards for identity

Redeem Discounts
- Find golf course contact information
- Redeem a course discount

## Admin Page

- When a user's admin status === true, they will see the admin tab in the nav bar.

## Users

- The admin can view the user's 'Full Name', 'email', 'Phone #', 'Street', 'City', 'State', 'Zip Code', 'Birthday', 'Time Created', 'Punch Cards purchased', 'Admin Status(T/F)'.
- The admin is able to edit everything from above excluding 'Punch Cards Purchased' and 'Time Created'.

## Golf Courses

- The admin can view the golf course's 'name', 'phone #', 'Active Status', 'Time Created', 'Street', 'City', 'State', 'Zip Code', 'latitude', 'longitude', 'image', 'restrictions', and 'discounts'.
- They can also add a golf course using the above information as well.
- The admin is able to edit everything above excluding 'Time Created'.
- With the Golf Courses, they will be able to add and remove Restrictions w/in the edit, as many to as little as needed.
- Golf Courses can only have ONE discount, no less, no more.

## Discounts

- The admin can view and edit a discounts 'name'.
- They can also add a discount.

## Restrictions

- The admin can view and edit a restrictions 'name'.
- They can also add a restriction.

## Reports

### Total Redeemed Discounts at each Golf Course

- This page allows the admin to view the golf course's 'name' and how many punch cards have had their discount redeemed.

### Most Used Discounts

- This page shows the admin the discount's 'name' and how many golf course discounts with that specific discount name have been redeemed.

### Purchases by Zip Code

- This page displays every zip code a donor (user who has purchased a card) has put in their demographics.
- It also shows how many donors live in that zip code and the total punch cards purchased in that zip code.
- This page also supplies a heat map that locates the zip codes by putting circles over them and based on how many cards have been purchased in that zip code, it will get bigger and change colors.

### Redeemed Discounts Log

- This page only shows the golf course discounts that HAVE been redeemed.
- This page shows the admin the punch card 'id', the user's 'email', the golf course 'name', and the time that discount was redeemed.

### Payment Log

- This page shows the admin the user's 'email', the 'quanity' of punch cards that were purchased at that SPECIFIC transaction, and the time that transaction was completed.

## Built With

- Javascript
- React
- Redux
- PostgreSQL
- Express
- Node
- Passport
- Stripe
- Material UI
- (a full list of dependencies can be found in `package.json`)

## Acknowledgement

Thanks to [Emerging Digital Academy](https://emergingacademy.org/) who equipped us with the tools and helped us build this app.
