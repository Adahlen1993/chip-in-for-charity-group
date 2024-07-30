const golfCourseDiscountsReducer = (state = [], action) => {
  if (action.type === "SET_GOLF_COURSES_DISCOUNTS") {
    return action.payload;
  }
  return state;
};

export default golfCourseDiscountsReducer;
