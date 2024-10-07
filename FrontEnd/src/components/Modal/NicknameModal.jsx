import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import axios from "axios";

import { setNickname } from "@/store/loginUser";

import { Box, TextField, Button, Modal } from "@mui/material";

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
      axios
        .post(
          import.meta.env.VITE_APP_API_URL + `user/nickname`,
          { nickname: inputValue },
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          setValidFlag(!response.data.isDuplicated);
          if (response.data.isDuplicated) {
            setErrorMsg("중복된 닉네임입니다.");
          } else {
            setErrorMsg("사용 가능한 닉네임입니다.");
          }
        })
        .catch((error) => {
          setValidFlag(false);
          console.error("요청 실패:", error);
        });
    } else {
      setErrorMsg("2글자 이상 입력해주세요.");
    }
  };

  // 닉네임 업데이트
  useEffect(() => {
    onNicknameChange(loginUser.nickname);
  }, [loginUser.nickname]);

  const handleChangeNickname = (userId) => {
    axios
      .put(
        import.meta.env.VITE_APP_API_URL + `user/nickname`,
        {
          isDuplicated: !validFlag,
          nickname: inputValue,
        },
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        dispatch(setNickname(inputValue));
        setInputValue("");
        handleClose();
      })
      .catch((error) => {
        console.error("요청 실패:", error);
      });
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
        <div id="nickname-setting-button">
          <Button
            disabled={!validFlag}
            onClick={() => handleChangeNickname(loginUser.userId)}
            color="secondary"
            variant="contained"
          >
            적용
          </Button>
          <Button
            sx={{ ml: 0.5 }}
            onClick={handleClose}
            color="warning"
            variant="contained"
          >
            취소
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

export default NicknameModal;
