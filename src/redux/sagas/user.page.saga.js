import { takeLatest, call, put } from "redux-saga/effects";
import axios from "axios";

// Worker Saga: will be fired on "UPDATE_USER_INFO" actions
function* updateUserInfo(action) {
  try {
    const response = yield call(axios.put, "/api/user", action.payload);
    yield put({ type: "SET_USER", payload: response.data });
  } catch (error) {
    console.error("User info update request failed", error);
  }
}

// Watcher Saga: watches for "UPDATE_USER_INFO" actions and calls updateUserInfo when one comes in
function* userPageSaga() {
  yield takeLatest("UPDATE_USER_INFO", updateUserInfo);
}

export default userPageSaga;
