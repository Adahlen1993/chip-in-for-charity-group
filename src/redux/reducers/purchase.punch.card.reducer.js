const purchasePunchCardReducer = (state = [], action) => {
  if (action.type === "SET_GOLF_COURSES_PRE") {
    return action.payload;
  }
  return state;
};

export default purchasePunchCardReducer;
