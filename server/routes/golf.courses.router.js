const express = require("express");
const router = express.Router();
const pool = require("../modules/pool");
const {
  rejectUnauthenticated,
} = require("../modules/authentication-middleware");
// const { default: Success } = require("../../src/components/Success/Success");

router.get("/admin", rejectUnauthenticated, (req, res) => {
  const queryText = `WITH discounts_agg AS (
  SELECT 
    "golf_courses"."id" AS golf_course_id,
    string_agg(DISTINCT "discounts"."name", ', ') AS discounts
  FROM "golf_courses"
  LEFT JOIN "golf_courses_discounts" ON "golf_courses"."id" = "golf_courses_discounts"."golf_course_id"
  LEFT JOIN "discounts" ON "golf_courses_discounts"."discount_id" = "discounts"."id"
  GROUP BY "golf_courses"."id"
),
restrictions_agg AS (
  SELECT 
    "golf_courses"."id" AS golf_course_id,
    string_agg(DISTINCT "restrictions"."name", ', ') AS restrictions
  FROM "golf_courses"
  LEFT JOIN "golf_courses_restrictions" ON "golf_courses"."id" = "golf_courses_restrictions"."golf_course_id"
  LEFT JOIN "restrictions" ON "golf_courses_restrictions"."restriction_id" = "restrictions"."id"
  GROUP BY "golf_courses"."id"
)
SELECT
  "golf_courses".*,
  COALESCE(discounts_agg.discounts, '') AS discounts,
  COALESCE(restrictions_agg.restrictions, '') AS restrictions
FROM "golf_courses"
LEFT JOIN discounts_agg ON "golf_courses"."id" = discounts_agg.golf_course_id
LEFT JOIN restrictions_agg ON "golf_courses"."id" = restrictions_agg.golf_course_id
ORDER BY "golf_courses"."name" ASC;`;
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
router.get("/pre", rejectUnauthenticated, (req, res) => {
  const userId = req.user.id;

  const queryText = `
SELECT 
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
    ARRAY_TO_STRING(ARRAY_AGG(DISTINCT d.name), ', ') AS discount_name,
    ARRAY_TO_STRING(ARRAY_AGG(DISTINCT r.name), ', ') AS restrictions,
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
WHERE
    gc.is_active = TRUE
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

router.get("/coursesdata", rejectUnauthenticated, (req, res) => {
  const userId = req.user.id;
  const punchCardId = req.query.punchCardId || null;
  const isRedeemed = req.query.isRedeemed === "true";
  const queryText = `SELECT 
    pcgc.id AS punch_card_golf_courses_id,
    pcgc.punch_card_id,
    pcgc.golf_course_id,
    pcgc.is_redeemed,
    pcgc.redeemed_date,
    pcgc.discount_id,
    
    pc.is_purchased,
    pc.purchased_date,

    u.email,
    u.name AS user_name,
    u.phone_number,
    u.street,
    u.city,
    u.state,
    u.zip_code,
    u.birthdate,
    u.created_at AS user_created_at,
    u.admin AS user_is_admin,

    gc.id AS golf_course_id,
    gc.name AS golf_course_name,
    gc.phone_number AS golf_course_phone,
    gc.is_active AS golf_course_is_active,
    gc.created_at AS golf_course_created_at,
    gc.street AS golf_course_street,
    gc.city AS golf_course_city,
    gc.state AS golf_course_state,
    gc.zip_code AS golf_course_zip,
    gc.latitude AS golf_course_latitude,
    gc.longitude AS golf_course_longitude,
    COALESCE(gc.image_url, 'default_image_url') AS golf_course_image_url,

    d.name AS discount_name,

    STRING_AGG(DISTINCT r.name, ', ') AS restrictions
FROM 
    punch_card_golf_courses pcgc
JOIN 
    punch_card pc ON pcgc.punch_card_id = pc.id
JOIN 
    "user" u ON pc.user_id = u.id
JOIN 
    golf_courses gc ON pcgc.golf_course_id = gc.id
JOIN 
    discounts d ON pcgc.discount_id = d.id
LEFT JOIN 
    golf_courses_discounts gcd ON gcd.golf_course_id = gc.id AND gcd.discount_id = d.id
LEFT JOIN 
    golf_courses_restrictions gcr ON gcr.golf_course_id = gc.id
LEFT JOIN 
    restrictions r ON gcr.restriction_id = r.id
WHERE
    u.id = $1
    AND ($2::int IS NULL OR pcgc.punch_card_id = $2)
    AND pcgc.is_redeemed = $3
    AND gc.is_active = true
GROUP BY 
    pcgc.id, pc.id, u.id, gc.id, d.id;
`;

  pool
    .query(queryText, [userId, punchCardId, isRedeemed])
    .then((result) => {
      res.send(result.rows);
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(500);
    });
});

router.get("/coursesdata/:id", rejectUnauthenticated, (req, res) => {
  const punchCardGolfCoursesId = req.params.id || null;

  const queryText = `SELECT 
    pcgc.id AS punch_card_golf_courses_id,
    pcgc.punch_card_id,
    pcgc.golf_course_id,
    pcgc.is_redeemed,
    pcgc.redeemed_date,
    pcgc.discount_id,
    
    pc.is_purchased,
    pc.purchased_date,

    u.email,
    u.name AS user_name,
    u.phone_number,
    u.street,
    u.city,
    u.state,
    u.zip_code,
    u.birthdate,
    u.created_at AS user_created_at,
    u.admin AS user_is_admin,

    gc.id AS golf_course_id,
    gc.name AS golf_course_name,
    gc.phone_number AS golf_course_phone,
    gc.is_active AS golf_course_is_active,
    gc.created_at AS golf_course_created_at,
    gc.street AS golf_course_street,
    gc.city AS golf_course_city,
    gc.state AS golf_course_state,
    gc.zip_code AS golf_course_zip,
    gc.latitude AS golf_course_latitude,
    gc.longitude AS golf_course_longitude,
    gc.image_url AS golf_course_image_url,

    d.name AS discount_name,

    STRING_AGG(DISTINCT r.name, ', ') AS restrictions
FROM 
    punch_card_golf_courses pcgc
JOIN 
    punch_card pc ON pcgc.punch_card_id = pc.id
JOIN 
    "user" u ON pc.user_id = u.id
JOIN 
    golf_courses gc ON pcgc.golf_course_id = gc.id
JOIN 
    discounts d ON pcgc.discount_id = d.id
LEFT JOIN 
    golf_courses_discounts gcd ON gcd.golf_course_id = gc.id AND gcd.discount_id = d.id
LEFT JOIN 
    golf_courses_restrictions gcr ON gcr.golf_course_id = gc.id
LEFT JOIN 
    restrictions r ON gcr.restriction_id = r.id
WHERE
  pcgc.id = $1
GROUP BY 
    pcgc.id, pc.id, u.id, gc.id, d.id;`;

  pool
    .query(queryText, [punchCardGolfCoursesId])
    .then((result) => {
      res.send(result.rows[0]);
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(500);
    });
});

router.post("/admin", rejectUnauthenticated, async (req, res) => {
  console.log(req.body);
  try {
    const sqlText = `INSERT INTO "golf_courses" ("name", "phone_number", "street", "city", "state", "zip_code", "latitude", "longitude")
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8);`;
    const result = await pool.query(sqlText, [
      req.body.name,
      req.body.phone_number,
      req.body.street,
      req.body.city,
      req.body.state,
      req.body.zip_code,
      req.body.latitude,
      req.body.longitude,
    ]);
    console.log("new golfcourse", result.rows);

    res.sendStatus(201);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

//using params atm, may change
router.put("/admin/:id", rejectUnauthenticated, async (req, res) => {
  console.log("/golfcourses/admin/:id PUT route");
  console.log("is authenticated", req.isAuthenticated);
  console.log("user", req.user);

  try {
    const result = await pool.query(
      `
      UPDATE golf_courses SET "name" = $1, "street" = $2, "city" = $3, "state" = $4, 
      "zip_code" = $5, "latitude" = $6, "longitude" = $7, "phone_number" = $8
      WHERE "id" = $9 RETURNING *; 
      `,
      [
        req.body.name,
        req.body.street,
        req.body.city,
        req.body.state,
        req.body.zip_code,
        req.body.latitude,
        req.body.longitude,
        req.body.phone_number,
        req.params.id,
      ]
    );
    res.send(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

router.put("/admin/archive/:id", rejectUnauthenticated, async (req, res) => {
  console.log("/user/archive/:id PUT route");
  console.log("is authenticated", req.isAuthenticated());

  try {
    await pool.query(
      `
                UPDATE "golf_courses"
                SET "is_active" = $2
                WHERE "id" = $1
            ;`,
      [req.params.id, req.body.is_active]
    );
    res.sendStatus(201);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

router.get("/admin/restrictions", rejectUnauthenticated, async (req, res) => {
  const queryText = `SELECT * FROM golf_courses_restrictions;`;
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

router.post(
  "/:gc_id/admin/restrictions/:r_id",
  rejectUnauthenticated,
  async (req, res) => {
    try {
      const sqlText = `INSERT INTO "golf_courses_restrictions" ("golf_course_id", "restriction_id")
    VALUES ($1, $2);`;
      const result = await pool.query(sqlText, [
        req.params.gc_id,
        req.params.r_id,
      ]);
      console.log("new golfcourse restrictions", result.rows);

      res.sendStatus(201);
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  }
);

router.get("/admin/discounts", rejectUnauthenticated, async (req, res) => {
  const queryText = `SELECT * FROM golf_courses_discounts;`;
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

router.post(
  "/:gc_id/admin/discounts/:d_id",
  rejectUnauthenticated,
  async (req, res) => {
    try {
      const sqlText = `INSERT INTO "golf_courses_discounts" ("golf_course_id", "discount_id")
    VALUES ($1, $2);`;
      const result = await pool.query(sqlText, [
        req.params.gc_id,
        req.params.d_id,
      ]);
      console.log("new golfcourse discounts", result.rows);

      res.sendStatus(201);
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  }
);

router.delete(
  "/admin/restrictions/delete/:id",
  rejectUnauthenticated,
  async (req, res) => {
    pool
      .query('DELETE FROM "golf_courses_restrictions" WHERE id=$1', [
        req.params.id,
      ])
      .then((result) => {
        res.sendStatus(200);
      })
      .catch((error) => {
        console.log(
          "Error DELETE /api/golfcourses/admin/restrictions/delete/:id",
          error
        );
        res.sendStatus(500);
      });
  }
);

router.delete(
  "/admin/discounts/delete/:id",
  rejectUnauthenticated,
  async (req, res) => {
    pool
      .query('DELETE FROM "golf_courses_discounts" WHERE id=$1', [
        req.params.id,
      ])
      .then((result) => {
        res.sendStatus(200);
      })
      .catch((error) => {
        console.log(
          "Error DELETE /api/golfcourses/admin/discounts/delete/:id",
          error
        );
        res.sendStatus(500);
      });
  }
);

module.exports = router;
