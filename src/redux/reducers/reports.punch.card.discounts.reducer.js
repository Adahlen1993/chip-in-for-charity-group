const reportsPunchCardDiscounts = (state = [], action) => {
  if (action.type === "SET_REPORTS_PUNCH_CARD_DISCOUNTS") {
    return action.payload;
  }
  return state;
};

export default reportsPunchCardDiscounts;
