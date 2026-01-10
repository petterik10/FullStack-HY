import { useSelector } from "react-redux";

const Notification = () => {
  const style = {
    border: "solid",
    padding: 10,
    borderWidth: 1,
    marginBottom: 10,
  };

  const notification = useSelector(({ notification }) => notification);

  if (!notification || !notification.message) {
    return null;
  }

  return <div style={style}>{notification.message}</div>;
};

export default Notification;
