const golfCourseReducer = (state = [], action) => {
  if (action.type === "SET_GOLF_COURSES") {
    return action.payload;
  }
  return state;
};

export default golfCourseReducer;
