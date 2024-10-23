import React, { useState, useEffect } from "react";
import { Client } from "@stomp/stompjs";

import { TextField, InputAdornment, Popover, Button } from "@mui/material";
import { Add, Image } from "@mui/icons-material";
import WebSocket from "../../utils/websocket";

const ChatSend = ({ roomId, loginUser, updateMessages, setLoading }) => {
  // 메시지 전송
  const [value, setValue] = useState("");
  const [image, setImage] = useState("");

  const [wsClient, setWsClient] = useState(new Client());
  const [receive, setReceive] = useState("");

  // 사진첨부 팝업
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleFileChange = (e) => {
      if (e.target) {
        readImage(e.target);
      }
    };

    // 초기 렌더링 시에도 호출되도록 설정
    handleFileChange({ target: document.getElementById("fileInput") });
  }, []);

  const sendMessage = () => {
    if (wsClient && roomId && loginUser && value) {
      wsClient.publish({
        destination: "/pub/chats/" + roomId,
        body: JSON.stringify({
          chatRoomId: roomId,
          userEmail: loginUser.userId,
          message: value,
        }),
      });
    }
    setValue("");
  };

  const receiveMessage = (receive) => {
    handleSendClick(receive);
  };

  const receiveImg = (receive) => {
    handleSetImage(receive);
  };

  const readImage = (input) => {
    if (input.files && input.files[0]) {
      setLoading(true);
      const FR = new FileReader();
      FR.onload = function (e) {
        if (wsClient) {
          wsClient.publish({
            destination: "/pub/chats/" + roomId,
            body: JSON.stringify({
              chatRoomId: roomId,
              userEmail: loginUser.userId,
              imgCode: e.target.result,
            }),
          });
        }
      };
      FR.readAsDataURL(input.files[0]);
    }
  };

  const handleChange = (event) => {
    setValue((prevValue) => event.target.value);
  };

  const handleSetImage = (receive) => {
    updateMessages(receive);

    handleClose();
  };

  const handleSendClick = (receive) => {
    updateMessages(receive);
    sendMessage();
  };

  // 엔터 키를 눌렀을 때도 send
  const handleSendEnter = (e) => {
    if (e.nativeEvent.isComposing) return;
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendClick();
    }
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setOpen(true);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setOpen(false);
  };

  const triggerFileInput = () => {
    document.getElementById("fileInput").click();
  };

  const handleFileSelection = (e) => {
    const selectedFile = document.getElementById("fileInput").files[0];
    readImage(e.target);
    setOpen(false);
  };

  return (
    <div
      sx={{
        maxWidth: "100%",
      }}
    >
      <WebSocket
        roomId={roomId}
        setWsClient={setWsClient}
        receiveImg={receiveImg}
        receiveMessage={receiveMessage}
      />

      <TextField
        fullWidth
        id="fullWidth"
        placeholder="메시지를 입력하세요"
        value={value}
        onChange={handleChange}
        onKeyDown={handleSendEnter}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Add onClick={handleClick} />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <Button id="sendIcon" onClick={handleSendClick}>
                전송
              </Button>
            </InputAdornment>
          ),
        }}
      ></TextField>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        transformOrigin={{
          vertical: "bottom",
        }}
      >
        <div id="add-popover-container">
          <div id="image-icon-container">
            <div id="image-icon-background">
              <Image id="image-icon" onClick={triggerFileInput} />
              <input
                type="file"
                id="fileInput"
                onChange={handleFileSelection}
              />
            </div>
            <p>사진</p>
          </div>
        </div>
      </Popover>
    </div>
  );
};

export default ChatSend;
