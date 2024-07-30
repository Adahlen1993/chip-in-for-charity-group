import { put, takeLatest } from "redux-saga/effects";
import axios from "axios";

function* fetchGolfCoursesPre(action) {
  try {
    const response = yield axios.get(`/api/golfcourses/pre`);
    yield put({ type: "SET_GOLF_COURSES_PRE", payload: response.data });
  } catch (error) {
    if (error.response && error.response.status === 403) {
      console.error("Unauthorized request. User might not be authenticated.");
    } else {
      console.error(`Error getting golf courses: ${error.message}`);
    }
  }
}

function* purchasePunchCard() {
  yield takeLatest("FETCH_GOLF_COURSES_PRE", fetchGolfCoursesPre);
}

export default purchasePunchCard;
