import { combineReducers } from "redux";
import errors from "./errors.reducer";
import user from "./user.reducer";
import golfCourseReducer from "./golf.course.reducer";
import restrictionsReducer from "./restrictions.reducer";
import discountsReducer from "./discounts.reducer";
import allGolfCoursesReducer from "./all.golf.courses.reducer";
import allUsersReducer from "./all.users.reducer";
import punchCardsReducer from "./punch.card.reducer";
import golfCoursePageReducer from "./golf.course.page.reducer";
import purchasePunchCard from "./purchase.punch.card.reducer";
import location from "./location.reducer";
import golfCourseRestrictions from "./golf.course.restrictions.reducer";
import golfCourseDiscounts from "./golf.course.discounts.reducer";
import reportsPunchCardGolfCoursesHigh from "./reports.punch.card.golf.courses.high.reducer";
import reportsPunchCardGolfCoursesLow from "./reports.punch.card.golf.courses.low.reducer";
import reportsPunchCardDiscounts from "./reports.punch.card.discounts.reducer";
import adminGolfCoursesReducer from "./admin.golf.courses.reducer";
import reportsGolfCoursesNotRedeemed from "./reports.golfcourses.not.redeemed.reducer";
import reportsUserZip from "./reports.user.zip.reducer";
import reportsPaymentsLog from "./reports.payments.log.reducer";
import reportsRedeemedLog from "./reports.redeemed.log.reducer";

// rootReducer is the primary reducer for our entire project
// It bundles up all of the other reducers so our project can use them.
// This is imported in index.js as rootSaga

// Lets make a bigger object for our store, with the objects from our reducers.
// This is what we get when we use 'state' inside of 'mapStateToProps'
const rootReducer = combineReducers({
  errors, // contains registrationMessage and loginMessage
  user, // will have an id and username if someone is logged in
  golfCourseReducer,
  restrictionsReducer,
  discountsReducer,
  allGolfCoursesReducer,
  allUsersReducer,
  golfCoursePageReducer,
  punchCards: punchCardsReducer,
  purchasePunchCard,
  location,
  golfCourseRestrictions,
  golfCourseDiscounts,
  adminGolfCoursesReducer,
  reportsPunchCardGolfCoursesHigh,
  reportsPunchCardGolfCoursesLow,
  reportsPunchCardDiscounts,
  reportsGolfCoursesNotRedeemed,
  reportsUserZip,
  reportsPaymentsLog,
  reportsRedeemedLog,
});

export default rootReducer;
