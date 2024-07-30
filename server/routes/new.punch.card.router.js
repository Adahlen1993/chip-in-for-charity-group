const express = require("express");
const pool = require("../modules/pool");
const router = express.Router();

router.get("/userpayment", (req, res) => {
  {
    let queryText = `SELECT * FROM payments WHERE user_id = $1`;
    pool
      .query(queryText, [req.user.id])
      .then((result) => {
        res.send(result.rows);
      })
      .catch((error) => {
        console.log(error);
        res.sendStatus(500);
      });
  }
});

router.post("/card", async (req, res) => {
  try {
    // Initial POST request to the first table
    const response = await axios.post(
      "http://localhost:5000/api/first-table",
      req.body
    );
    const newId = response.data.id;

    // POST request to the second table with the new ID
    const secondTableData = {
      ...req.body, // Include any other data you need to send
      firstTableId: newId,
    };
    await axios.post("http://localhost:5000/api/second-table", secondTableData);

    res.status(201).send("Data successfully posted to both tables");
  } catch (error) {
    console.error("Error posting data:", error);
    res.status(500).send("An error occurred while posting data");
  }
});

module.exports = router;
