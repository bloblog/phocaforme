import * as React from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

import { Box, Fab, Popover } from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import CreateIcon from "@mui/icons-material/Create";

const FloatingActionButtons = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const user = useSelector((state) => state.user.user);

  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  if (
    !user.userId ||
    location.pathname.includes("chatroom") ||
    location.pathname.includes("write")
  ) {
    return null;
  }

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: "3vh",
        right: "5vw",
        "& > :not(style)": { m: 1 },
        zIndex: 2000,
      }}
    >
      <Fab color="warning" aria-label="add">
        <AddIcon onClick={handleClick} />
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          disableScrollLock
          anchorOrigin={{
            horizontal: -100,
            vertical: -90,
          }}
        >
          <div
            id="post-icon"
            onClick={() => {
              navigate("/write");
              handleClose();
            }}
          >
            <div>글쓰기</div>
            <CreateIcon />
          </div>
        </Popover>
      </Fab>
    </Box>
  );
};
export default FloatingActionButtons;
