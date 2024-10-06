import React, { useState } from "react";
import { useSelector } from "react-redux";
import { TextField, Button } from "@mui/material";

import NicknameModal from "../UI/Modal/NicknameModal";

const Nickname = () => {
  const loginUser = useSelector((state) =>
    state.user ? state.user.user : null
  );

  const [nickname, setNickname] = useState(loginUser.nickname);
  const [validFlag, setValidFlag] = useState(false);

  // 모달 관련
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setValidFlag(false);
  };

  // 닉네임 반영 관련
  const handleNicknameChange = (newNickname) => {
    setNickname(newNickname);
  };

  return (
    <div id="nickname-container">
      <div id="nickname-title">닉네임</div>
      <div id="nickname-input">
        <TextField size="small" disabled value={nickname} />
      </div>
      <Button variant="contained" onClick={handleOpen}>
        수정
      </Button>
      <NicknameModal
        open={open}
        handleClose={handleClose}
        validFlag={validFlag}
        setValidFlag={setValidFlag}
        onNicknameChange={handleNicknameChange}
      />
    </div>
  );
};

export default Nickname;
