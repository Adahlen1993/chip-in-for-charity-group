const punchCardsReducer = (state = [], action) => {
  switch (action.type) {
    case "SET_PUNCH_CARDS":
      return action.payload;
    case "UPDATE_PUNCH_CARD_NAME":
      // Map through state to find the punch card by id and update its name
      return state.map((card) => {
        if (card.id === action.payload.id) {
          return {
            ...card,
            name: action.payload.name,
          };
        }
        return card;
      });
    default:
      return state;
  }
};

export default punchCardsReducer;
