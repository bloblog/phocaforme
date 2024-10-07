import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import axios from "axios";

import getCookie from "@/utils/getCookie";

import { useTheme } from "@mui/material/styles";

import {
  MenuItem,
  Menu,
  Typography,
  Box,
  Button,
  IconButton,
  Divider,
  Paper,
  Avatar,
} from "@mui/material";

import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";

import GPS from "./GPS";
import noBiasImg from "@/assets/images/no_bias.jpg";

const ProfileImage = () => {
  const theme = useTheme();
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const navigate = useNavigate();

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleClickUserMenu = async (to) => {
    setAnchorElUser(null);
    await navigate(to);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.user);

  const handleLogout = () => {
    // dispatch(logoutUser());
    window.location.href =
      import.meta.env.VITE_APP_LOGIN_API_URL + "auth/logout";
  };

  const [biasImg, setBiasImg] = useState(null);

  // 렌더링 시 최애 정보 가져오기
  useEffect(() => {
    if (getCookie("profile")) {
      axios
        .get(import.meta.env.VITE_APP_API_URL + `user/bias`, {
          withCredentials: true,
        })
        .then((response) => {
          setBiasImg(response.data.idolImage);
        })
        .catch((error) => {
          console.error("Error get bias:", error);
        });
    }
  }, [user]);

  return (
    <div className="profile-image-container">
      <Box id="menu-container">
        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
          <img
            id="profile-image"
            className="profile-image gradient-border background-image"
            src={biasImg ? biasImg : noBiasImg}
          ></img>
        </IconButton>
        <Paper sx={{ backgroundColor: theme.palette.primary.main }}>
          <Menu
            className="profile-container"
            sx={{ mt: "6vh" }}
            id="menu-appbar"
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
            theme={theme}
          >
            <GPS />
            <Divider variant="middle" component="li" />
            <MenuItem
              onClick={async () => {
                await handleClickUserMenu("/chat");
              }}
            >
              <ChatOutlinedIcon className="dropdown-icon" />
              <Typography textAlign="center">나의 채팅함</Typography>
            </MenuItem>
            <MenuItem
              onClick={async () => {
                await handleClickUserMenu("/profile");
              }}
            >
              <PersonOutlinedIcon className="dropdown-icon" />
              <Typography textAlign="center">마이페이지</Typography>
            </MenuItem>
            <Button
              variant="contained"
              color="primary"
              disableElevation
              onClick={handleLogout}
            >
              로그아웃
            </Button>
          </Menu>
        </Paper>
      </Box>
    </div>
  );
};

export default ProfileImage;
