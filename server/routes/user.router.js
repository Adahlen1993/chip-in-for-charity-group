const express = require("express");
const {
  rejectUnauthenticated,
} = require("../modules/authentication-middleware");
const encryptLib = require("../modules/encryption");
const pool = require("../modules/pool");
const userStrategy = require("../strategies/user.strategy");

const router = express.Router();

// Handles Ajax request for user information if user is authenticated
router.get("/", rejectUnauthenticated, (req, res) => {
  // Send back user object from the session (previously queried from the database)
  res.send(req.user);
});

// Handles POST request with new user data
// The only thing different from this and every other post we've seen
// is that the password gets encrypted before being inserted
router.post("/register", (req, res, next) => {
  const {
    email,
    password,
    name,
    phone_number,
    street,
    city,
    state,
    zip_code,
    birthdate,
  } = req.body;
  const hashedPassword = encryptLib.encryptPassword(password);

  const queryText = `INSERT INTO "user" (email, password, name, phone_number, street, city, state, zip_code, birthdate)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`;
  pool
    .query(queryText, [
      email,
      hashedPassword,
      name,
      phone_number,
      street,
      city,
      state,
      zip_code,
      birthdate,
    ])
    .then(() => res.sendStatus(201))
    .catch((err) => {
      console.log("User registration failed: ", err);
      res.sendStatus(500);
    });
});

// Handles login form authenticate/login POST
// userStrategy.authenticate('local') is middleware that we run on this route
// this middleware will run our POST if successful
// this middleware will send a 404 if not successful
router.post("/login", userStrategy.authenticate("local"), (req, res) => {
  res.sendStatus(200);
});

// clear all server session information about this user
router.post("/logout", (req, res, next) => {
  // Use passport's built-in method to log out the user
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.sendStatus(200);
  });
});

// FOR USER PAGE
router.put("/:id", rejectUnauthenticated, async (req, res) => {
  console.log("/user/:id PUT route");
  console.log("is authenticated", req.isAuthenticated);
  console.log("user", req.user);

  try {
    const result = await pool.query(
      `
      UPDATE "user" SET "email" = $1, "name" = $2, "phone_number" = $3, "street" = $4, "city" = $5, "state" = $6, "zip_code" = $7, "birthdate" = $8
      WHERE id = $9 RETURNING *; 
      `,
      [
        req.body.email,
        req.body.name,
        req.body.phone_number,
        req.body.street,
        req.body.city,
        req.body.state,
        req.body.zip_code,
        req.body.birthdate,
        req.params.id,
      ]
    );
    res.send(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

//FOR ADMIN PAGE
router.put("/admin/:id", rejectUnauthenticated, async (req, res) => {
  console.log("/user/admin/:id PUT route");
  console.log("is authenticated", req.isAuthenticated);
  // console.log("Request Body:", req.body);
  const {
    email,
    name,
    phone_number,
    street,
    city,
    state,
    zip_code,
    birthdate,
    admin,
  } = req.body;

  if (
    !email ||
    !name ||
    !phone_number ||
    !street ||
    !city ||
    !state ||
    !zip_code ||
    !birthdate ||
    typeof admin !== "boolean"
  ) {
    return res.status(400).send("Invalid request data");
  }

  console.log(req.body);
  console.log("email:", email);
  console.log("name:", name);
  console.log("phone_number:", phone_number);
  console.log("street:", street);
  console.log("city:", city);
  console.log("state:", state);
  console.log("zip_code:", zip_code);
  console.log("birthdate:", birthdate);
  console.log("admin:", admin);
  console.log("req params id", req.params.id);

  try {
    const result = await pool.query(
      `
      UPDATE "user" SET "email" = $1, "name" = $2, "phone_number" = $3, "street" = $4, "city" = $5, "state" = $6, "zip_code" = $7, "birthdate" = $8, "admin" = $9
      WHERE id = $10 RETURNING *; 
      `,
      [
        email,
        name,
        phone_number,
        street,
        city,
        state,
        zip_code,
        birthdate,
        admin,
        req.params.id,
      ]
    );
    res.send(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

//For Archive Users: THIS WORKS
router.put("/admin/archive/:id", rejectUnauthenticated, async (req, res) => {
  console.log("/user/archive/:id PUT route");
  console.log("is authenticated", req.isAuthenticated());

  try {
    await pool.query(
      `
                UPDATE "user"
                SET "is_active" = $2
                WHERE "id" = $1
            `,
      [req.params.id, req.body.is_active]
    );
    res.sendStatus(201);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

//This Works
router.get("/admin", rejectUnauthenticated, async (req, res) => {
  console.log("/user/admin GET router");
  console.log("is authenticated", req.isAuthenticated());

  let queryText = `SELECT u.*, COUNT(pc.id) AS purchased_punch_cards
        FROM "user" u
        LEFT JOIN "punch_card" pc ON u.id = pc.user_id
        GROUP BY u.email, u.id;`;
  pool
    .query(queryText)
    .then((result) => {
      res.send(result.rows);
    })
    .catch((error) => {
      console.log(error);
      res.sendStatus(500);
    });
});

// router.delete("/admin/:id", rejectUnauthenticated, async (req, res) => {
//   pool.query('DELETE FROM "user" WHERE id=$1', [req.params.id]).then((result) => {
//       res.sendStatus(200);
//   }).catch((error) => {
//       console.log('Error DELETE /api/user/:id', error);
//       res.sendStatus(500);
//   })
// })

// Route for updating their own information on the user page.
router.put("/", rejectUnauthenticated, (req, res) => {
  const userId = req.user.id; // Get the authenticated user's ID
  const { name, phone_number, street, city, state, zip_code, birthdate } =
    req.body;

  const query = `
    UPDATE "user"
    SET name = $1, phone_number = $2, street = $3, city = $4, state = $5, zip_code = $6, birthdate = $7
    WHERE id = $8
    RETURNING *;
  `;

  pool
    .query(query, [
      name,
      phone_number,
      street,
      city,
      state,
      zip_code,
      birthdate,
      userId,
    ])
    .then((result) => res.json(result.rows[0]))
    .catch((err) => {
      console.error("Error updating user info", err);
      res.sendStatus(500);
    });
});

module.exports = router;
