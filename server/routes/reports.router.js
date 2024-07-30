const express = require("express");
const router = express.Router();
const pool = require("../modules/pool");
const {
  rejectUnauthenticated,
} = require("../modules/authentication-middleware");

router.get(
  "/admin/golfcourses/high",
  rejectUnauthenticated,
  async (req, res) => {
    const queryText = `SELECT 
            gc.id AS golf_course_id,
            gc.name,
            COUNT(pcgc.id) FILTER (WHERE pcgc.is_redeemed = true) AS redeemed_count
            FROM punch_card_golf_courses pcgc
            LEFT JOIN golf_courses gc ON gc.id = pcgc.golf_course_id
            GROUP BY gc.id, gc.name
            ORDER BY redeemed_count DESC, gc.name ASC;`;
    pool
      .query(queryText)
      .then((result) => {
        res.send(result.rows);
      })
      .catch((err) => {
        console.log(err);
        res.sendStatus(500);
      });
  }
);

router.get(
  "/admin/golfcourses/low",
  rejectUnauthenticated,
  async (req, res) => {
    const queryText = `SELECT 
            gc.id AS golf_course_id,
            gc.name,
            COUNT(pcgc.id) FILTER (WHERE pcgc.is_redeemed = true) AS redeemed_count
            FROM punch_card_golf_courses pcgc
            LEFT JOIN golf_courses gc ON gc.id = pcgc.golf_course_id
            GROUP BY gc.id, gc.name
            ORDER BY redeemed_count ASC, gc.name DESC LIMIT 25;`;
    pool
      .query(queryText)
      .then((result) => {
        res.send(result.rows);
      })
      .catch((err) => {
        console.log(err);
        res.sendStatus(500);
      });
  }
);

router.get("/admin/discounts", rejectUnauthenticated, async (req, res) => {
  const queryText = `SELECT d.name,
            COUNT(pcgc.id) FILTER (WHERE pcgc.is_redeemed = true) AS redeemed_count
            FROM punch_card_golf_courses pcgc
            LEFT JOIN discounts d ON d.id = pcgc.discount_id
            GROUP BY d.id, d.name
            ORDER BY redeemed_count DESC, d.name ASC;`;
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

router.get(
  "/admin/golfcourses/not",
  rejectUnauthenticated,
  async (req, res) => {
    const queryText = `SELECT gc.name, COUNT(pcgc.id) FILTER (WHERE pcgc.is_redeemed = false) AS not_redeemed_count
            FROM punch_card_golf_courses pcgc
            LEFT JOIN golf_courses gc ON gc.id = pcgc.golf_course_id
            GROUP BY gc.id, gc.name
            ORDER BY not_redeemed_count DESC, gc.name ASC LIMIT 25;`;
    pool
      .query(queryText)
      .then((result) => {
        res.send(result.rows);
      })
      .catch((err) => {
        console.log(err);
        res.sendStatus(500);
      });
  }
);

router.get("/admin/user/zip", rejectUnauthenticated, async (req, res) => {
  const queryText = `SELECT u.zip_code, COUNT(DISTINCT u.id) AS user_count, COUNT(pc.id) AS purchased_punch_cards
            FROM "user" u
            LEFT JOIN "punch_card" pc ON u.id = pc.user_id
            WHERE pc.is_purchased = true
            GROUP BY u.zip_code
            ORDER BY u.zip_code;`;
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

router.get("/admin/payments/log", rejectUnauthenticated, async (req, res) => {
  const queryText = `SELECT p.id, u.email, p.quantity, p.created_at FROM "user" u
            JOIN "payments" p
            ON u.id = p.user_id
            GROUP BY p.id, u.email
            ORDER BY p.created_at DESC;`;
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

router.get("/admin/redeemed/log", rejectUnauthenticated, async (req, res) => {
  const queryText = `SELECT pcgc.punch_card_id, u.email, gc.name AS golf_course_name, pcgc.redeemed_date
            FROM punch_card_golf_courses pcgc
            JOIN punch_card pc ON pcgc.punch_card_id = pc.id
            JOIN "user" u ON pc.user_id = u.id
            JOIN golf_courses gc ON pcgc.golf_course_id = gc.id
            WHERE pcgc.is_redeemed = true
            ORDER BY pcgc.redeemed_date DESC;`;
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

module.exports = router;
