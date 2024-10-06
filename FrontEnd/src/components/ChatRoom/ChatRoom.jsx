import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useLocation } from "react-router-dom";

import axios from "axios";

import { sendChat, initChat } from "../../store2/chat";

import { timeFormat } from "../../utils/timeFormat";

import { useTheme } from "@mui/material/styles";

import { Button, Container } from "@mui/material";
import { PushPinRounded } from "@mui/icons-material";

import ChatMenu from "./ChatTop";
import ChatSend from "./ChatSend";

const ChatRoom = () => {
  const theme = useTheme();

  const { roomId } = useParams();
  const location = useLocation();

  const dispatch = useDispatch();

  const loginUser = useSelector((state) =>
    state.user ? state.user.user : null
  );

  const chatList = useSelector((state) =>
    state.chat.chat ? state.chat.chat : []
  );

  const updateMessages = (receive) => {
    if (receive && !receive.type) {
      console.log(receive);
      const newMessage = {
        chatRoomId: receive.chatRoomId,
        createdAt: new Date().toISOString(),
        imgCode: receive.imgCode,
        message: receive.message,
        userEmail: receive.userEmail,
      };
      if (newMessage.message || newMessage.imgCode !== null) {
        dispatch(sendChat(newMessage));
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await axios
        .get(import.meta.env.REACT_APP_API_URL + `chats/${roomId}`, {
          withCredentials: true,
        })
        .then((response) => {
          dispatch(initChat(response.data));
        })
        .catch((error) => {
          console.error("Error get chatting:", error);
        });
    };
    fetchData();
  }, [dispatch, roomId]);

  // 항상 맨 아래로 스크롤
  const sendMessageBoxRef = useRef(null);

  useEffect(() => {
    if (sendMessageBoxRef.current) {
      sendMessageBoxRef.current.scrollTop =
        sendMessageBoxRef.current.scrollHeight;
    }
  }, [chatList]);

  const price = useSelector((state) =>
    state.pay ? state.pay.status.price : 0
  );

  const handlePay = () => {
    // 결제 기능
    console.log(price);
    console.log("카카오페이 연결");
  };

  // 채팅 상대방 이름 가져와
  const [otherNickname, setOtherNickname] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const you =
        loginUser.userId == location.state.visiterId
          ? location.state.ownerId
          : location.state.visiterId;
      await axios
        .post(
          import.meta.env.REACT_APP_API_URL + `users/nickname`,
          {
            userId: you,
          },
          {
            "Content-Type": "application/json",
            withCredentials: true,
          }
        )
        .then((response) => {
          setOtherNickname(response.data);
        })
        .catch((error) => {
          console.error("Error get nickname:", error);
        });
    };
    fetchData();
  }, []);

  return (
    <Container>
      <div id="chat-container">
        <div id="chat-menu-container">
          <ChatMenu
            otherNickname={otherNickname}
            updateMessages={updateMessages}
            chatroomInfo={location.state}
          />
        </div>
        <div id="chat-content-container" ref={sendMessageBoxRef}>
          <div id="chat-message-area">
            <div id="notice-content">
              <div style={{ fontSize: "12px" }}>
                <PushPinRounded id="notice-icon" />
                <b>필독</b> 거래가 처음이신가요? <a href="/help">인증가이드</a>
                를 반드시 읽으시고 믿을 수 있는 거래 하세요!
              </div>
            </div>
            {chatList.map((messageData, index) => (
              <div key={index}>
                <div
                  className={
                    messageData.userEmail == loginUser.userId
                      ? "chat-owner-name"
                      : "chat-visiter-name"
                  }
                >
                  {messageData.userEmail == loginUser.userId
                    ? loginUser.nickname
                    : otherNickname}
                </div>
                <div
                  className={
                    messageData.userEmail == loginUser.userId
                      ? "chat-owner"
                      : "chat-visiter"
                  }
                >
                  {messageData.userEmail == loginUser.userId ? (
                    <p>{timeFormat(messageData.createdAt)}</p>
                  ) : null}
                  <div className="chat-message">
                    {!messageData.imgCode ? (
                      <div>{messageData.message}</div>
                    ) : (
                      <img
                        className="chat-image"
                        src={messageData.imgCode}
                      ></img>
                    )}
                    <div>
                      {messageData.isPay ? (
                        <Button id="pay-button" onClick={handlePay}>
                          결제하러가기
                        </Button>
                      ) : null}
                    </div>
                  </div>
                  {messageData.userEmail != loginUser.userId ? (
                    <div className="chat-time-container">
                      {timeFormat(messageData.createdAt)}
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div id="send-message-container">
          <ChatSend
            roomId={roomId}
            loginUser={loginUser}
            updateMessages={updateMessages}
          />
        </div>
      </div>
    </Container>
  );
};

export default ChatRoom;
