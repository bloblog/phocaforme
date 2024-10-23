import "./index.css";
import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useLocation, useNavigate } from "react-router-dom";

import { sendChat, initChat } from "@/store/chat";

import { timeFormat } from "@/utils/timeFormat";

import { useTheme } from "@mui/material/styles";

import { Button, Container } from "@mui/material";
import { PushPinRounded } from "@mui/icons-material";

import ChatMenu from "./ChatTop";
import ChatSend from "./ChatSend";
import { getChatList } from "../../api/chat";
import { getNickname } from "../../api/nickname";

const ChatRoom = () => {
  const { roomId } = useParams();
  const [otherNickname, setOtherNickname] = useState("");
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loginUser = useSelector((state) =>
    state.user ? state.user.user : null
  );

  const chatList = useSelector((state) =>
    state.chat.chat ? state.chat.chat : []
  );

  const sendMessageBoxRef = useRef(null);
  const price = useSelector((state) =>
    state.pay ? state.pay.status.price : 0
  );

  const updateMessages = (receive) => {
    if (receive && !receive.type) {
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
    if (location.state == null) {
      navigate("/chat");
      return () => {};
    }

    const you =
      loginUser.userId == location.state.visiterId
        ? location.state.ownerId
        : location.state.visiterId;

    getNickname(
      { userId: you },
      (data) => {
        setOtherNickname(data.data);
      },
      (error) => {
        console.error("Error get nickname:", error);
      }
    );
  }, []);

  useEffect(() => {
    getChatList(
      roomId,
      (data) => {
        dispatch(initChat(data.data));
      },
      (error) => {
        console.error("Error get chatting:", error);
      }
    );
  }, [dispatch, roomId]);

  useEffect(() => {
    if (sendMessageBoxRef.current) {
      sendMessageBoxRef.current.scrollTop =
        sendMessageBoxRef.current.scrollHeight;
    }
  }, [chatList]);

  const handlePay = () => {
    console.log(price);
    console.log("카카오페이 연결");
  };

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
        <div id="notice-content">
          <div style={{ fontSize: "12px" }}>
            <PushPinRounded id="notice-icon" />
            <b>필독</b> 거래가 처음이신가요? <a href="/help">인증가이드</a>를
            반드시 읽으시고 믿을 수 있는 거래 하세요!
          </div>
        </div>
        <div id="chat-content-container" ref={sendMessageBoxRef}>
          <div id="chat-message-area">
            {chatList.map((messageData, index) => (
              <div key={index}>
                <div
                  className={
                    messageData.userEmail == loginUser.userId
                      ? "chat-owner-name"
                      : "chat-visiter-name"
                  }
                >
                  {/* 연속적인 메시지에서 닉네임 생략 */}
                  {(index === 0 ||
                    chatList[index - 1].userEmail !==
                      messageData.userEmail) && (
                    <span>
                      {messageData.userEmail == loginUser.userId
                        ? loginUser.nickname
                        : otherNickname}
                    </span>
                  )}
                </div>
                <div
                  className={
                    messageData.userEmail == loginUser.userId
                      ? "chat-owner"
                      : "chat-visiter"
                  }
                >
                  {messageData.userEmail == loginUser.userId ? (
                    <p id="chat-time-container">
                      {timeFormat(messageData.createdAt)}
                    </p>
                  ) : null}
                  <div className="chat-message">
                    {!messageData.imgCode ? (
                      <div>{messageData.message}</div>
                    ) : (
                      <img
                        className="chat-image"
                        src={messageData.imgCode}
                        alt="chat"
                      />
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
                    <div id="chat-time-container">
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
