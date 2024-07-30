const reportsGolfCoursesNotRedeemed = (state = [], action) => {
  if (action.type === "SET_REPORTS_GOLF_COURSES_NOT_REDEEMED") {
    return action.payload;
  }
  return state;
};

export default reportsGolfCoursesNotRedeemed;
