const express = require("express");
const router = express.Router();
const pool = require("../modules/pool");
const {
  rejectUnauthenticated,
} = require("../modules/authentication-middleware");

// GET route to fetch punch cards for the logged-in user
router.get("/user", rejectUnauthenticated, (req, res) => {
  const userId = req.user.id;
  const query = `SELECT * FROM punch_card WHERE user_id = $1`;

  pool
    .query(query, [userId])
    .then((result) => res.json(result.rows))
    .catch((err) => {
      console.error("Error fetching punch cards", err);
      res.sendStatus(500);
    });
});
router.post("/redeem", async (req, res) => {
  const { punch_card_golf_courses_id } = req.body; // Adjust to use punch_card_golf_courses_id
  const redeemedAt = new Date();

  try {
    const query = `
      UPDATE punch_card_golf_courses
      SET is_redeemed = true, redeemed_date = $1
      WHERE id = $2
      RETURNING *;
    `;
    const values = [redeemedAt, punch_card_golf_courses_id];
    const result = await pool.query(query, values);

    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ error: "Punch card not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/:id", rejectUnauthenticated, async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const query = `
      UPDATE punch_card
      SET name = $1
      WHERE id = $2
      RETURNING *;
    `;
    const result = await pool.query(query, [name, id]);

    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ error: "Punch card not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
