import { Button } from "@mui/material";
import { useState, useImperativeHandle } from "react";

const Togglable = (props) => {
  const [visible, setVisible] = useState(false);

  const hideWhenVisible = { display: visible ? "none" : "" };
  const showWhenVisible = { display: visible ? "" : "none" };

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  useImperativeHandle(props.ref, () => {
    return { toggleVisibility };
  });

  return (
    <div>
      <div style={hideWhenVisible}>
        <Button variant="contained" color="success" onClick={toggleVisibility}>
          {props.buttonLabel}
        </Button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <Button
          sx={{ marginTop: 2 }}
          variant="contained"
          color="success"
          onClick={toggleVisibility}
        >
          cancel
        </Button>
      </div>
    </div>
  );
};

export default Togglable;
