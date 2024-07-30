import { put, takeLatest } from "redux-saga/effects";
import axios from "axios";

//This Works
function* fetchRestrictionsSaga(action) {
  try {
    const response = yield axios.get("/api/restrictions/admin");
    yield put({ type: "SET_RESTRICTIONS", payload: response.data });
  } catch (error) {
    console.error(`Error getting restrictions`, error);
  }
}

//This Works
function* addRestrictionsSaga(action) {
  try {
    yield axios.post("/api/restrictions/admin", action.payload);
    yield put({ type: "FETCH_RESTRICTIONS" });
  } catch (error) {
    console.error(`Error adding new restriction`);
  }
}

function* updateRestrictions(action) {
  const { id } = action.payload;
  try {
    yield axios.put(`/api/restrictions/admin/${id}`, action.payload);
    yield put({ type: "FETCH_RESTRICTIONS" });
  } catch (error) {
    console.error(`Error updating restriction`, error);
  }
}

function* deleteRestriction(action) {
  try {
    yield axios.delete(`/api/restrictions/admin/${action.payload}`);
    yield put({ type: "FETCH_RESTRICTIONS" });
  } catch (err) {
    console.error(err);
  }
}

function* restrictionsSaga() {
  yield takeLatest("FETCH_RESTRICTIONS", fetchRestrictionsSaga);
  yield takeLatest("ADD_RESTRICTIONS", addRestrictionsSaga);
  yield takeLatest("UPDATE_RESTRICTIONS", updateRestrictions);
  yield takeLatest("DELETE_RESTRICTIONS", deleteRestriction);
}

export default restrictionsSaga;
