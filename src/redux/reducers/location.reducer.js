// reducers/locationReducer.js
const locationReducer = (state = null, action) => {
  switch (action.type) {
    case "SET_LOCATION":
      return action.payload;
    default:
      return state;
  }
};

export default locationReducer;
