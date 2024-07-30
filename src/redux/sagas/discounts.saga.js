import { put, takeLatest } from "redux-saga/effects";
import axios from "axios";

//This Works
function* fetchDiscountsSaga(action) {
  try {
    const response = yield axios.get("/api/discounts/admin");
    yield put({ type: "SET_DISCOUNTS", payload: response.data });
  } catch (error) {
    console.error(`Error getting discounts`, error);
  }
}

//This Works
function* addDiscountsSaga(action) {
  try {
    yield axios.post("/api/discounts/admin", action.payload);
    yield put({ type: "FETCH_DISCOUNTS" });
  } catch (error) {
    console.error(`Error adding new discount`);
  }
}

function* updateDiscounts(action) {
  const { id } = action.payload;
  try {
    yield axios.put(`/api/discounts/admin/${id}`, action.payload);
    yield put({ type: "FETCH_DISCOUNTS" });
  } catch (error) {
    console.error(`Error updating discount`, error);
  }
}

function* deleteDiscount(action) {
  try {
    yield axios.delete(`/api/discounts/admin/${action.payload}`);
    yield put({ type: "FETCH_DISCOUNTS" });
  } catch (err) {
    console.error(err);
  }
}

function* discountsSaga() {
  yield takeLatest("FETCH_DISCOUNTS", fetchDiscountsSaga);
  yield takeLatest("ADD_DISCOUNTS", addDiscountsSaga);
  yield takeLatest("UPDATE_DISCOUNTS", updateDiscounts);
  yield takeLatest("DELETE_DISCOUNT", deleteDiscount);
}

export default discountsSaga;
