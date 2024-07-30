const express = require("express");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 5001;
const bodyParser = require("body-parser");

// Middleware Includes
const sessionMiddleware = require("./modules/session-middleware");
const passport = require("./strategies/user.strategy");

// Route Includes
const userRouter = require("./routes/user.router");
const punchCardRouter = require("./routes/punch.card.router");
const reports = require("./routes/reports.router");



const stripeRouter = require("./routes/stripe.router");
const golfCoursesRouter = require("./routes/golf.courses.router");
const restrictionsRouter = require("./routes/restrictions.router");
const discounts = require("./routes/discounts.router");
const adminCoursesRouter = require("./routes/admin.golf.courses.router");

// Express Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("build"));
app.use(bodyParser.json());

// Passport Session Configuration
app.use(sessionMiddleware);

// Start Passport Sessions
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api/user", userRouter);

app.use("/api/stripe", stripeRouter);
app.use("/api/golfcourses", golfCoursesRouter);
app.use("/api/punchcards", punchCardRouter);
app.use("/api/reports", reports);
app.use("/api/courses", adminCoursesRouter);


app.use("/api/restrictions", restrictionsRouter);
app.use("/api/discounts", discounts);

// Listen Server & Port
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
