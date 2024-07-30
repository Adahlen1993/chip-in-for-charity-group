import React from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

function LogOutButton(props) {
  const dispatch = useDispatch();
  const history = useHistory();

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });

    // Adding a timeout to ensure the state is updated before redirecting
    setTimeout(() => {
      history.push("/login");
    }, 0);
  };

  return (
    <span
      className={props.className}
      onClick={handleLogout}
      style={{ cursor: "pointer" }}
      hover
    >
      Log Out
    </span>
  );
}

export default LogOutButton;
