const adminGolfCoursesReducer = (state = [], action) => {
  if (action.type === "SET_ADMIN_GOLF_COURSES") {
    return action.payload;
  }
  return state;
};

export default adminGolfCoursesReducer;
