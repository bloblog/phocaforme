import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { useTheme } from "@mui/material/styles";

import {
  Paper,
  Box,
  IconButton,
  Typography,
  Menu,
  Divider,
} from "@mui/material";

import NonLoginImg from "@/assets/images/nonlogin.PNG";
import kakao from "@/assets/images/kakao_login.png";
import { KAKAO_AUTH_URL } from "@/containers/login/OAuth";

const NonLoginIcon = () => {
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

  const GotoLogin = () => {
    setAnchorElUser(null); // 메뉴 닫기
    navigate("/login");
  };

  // 따로 로그인 페이지 가지 말고 그냥 카카오 로그인으로 보내버림
  const loginHandler = () => {
    setAnchorElUser(null); // 메뉴 닫기
    window.location.href = KAKAO_AUTH_URL;
  };

  return (
    <div className="profile-image-container">
      <Box>
        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
          <img
            id="profile-image"
            className="profile-image gradient-border background-image"
            src={NonLoginImg}
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
            <img
              id="kakao-button"
              src={kakao}
              onClick={loginHandler}
              style={{
                display: "block",
                width: "8rem",
                margin: theme.spacing(2), // 상단 여백 추가
              }}
            />
            <Divider variant="middle" component="li" />
            <Typography
              sx={{
                textAlign: "center",
                color: theme.palette.primary.main,
                p: 2,
                fontFamily: "PyeongChangPeace",
                fontSize: "1rem",
                fontWeight: "bold",
              }}
            >
              로그인이 필요한
              <br />
              서비스입니다.
            </Typography>
          </Menu>
        </Paper>
      </Box>
    </div>
  );
};

export default NonLoginIcon;
