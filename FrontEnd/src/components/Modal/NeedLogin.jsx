import "./index.css";
import { useLocation } from "react-router-dom";
import { Dialog, DialogContent } from "@mui/material";
import kakaoLogin from "@/assets/images/kakao_login.png";

import { KAKAO_AUTH_URL } from "@/containers/login/OAuth";

const NeedLogin = ({ handleModalClose, modalOpen }) => {
  const location = useLocation();
  const handleLogin = () => {
    // 로그인 후 돌아올 현재 위치 저장
    sessionStorage.setItem("redirectPath", location.pathname);
    handleModalClose();
    window.location.href = KAKAO_AUTH_URL;
  };
  return (
    <Dialog onClose={handleModalClose} open={modalOpen} maxWidth={false}>
      <DialogContent id="modal-container">
        <div id="modal-info-container">
          <div>로그인이 필요한 서비스입니다.</div>
          <div>로그인하시겠습니까?</div>
        </div>
        <div id="modal-button-container">
          <img onClick={handleLogin} src={kakaoLogin}></img>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NeedLogin;
