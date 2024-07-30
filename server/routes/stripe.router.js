const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const YOUR_DOMAIN = 'https://chip-in-for-charity-weathered-voice-5311.fly.dev/';

// Endpoint to create a checkout session
router.post('/create-checkout-session', async (req, res) => {
  const { quantity, userId } = req.body;
  console.log('Received quantity:', quantity, 'and userId:', userId);

  try {
    // Fetch the user's email from the database using the userId
    const userQuery = 'SELECT email FROM "user" WHERE id = $1';
    const userResult = await pool.query(userQuery, [userId]);

    if (userResult.rows.length === 0) {
      throw new Error('User not found');
    }

    const email = userResult.rows[0].email;

    // Create a checkout session with Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: 'price_1Pb8FO2KFjqbWdCI20cGbrDH',
          quantity: quantity,
        },
      ],
      mode: 'payment',
      success_url: `${YOUR_DOMAIN}/#/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${YOUR_DOMAIN}/#/cancel`,
      customer_email: email,
    });

    console.log('Checkout session created:', session);
    res.json({ id: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to verify payment
router.post('/verify-payment', async (req, res) => {
  const { sessionId } = req.body;

  try {
    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    console.log('Retrieved session:', session);

    if (session.payment_status === 'paid') {
      const {
        id: session_id,
        payment_intent: paymentIntentId,
        amount_total,
        currency,
        customer_email,
      } = session;

      // Retrieve quantity from the session object
      const quantity = session.amount_total / 4000; // Assuming 4000 cents per punch card

      console.log('Session details - Email:', customer_email);

      // Check if the payment has already been recorded
      const paymentCheckQuery =
        'SELECT id FROM payments WHERE session_id = $1 OR payment_intent_id = $2';
      const paymentCheckResult = await pool.query(paymentCheckQuery, [session_id, paymentIntentId]);

      if (paymentCheckResult.rows.length === 0) {
        const userQuery = 'SELECT id FROM "user" WHERE email = $1';
        const userResult = await pool.query(userQuery, [customer_email]);

        if (userResult.rows.length > 0) {
          const userId = userResult.rows[0].id;

          const queryText = `
            INSERT INTO payments (user_id, session_id, payment_intent_id, amount, currency, status, quantity)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id;
          `;

          // Set status as true for completed payments
          const paymentResult = await pool.query(queryText, [
            userId,
            session_id,
            paymentIntentId,
            amount_total / 100, // Convert from cents to dollars
            currency,
            true, // Boolean status for completed payment
            quantity,
          ]);

          console.log('Payment information stored with ID:', paymentResult.rows[0].id);

          // Insert punch_card records based on quantity
          const insertPunchCardQuery = `
            INSERT INTO punch_card (user_id, is_purchased, purchased_date)
            VALUES ($1, true, CURRENT_TIMESTAMP)
            RETURNING id;
          `;

          let punchCardIds = [];
          for (let i = 0; i < quantity; i++) {
            const punchCardResult = await pool.query(insertPunchCardQuery, [userId]);
            punchCardIds.push(punchCardResult.rows[0].id);
          }

          console.log('Punch card records inserted:', punchCardIds);

          // Fetch all golf courses and their discounts from golf_courses_discounts table
          const golfCourseDiscountsQuery = `
            SELECT golf_course_id, discount_id
            FROM golf_courses_discounts
          `;

          const golfCourseDiscountsResult = await pool.query(golfCourseDiscountsQuery);

          // Insert into punch_card_golf_courses for each punch card
          const insertPunchCardGolfCoursesQuery = `
            INSERT INTO punch_card_golf_courses (punch_card_id, golf_course_id, discount_id, is_redeemed)
            VALUES ($1, $2, $3, false);
          `;

          // Loop through each punch card ID
          for (let punchCardId of punchCardIds) {
            // Loop through each row in the golfCourseDiscountsResult
            for (let row of golfCourseDiscountsResult.rows) {
              // Insert a record into the punch_card_golf_courses table
              await pool.query(insertPunchCardGolfCoursesQuery, [
                punchCardId,
                row.golf_course_id,
                row.discount_id,
              ]);
            }
          }

          console.log('Punch card golf courses inserted.');
          res.json({ success: true });
        } else {
          console.error('User not found with email:', customer_email);
          res.json({ success: false, error: 'User not found' });
        }
      } else {
        console.log('Payment already recorded.');
        res.json({ success: true, message: 'Payment already recorded.' });
      }
    } else {
      res.json({ success: false, error: 'Payment not completed' });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
