import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { timeFormat } from "@/utils/timeFormat";

import { Container, List, ListItem, Typography } from "@mui/material";
import { getNickname } from "../../api/nickname";
import { getChatRoom, getChatRoomInfo } from "../../api/chat";
import { getImage } from "../../api/post";

import MainIcon from "@/assets/icons/main";

const ChatList = () => {
  const navigate = useNavigate();
  const loginUser = useSelector((state) =>
    state.user ? state.user.user : null
  );

  const moveChatRoom = (roomId, chatroom) => {
    navigate(`/chatroom/${roomId}`, { state: chatroom });
  };

  const [chatInfoList, setChatInfoList] = useState([]);
  const [chatLists, setChatLists] = useState([]);
  const [loading, setLoading] = useState(true); // 로딩 상태 추가

  useEffect(() => {
    getChatRoom(
      (data) => {
        setChatLists(data.data);
        // 닉네임 및 썸네일 설정
        getChatRoomInfo(
          data.data,
          loginUser,
          (data) => {
            setChatInfoList(data);
            setLoading(false); // 데이터 로딩 완료 시 로딩 상태 해제
          },
          (error) => {
            console.error("Error Get Chatroom Info: ", error);
          }
        );
      },
      (error) => {
        console.log("Error Get ChatRoom: ", error);
      }
    );
  }, []);

  if (loading) {
    return <div>Loading...</div>; // 로딩 중일 때 표시할 컴포넌트
  }

  return (
    <Container>
      <h2 className="chat-title">채팅목록</h2>
      {chatLists.length === 0 ? (
        <div className="chat-title">현재 진행중인 채팅이 없습니다!</div>
      ) : (
        <List id="chat-list-container">
          {chatLists.map((chatroom, index) => (
            <ListItem
              className={
                (chatroom.visiterId === loginUser.userId &&
                  chatroom.latestChat &&
                  chatroom.latestChat.id != chatroom.visitorLatestChatId) ||
                (chatroom.ownerId === loginUser.userId &&
                  chatroom.latestChat &&
                  chatroom.latestChat.id != chatroom.ownerLatestChatId)
                  ? "unread-chatlist-item"
                  : "chatlist-item"
              }
              key={index}
              onClick={() => moveChatRoom(chatroom.chatRoomId, chatroom)}
            >
              <div className="chatlist-info">
                <div className="chatlist-thumb-content">
                  {chatInfoList[index].image == null ? (
                    <MainIcon />
                  ) : (
                    <img
                      className="chatlist-thumbnail"
                      src={`https://photocardforme.s3.ap-northeast-2.amazonaws.com/${chatInfoList[index].image}`}
                      alt="Thumbnail"
                    />
                  )}
                  <div className="chatlist-content">
                    <div className="chatlist-nickname">
                      {chatInfoList[index].nickname}
                    </div>
                    <Typography color="text.primary">
                      {chatroom.latestChat
                        ? chatroom.latestChat.message
                        : "(사진)"}
                    </Typography>
                  </div>
                </div>

                <div>
                  <Typography>
                    {chatroom.latestChat
                      ? `${timeFormat(chatroom.latestChat.createdAt)}`
                      : null}
                  </Typography>
                </div>
              </div>
            </ListItem>
          ))}
        </List>
      )}
    </Container>
  );
};
export default ChatList;
