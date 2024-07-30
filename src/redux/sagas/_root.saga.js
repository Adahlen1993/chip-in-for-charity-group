import { all } from "redux-saga/effects";
import loginSaga from "./login.saga";
import registrationSaga from "./registration.saga";
import golfCourses from "./golf.course.saga";
import restrictions from "./restrictions.saga";
import discounts from "./discounts.saga";
import punchCardsSaga from "./punch.card.saga";
import userPageSaga from "./user.page.saga";
import userSaga from "./user.saga";
import purchasePunchCard from "./purchase.punch.card.saga";
import reportsSaga from "./reports.saga";
import adminGolfCoursesSaga from "./admin.golf.courses.saga";

// rootSaga is the primary saga.
// It bundles up all of the other sagas so our project can use them.
// This is imported in index.js as rootSaga

// some sagas trigger other sagas, as an example
// the registration triggers a login
// and login triggers setting the user
export default function* rootSaga() {
  yield all([
    loginSaga(), // login saga is now registered
    registrationSaga(),
    userSaga(),
    golfCourses(),
    restrictions(),
    discounts(),
    punchCardsSaga(),
    userPageSaga(),
    purchasePunchCard(),
    adminGolfCoursesSaga(),
    reportsSaga(),
  ]);
}
