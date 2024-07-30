const reportsRedeemedLog = (state = [], action) => {
  if (action.type === "SET_REPORTS_REDEEMED_LOG") {
    return action.payload;
  }
  return state;
};

export default reportsRedeemedLog;
