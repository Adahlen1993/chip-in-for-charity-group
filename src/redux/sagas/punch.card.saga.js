import { call, put, takeEvery } from "redux-saga/effects";
import axios from "axios";

// Fetch punch cards saga
function* fetchPunchCards() {
  try {
    const response = yield call(axios.get, "/api/punchcards/user");
    yield put({ type: "SET_PUNCH_CARDS", payload: response.data });
  } catch (error) {
    console.error("Error fetching punch cards", error);
  }
}

// Update punch card name saga
function* updatePunchCardName(action) {
  const { id, name } = action.payload;
  try {
    yield call(axios.put, `/api/punchcards/${id}`, { name });
    yield put({ type: "FETCH_PUNCH_CARDS" }); // Refresh punch cards after update
  } catch (error) {
    console.error("Error updating punch card name", error);
  }
}

// Main punch cards saga
function* punchCardsSaga() {
  yield takeEvery("FETCH_PUNCH_CARDS", fetchPunchCards);
  yield takeEvery("UPDATE_PUNCH_CARD_NAME", updatePunchCardName); // Handle updating punch card name
}

export default punchCardsSaga;
