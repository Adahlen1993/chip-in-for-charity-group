const reportsPaymentsLog = (state = [], action) => {
  if (action.type === "SET_REPORTS_PAYMENTS_LOG") {
    return action.payload;
  }
  return state;
};

export default reportsPaymentsLog;
