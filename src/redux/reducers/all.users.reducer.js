const allUsersReducer = (state = [], action) => {
  if (action.type === "SET_ALL_USERS") {
    return action.payload;
  }
  return state;
};

export default allUsersReducer;
