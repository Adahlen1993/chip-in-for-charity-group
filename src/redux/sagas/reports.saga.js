import { put, takeLatest } from "redux-saga/effects";
import axios from "axios";

function* fetchReportsPunchCardGolfCoursesHigh(action) {
  try {
    const response = yield axios.get(`/api/reports/admin/golfcourses/high`);
    yield put({
      type: "SET_REPORTS_PUNCH_CARD_GOLF_COURSES_HIGH",
      payload: response.data,
    });
  } catch (error) {
    console.error(`Error getting golf courses punchcard High`, error);
  }
}

function* fetchReportsPunchCardGolfCoursesLow(action) {
  try {
    const response = yield axios.get(`/api/reports/admin/golfcourses/low`);
    yield put({
      type: "SET_REPORTS_PUNCH_CARD_GOLF_COURSES_LOW",
      payload: response.data,
    });
  } catch (error) {
    console.error(`Error getting golf courses punch card Low`, error);
  }
}

function* fetchReportsPunchCardDiscounts(action) {
  try {
    const response = yield axios.get(`/api/reports/admin/discounts`);
    yield put({
      type: "SET_REPORTS_PUNCH_CARD_DISCOUNTS",
      payload: response.data,
    });
  } catch (error) {
    console.error(`Error getting punch card discounts`, error);
  }
}

function* fetchReportsGolfCoursesNotRedeemed(action) {
  try {
    const response = yield axios.get(`/api/reports/admin/golfcourses/not`);
    yield put({
      type: "SET_REPORTS_GOLF_COURSES_NOT_REDEEMED",
      payload: response.data,
    });
  } catch (error) {
    console.error(`Error getting golf courses punch card Low`, error);
  }
}

function* fetchReportsUserZip(action) {
  try {
    const response = yield axios.get(`/api/reports/admin/user/zip`);
    yield put({ type: "SET_REPORTS_USER_ZIP", payload: response.data });
  } catch (error) {
    console.error(`Error getting user zip`, error);
  }
}

function* fetchReportsPaymentsLog(action) {
  try {
    const response = yield axios.get(`/api/reports/admin/payments/log`);
    yield put({ type: "SET_REPORTS_PAYMENTS_LOG", payload: response.data });
  } catch (error) {
    console.error(`Error getting payments log`, error);
  }
}

function* fetchReportsRedeemedLog(action) {
  try {
    const response = yield axios.get(`/api/reports/admin/redeemed/log`);
    yield put({ type: "SET_REPORTS_REDEEMED_LOG", payload: response.data });
  } catch (error) {
    console.error(`Error getting payments log`, error);
  }
}

function* reportsSaga() {
  yield takeLatest(
    "FETCH_REPORTS_PUNCH_CARD_GOLF_COURSES_HIGH",
    fetchReportsPunchCardGolfCoursesHigh
  );
  yield takeLatest(
    "FETCH_REPORTS_PUNCH_CARD_GOLF_COURSES_LOW",
    fetchReportsPunchCardGolfCoursesLow
  );
  yield takeLatest(
    "FETCH_REPORTS_PUNCH_CARD_DISCOUNTS",
    fetchReportsPunchCardDiscounts
  );
  yield takeLatest(
    "FETCH_REPORTS_GOLF_COURSES_NOT_REDEEMED",
    fetchReportsGolfCoursesNotRedeemed
  );
  yield takeLatest("FETCH_REPORTS_USER_ZIP", fetchReportsUserZip);
  yield takeLatest("FETCH_REPORTS_PAYMENTS_LOG", fetchReportsPaymentsLog);
  yield takeLatest("FETCH_REPORTS_REDEEMED_LOG", fetchReportsRedeemedLog);
}

export default reportsSaga;
