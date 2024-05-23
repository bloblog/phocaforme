import Badge from "@mui/material/Badge";
import NotificationsIcon from "@mui/icons-material/Notifications";

const Bell = () => {
  return (
    <Badge 
      color="primary" 
      // variant="invisible" 
      variant="dot"
      overlap="circular" 
      anchorOrigin={{ vertical: 'top', horizontal: 'right'}}
    >
      <NotificationsIcon id="bell-icon" />
    </Badge>
  );
};

export default Bell;
