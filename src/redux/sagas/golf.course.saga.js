import { put, takeLatest } from "redux-saga/effects";
import axios from "axios";

function* fetchGolfCourses(action) {
  try {
    const response = yield axios.get(`/api/golfcourses/coursesdata`, {
      params: {
        punchCardId: action.payload.punchCardId,
        isRedeemed: action.payload.isRedeemed,
      },
    });
    yield put({ type: "SET_GOLF_COURSES", payload: response.data });
  } catch (error) {
    console.error(`Error getting golf courses`, error);
  }
}

function* fetchGolfCoursesRestrictions(action) {
  try {
    const response = yield axios.get(`/api/golfcourses/admin/restrictions`);
    yield put({
      type: "SET_GOLF_COURSES_RESTRICTIONS",
      payload: response.data,
    });
  } catch (error) {
    console.error(`Error getting golf courses restrictions`, error);
  }
}

function* fetchGolfCoursesDiscounts(action) {
  try {
    const response = yield axios.get(`/api/golfcourses/admin/discounts`);
    yield put({ type: "SET_GOLF_COURSES_DISCOUNTS", payload: response.data });
  } catch (error) {
    console.error(`Error getting golf course discount`, error);
  }
}

function* fetchGolfCoursesPage(action) {
  try {
    const response = yield axios.get(
      `/api/golfcourses/coursesdata/${action.payload}`
    );
    yield put({ type: "SET_GOLF_COURSES_PAGE", payload: response.data });
  } catch (error) {
    console.error(`Error getting golf courses`, error);
  }
}

//This Works
function* fetchAllGolfCourses(action) {
  try {
    const response = yield axios.get("/api/golfcourses/admin");
    yield put({ type: "SET_ALL_GOLF_COURSES", payload: response.data });
  } catch (error) {
    console.error(`Error getting all golf courses`);
  }
}

//This Works
function* addGolfCourses(action) {
  try {
    yield axios.post("/api/golfcourses/admin", action.payload);
    yield put({ type: "FETCH_ALL_GOLF_COURSES" });
  } catch (error) {
    console.error(`Error adding new golf course`);
  }
}

function* addRestrictionToGolfCourse(action) {
  try {
    const { gc_id, r_id } = action.payload;
    yield axios.post(
      `/api/golfcourses/${gc_id}/admin/restrictions/${r_id}`,
      action.payload
    );
    yield put({ type: "FETCH_ALL_GOLF_COURSES" });
    yield put({ type: "FETCH_GOLF_COURSES_RESTRICTIONS" });
  } catch (e) {
    console.error(`Error add restriction to gc`, e);
  }
}

// function* deleteRestriction(action){
//   try{
//     const { gc_id, r_id } = action.payload
//     yield axios.delete(`/api/golfcourses/${gc_id}/admin/restrictions/${r_id}`)
//     yield put({ type: "FETCH_GOLF_COURSES" });
//   } catch (err) {
//     console.error(err);
//   }
// }

function* addDiscountToGolfCourse(action) {
  try {
    const { gc_id, d_id } = action.payload;
    yield axios.post(
      `/api/golfcourses/${gc_id}/admin/discounts/${d_id}`,
      action.payload
    );
    yield put({ type: "FETCH_ALL_GOLF_COURSES" });
    yield put({ type: "FETCH_GOLF_COURSES_DISCOUNTS" });
  } catch (e) {
    console.error(`Error add restriction to gc`, e);
  }
}

//This Works
function* updateGolfCourses(action) {
  const { id } = action.payload;
  try {
    yield axios.put(`/api/golfcourses/admin/${id}`, action.payload);
    yield put({ type: "FETCH_ALL_GOLF_COURSES" });
  } catch (error) {
    console.error(`Error updating golf course`, error);
  }
}

function* updateGolfCoursesStatus(action) {
  const { id } = action.payload;
  try {
    yield axios.put(`/api/golfcourses/admin/archive/${id}`, action.payload);
    yield put({ type: "FETCH_ALL_GOLF_COURSES" });
  } catch (error) {
    console.error(`Error updating golf course`, error);
  }
}

function* deleteGolfCoursesRestriction(action) {
  try {
    yield axios.delete(
      `/api/golfcourses/admin/restrictions/delete/${action.payload}`
    );
    yield put({ type: "FETCH_GOLF_COURSES_RESTRICTIONS" });
    yield put({ type: "FETCH_ALL_GOLF_COURSES" });
  } catch (err) {
    console.error(err);
  }
}

function* deleteGolfCoursesDiscount(action) {
  try {
    yield axios.delete(
      `/api/golfcourses/admin/discounts/delete/${action.payload}`
    );
    yield put({ type: "FETCH_GOLF_COURSES_DISCOUNTS" });
    yield put({ type: "FETCH_ALL_GOLF_COURSES" });
  } catch (err) {
    console.error(err);
  }
}

function* golfCourseSaga() {
  yield takeLatest("FETCH_GOLF_COURSES", fetchGolfCourses);
  yield takeLatest("ADD_GOLF_COURSE", addGolfCourses);
  yield takeLatest("FETCH_ALL_GOLF_COURSES", fetchAllGolfCourses);
  yield takeLatest("UPDATE_GOLF_COURSES", updateGolfCourses);
  yield takeLatest("FETCH_GOLF_COURSES_PAGE", fetchGolfCoursesPage);
  yield takeLatest("ADD_RES_TO_GOLF_COURSE", addRestrictionToGolfCourse);
  yield takeLatest("ADD_DIS_TO_GOLF_COURSE", addDiscountToGolfCourse);
  yield takeLatest("UPDATE_GOLF_COURSE_STATUS", updateGolfCoursesStatus);
  // yield takeLatest("DELETE_RESTRICTION", deleteRestriction);
  yield takeLatest(
    "FETCH_GOLF_COURSES_RESTRICTIONS",
    fetchGolfCoursesRestrictions
  );
  yield takeLatest("FETCH_GOLF_COURSES_DISCOUNTS", fetchGolfCoursesDiscounts);
  yield takeLatest(
    "DELETE_GOLF_COURSES_RESTRICTIONS",
    deleteGolfCoursesRestriction
  );
  yield takeLatest("DELETE_GOLF_COURSES_DISCOUNTS", deleteGolfCoursesDiscount);
}

export default golfCourseSaga;
