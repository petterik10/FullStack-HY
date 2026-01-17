import { createContext, useReducer } from "react";

const userReducer = (state, action) => {
  switch (action.type) {
    case "SET_USER":
      console.log("setting user:", action.payload);
      return action.payload;
    case "CLEAR_USER":
      return null;
    default:
      return state;
  }
};

export const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [user, userDispatch] = useReducer(userReducer, null);

  return (
    <UserContext.Provider value={{ user, userDispatch }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
