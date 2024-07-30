const restrictionsReducer = (state = [], action) => {
  if (action.type === "SET_RESTRICTIONS") {
    return action.payload;
  }
  return state;
};

export default restrictionsReducer;
