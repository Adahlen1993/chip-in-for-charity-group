const allGolfCoursesReducer = (state = [], action) => {
  if (action.type === "SET_ALL_GOLF_COURSES") {
    return action.payload;
  }
  return state;
};

export default allGolfCoursesReducer;
