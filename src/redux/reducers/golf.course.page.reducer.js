const golfCoursePageReducer = (state = {}, action) => {
  // Use an object instead of an array
  if (action.type === "SET_GOLF_COURSES_PAGE") {
    return action.payload;
  }
  return state;
};

export default golfCoursePageReducer;
