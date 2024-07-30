import axios from "axios";
import { put, takeLatest } from "redux-saga/effects";

// worker Saga: will be fired on "FETCH_USER" actions
function* fetchUser() {
  try {
    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };

    // the config includes credentials which
    // allow the server session to recognize the user
    // If a user is logged in, this will return their information
    // from the server session (req.user)
    const response = yield axios.get("/api/user", config);

    // now that the session has given us a user object
    // with an id and username set the client-side user object to let
    // the client-side code know the user is logged in
    yield put({ type: "SET_USER", payload: response.data });
  } catch (error) {
    console.log("User get request failed", error);
  }
}

function* fetchAllUsers() {
  try {
    const result = yield axios.get("/api/user/admin");
    yield put({ type: "SET_ALL_USERS", payload: result.data });
  } catch (error) {
    console.log("All Users get failed", error);
  }
}

function* addUser(action) {
  try {
    yield axios.post("/api/user/admin", action.payload);
    yield put({ type: "FETCH_USER" });
  } catch (error) {
    console.error(`Error adding new user`);
  }
}

//This Works
function* updateUserAdmin(action) {
  const { id } = action.payload;
  console.log(action.payload);
  try {
    yield axios.put(`/api/user/admin/${id}`, action.payload);
    yield put({ type: "FETCH_USER" });
  } catch (error) {
    console.error(`Error updating user`, error);
  }
}

//This Works
function* updateUser(action) {
  const { id } = action.payload;
  try {
    yield axios.put(`/api/user/${id}`, action.payload);
    yield put({ type: "FETCH_USER" });
  } catch (error) {
    console.error(`Error updating user`, error);
  }
}

function* updateUserStatus(action) {
  const { id } = action.payload;
  try {
    yield axios.put(`/api/user/admin/archive/${id}`, action.payload);
    yield put({ type: "FETCH_USER" });
  } catch (error) {
    console.error(`Error updating user`, error);
  }
}

function* userSaga() {
  yield takeLatest("FETCH_USER", fetchUser);
  yield takeLatest("FETCH_ALL_USERS", fetchAllUsers);
  yield takeLatest("ADD_USER", addUser);
  yield takeLatest("UPDATE_USER_ADMIN", updateUserAdmin);
  yield takeLatest("UPDATE_USER", updateUser);
  yield takeLatest("UPDATE_USER_STATUS", updateUserStatus);
}

export default userSaga;
