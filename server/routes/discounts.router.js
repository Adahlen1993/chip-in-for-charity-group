const express = require("express");
const router = express.Router();
const pool = require("../modules/pool");
const {
  rejectUnauthenticated,
} = require("../modules/authentication-middleware");

router.get("/admin", rejectUnauthenticated, (req, res) => {
  const queryText = `SELECT * FROM "discounts" ORDER BY "id";`;
  pool
    .query(queryText)
    .then((result) => {
      res.send(result.rows);
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(500);
    });
});

router.post("/admin", rejectUnauthenticated, async (req, res) => {
  console.log(req.body);
  try {
    const sqlText = `INSERT INTO "discounts" ("name")
    VALUES ($1);`;
    const result = await pool.query(sqlText, [req.body.name]);
    console.log("new restriction", result.rows);
    res.sendStatus(201);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

//Using params, may change
router.put("/admin/:id", rejectUnauthenticated, async (req, res) => {
  console.log("/discounts/admin/:id PUT route");
  console.log("is authenticated", req.isAuthenticated);
  console.log("user", req.user);

  try {
    const result = await pool.query(
      `
        UPDATE discounts SET "name" = $1
        WHERE id = $2 RETURNING *; 
        `,
      [req.body.name, req.params.id]
    );
    res.send(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

router.delete("/admin/:id", rejectUnauthenticated, async (req, res) => {
  pool
    .query('DELETE FROM "discounts" WHERE id=$1', [req.params.id])
    .then((result) => {
      res.sendStatus(200);
    })
    .catch((error) => {
      console.log("Error DELETE /api/discounts/:id", error);
      res.sendStatus(500);
    });
});

module.exports = router;
