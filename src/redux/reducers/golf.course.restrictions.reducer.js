const golfCourseRestrictionReducer = (state = [], action) => {
  if (action.type === "SET_GOLF_COURSES_RESTRICTIONS") {
    return action.payload;
  }
  return state;
};

export default golfCourseRestrictionReducer;
