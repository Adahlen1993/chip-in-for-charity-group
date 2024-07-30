const userReducer = (state = {}, action) => {
  switch (action.type) {
    case "SET_USER":
      return action.payload;
    case "UNSET_USER":
      return {};
    case "SET_USER_DEMO":
      return { ...state };
    default:
      return state;
  }
};

export default userReducer;
