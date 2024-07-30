import { put, takeLatest, call } from "redux-saga/effects";
import axios from "axios";

// Fetch Admin Courses
function* fetchAdminCourses() {
  try {
    const response = yield call(axios.get, "/api/courses/admin");
    yield put({ type: "SET_ADMIN_GOLF_COURSES", payload: response.data });
  } catch (error) {
    console.error("Error fetching admin courses", error);
  }
}

// Add or Edit Course
function* saveCourse(action) {
  try {
    if (action.payload.isEdit) {
      yield call(
        axios.put,
        `/api/courses/admin/${action.payload.golf_course_id}`,
        action.payload
      );
    } else {
      yield call(axios.post, "/api/courses/admin", action.payload);
    }
    yield put({ type: "FETCH_ADMIN_GOLF_COURSES" });
  } catch (error) {
    console.error("Error saving course", error);
  }
}

// Delete Course
function* deleteCourse(action) {
  try {
    yield call(axios.delete, `/api/courses/admin/${action.payload}`);
    yield put({ type: "FETCH_ADMIN_GOLF_COURSES" });
  } catch (error) {
    console.error("Error deleting course", error);
  }
}

// Fetch Discounts
function* fetchDiscounts() {
  try {
    const response = yield call(axios.get, "/api/discounts");
    yield put({ type: "SET_DISCOUNTS", payload: response.data });
  } catch (error) {
    console.error("Error fetching discounts", error);
  }
}

// Fetch Restrictions
function* fetchRestrictions() {
  try {
    const response = yield call(axios.get, "/api/restrictions");
    yield put({ type: "SET_RESTRICTIONS", payload: response.data });
  } catch (error) {
    console.error("Error fetching restrictions", error);
  }
}

function* adminCoursesSaga() {
  yield takeLatest("FETCH_ADMIN_GOLF_COURSES", fetchAdminCourses);
  yield takeLatest("SAVE_COURSE", saveCourse);
  yield takeLatest("DELETE_COURSE", deleteCourse);
  yield takeLatest("FETCH_DISCOUNTS", fetchDiscounts);
  yield takeLatest("FETCH_RESTRICTIONS", fetchRestrictions);
}

export default adminCoursesSaga;
