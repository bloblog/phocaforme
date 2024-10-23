import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { setNickname } from "@/store/loginUser";

import { Box, TextField, Button, Modal } from "@mui/material";
import { isVaild, updateNickname } from "@/api/nickname";
import PairButton from "../../components/Button/pair";

const NicknameModal = ({
  open,
  handleClose,
  validFlag,
  setValidFlag,
  onNicknameChange,
}) => {
  const dispatch = useDispatch();

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "60%",
    bgcolor: "background.paper",
    borderRadius: "10px",
    p: 4,
  };

  // 로그인 유저
  const loginUser = useSelector((state) =>
    state.user ? state.user.user : null
  );

  // 닉네임 인풋 관련
  const [inputValue, setInputValue] = useState("");
  const minLength = 2;

  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setValidFlag(false);
    setInputValue(e.target.value);

    if (e.target.value.length < minLength && e.target.value.trim() == "") {
      setErrorMsg("2글자 이상 입력해주세요.");
    } else {
      setErrorMsg("");
    }
  };

  const handleSubmit = (userId) => {
    // 닉네임 중복 체크
    if (inputValue.trim() !== "") {
      isVaild(
        { nickname: inputValue },
        (data) => {
          setValidFlag(!data.data.isDuplicated);
          if (data.data.isDuplicated) {
            setErrorMsg("중복된 닉네임입니다.");
          } else {
            setErrorMsg("사용가능한 닉네임입니다.");
          }
        },
        (error) => {
          setValidFlag(false);
          console.error("요청 실패:", error);
        }
      );
    } else {
      setErrorMsg("2글자 이상 입력해주세요.");
    }
  };

  // 닉네임 업데이트
  useEffect(() => {
    onNicknameChange(loginUser.nickname);
  }, [loginUser.nickname]);

  const handleChangeNickname = (userId) => {
    updateNickname(
      {
        isDuplicated: !validFlag,
        nickname: inputValue,
      },
      (data) => {
        dispatch(setNickname(inputValue));
        setInputValue("");
        handleClose();
      },
      (error) => {
        console.error("요청 실패:", error);
      }
    );
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box id="nickname-modal-container" sx={style}>
        <h3 id="nickname-setting-title">새로운 닉네임</h3>
        <div id="nickname-setting-container">
          <TextField
            id="new-nickname-input"
            value={inputValue}
            onChange={handleChange}
            helperText={errorMsg}
            error={!validFlag && inputValue.trim() !== ""}
            size="small"
            placeholder=""
          />
          <div id="dup-check" onClick={() => handleSubmit(loginUser.userId)}>
            중복확인
          </div>
        </div>
        <PairButton
          type1={"적용"}
          type2={"취소"}
          handler1={() => handleChangeNickname(loginUser.userId)}
          handler2={handleClose}
        />
      </Box>
    </Modal>
  );
};

export default NicknameModal;
