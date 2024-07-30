const reportsPunchCardGolfCoursesHigh = (state = [], action) => {
  if (action.type === "SET_REPORTS_PUNCH_CARD_GOLF_COURSES_HIGH") {
    return action.payload;
  }
  return state;
};

export default reportsPunchCardGolfCoursesHigh;
