const reportsUserZip = (state = [], action) => {
  if (action.type === "SET_REPORTS_USER_ZIP") {
    return action.payload;
  }
  return state;
};

export default reportsUserZip;
