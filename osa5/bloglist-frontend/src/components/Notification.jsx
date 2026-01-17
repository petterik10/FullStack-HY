import { useContext } from "react";
import NotificationContext from "../NotificationContext";
import { Alert } from "@mui/material";

const Notification = () => {
  const { notification } = useContext(NotificationContext);
  
  if (!notification || !notification.message) {
    return null;
  }

  return (
    <Alert 
      severity={notification.type === "success" ? "success" : "error"}
      sx={{ marginBottom: 2 }}
    >
      {notification.message}
    </Alert>
  );
};

export default Notification;