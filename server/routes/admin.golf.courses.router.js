const express = require("express");
const router = express.Router();
const pool = require("../modules/pool");
const {
  rejectUnauthenticated,
} = require("../modules/authentication-middleware");

// Get all golf courses with details
router.get("/admin", rejectUnauthenticated, (req, res) => {
  const queryText = `
        SELECT
            gc.id AS golf_course_id,
            gc.name AS golf_course_name,
            gc.phone_number AS golf_course_phone_number,
            gc.is_active AS golf_course_is_active,
            gc.created_at AS golf_course_created_at,
            gc.street AS golf_course_street,
            gc.city AS golf_course_city,
            gc.state AS golf_course_state,
            gc.zip_code AS golf_course_zip_code,
            gc.latitude AS golf_course_latitude,
            gc.longitude AS golf_course_longitude,
            gc.image_url AS golf_course_image_url,
            ARRAY_AGG(DISTINCT d.name) AS discounts,
            ARRAY_AGG(DISTINCT r.name) AS restrictions,
            ARRAY_AGG(DISTINCT pc.id) AS punch_card_ids,
            ARRAY_AGG(DISTINCT u.email) AS users_with_punch_cards
        FROM
            golf_courses gc
        LEFT JOIN
            golf_courses_discounts gcd ON gc.id = gcd.golf_course_id
        LEFT JOIN
            discounts d ON gcd.discount_id = d.id
        LEFT JOIN
            golf_courses_restrictions gcr ON gc.id = gcr.golf_course_id
        LEFT JOIN
            restrictions r ON gcr.restriction_id = r.id
        LEFT JOIN
            punch_card_golf_courses pcgc ON gc.id = pcgc.golf_course_id
        LEFT JOIN
            punch_card pc ON pcgc.punch_card_id = pc.id
        LEFT JOIN
            "user" u ON pc.user_id = u.id
        GROUP BY
            gc.id
        ORDER BY
            gc.name;
    `;
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
    const {
      name,
      phone_number,
      street,
      city,
      state,
      zip_code,
      latitude,
      longitude,
      image_url,
      is_active,
      discount_ids,
      restriction_ids,
    } = req.body;
  
    const client = await pool.connect();
  
    try {
      await client.query("BEGIN");
  
      const sqlText = `INSERT INTO "golf_courses" ("name", "phone_number", "street", "city", "state", "zip_code", "latitude", "longitude", "image_url", "is_active")
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id;`;
      const result = await client.query(sqlText, [
        name,
        phone_number,
        street,
        city,
        state,
        zip_code,
        latitude || 0,
        longitude || 0,
        image_url,
        is_active,
      ]);
  
      const golfCourseId = result.rows[0].id;
  
      if (discount_ids && discount_ids.length > 0) {
        for (let discountId of discount_ids) {
          await client.query(
            `INSERT INTO golf_courses_discounts (golf_course_id, discount_id) VALUES ($1, $2)`,
            [golfCourseId, discountId]
          );
        }
      }
  
      if (restriction_ids && restriction_ids.length > 0) {
        for (let restrictionId of restriction_ids) {
          await client.query(
            `INSERT INTO golf_courses_restrictions (golf_course_id, restriction_id) VALUES ($1, $2)`,
            [golfCourseId, restrictionId]
          );
        }
      }
  
      await client.query("COMMIT");
      res.status(201).send("Golf Course Added");
    } catch (error) {
      await client.query("ROLLBACK");
      console.error(error);
      res.status(500).send("Server Error");
    } finally {
      client.release();
    }
  });
  

// Update a golf course
router.put("/admin/:id", rejectUnauthenticated, async (req, res) => {
    const {
      name,
      phone_number,
      street,
      city,
      state,
      zip_code,
      latitude,
      longitude,
      image_url,
      is_active,
      discount_ids,
      restriction_ids,
    } = req.body;
    const { id } = req.params;
  
    const client = await pool.connect();
  
    try {
      await client.query("BEGIN");
  
      const sqlText = `UPDATE golf_courses SET "name" = $1, "phone_number" = $2, "street" = $3, "city" = $4, "state" = $5, "zip_code" = $6, "latitude" = $7, "longitude" = $8, "image_url" = $9, "is_active" = $10 WHERE id = $11;`;
      await client.query(sqlText, [
        name,
        phone_number,
        street,
        city,
        state,
        zip_code,
        latitude,
        longitude,
        image_url,
        is_active,
        id,
      ]);
  
      await client.query(
        `DELETE FROM golf_courses_discounts WHERE golf_course_id = $1`,
        [id]
      );
      await client.query(
        `DELETE FROM golf_courses_restrictions WHERE golf_course_id = $1`,
        [id]
      );
  
      if (discount_ids && discount_ids.length > 0) {
        for (let discountId of discount_ids) {
          await client.query(
            `INSERT INTO golf_courses_discounts (golf_course_id, discount_id) VALUES ($1, $2)`,
            [id, discountId]
          );
        }
      }
  
      if (restriction_ids && restriction_ids.length > 0) {
        for (let restrictionId of restriction_ids) {
          await client.query(
            `INSERT INTO golf_courses_restrictions (golf_course_id, restriction_id) VALUES ($1, $2)`,
            [id, restrictionId]
          );
        }
      }
  
      await client.query("COMMIT");
      res.send("Golf Course Updated");
    } catch (error) {
      await client.query("ROLLBACK");
      console.error(error);
      res.status(500).send("Server Error");
    } finally {
      client.release();
    }
  });
  

// Delete a golf course
router.delete("/admin/:id", rejectUnauthenticated, async (req, res) => {
  pool
    .query('DELETE FROM "golf_courses" WHERE id=$1', [req.params.id])
    .then(() => {
      res.sendStatus(200);
    })
    .catch((error) => {
      console.log("Error DELETE /api/golfCourses/admin/:id", error);
      res.sendStatus(500);
    });
});

module.exports = router;
