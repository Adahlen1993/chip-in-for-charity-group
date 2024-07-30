const discountsReducer = (state = [], action) => {
  if (action.type === "SET_DISCOUNTS") {
    return action.payload;
  }
  return state;
};

export default discountsReducer;
