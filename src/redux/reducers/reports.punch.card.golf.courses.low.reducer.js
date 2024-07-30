const reportsPunchCardGolfCoursesLow = (state = [], action) => {
  if (action.type === "SET_REPORTS_PUNCH_CARD_GOLF_COURSES_LOW") {
    return action.payload;
  }
  return state;
};

export default reportsPunchCardGolfCoursesLow;
