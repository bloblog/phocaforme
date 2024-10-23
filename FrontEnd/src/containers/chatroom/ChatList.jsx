import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { timeFormat } from "@/utils/timeFormat";
import Truncate from "@/styles/TruncatedTitle";

import {
  CircularProgress,
  Container,
  List,
  ListItem,
  Typography,
} from "@mui/material";
import { getChatRoom, getChatRoomInfo } from "../../api/chat";

import MainIcon from "@/assets/icons/main";
import AmazonSrc from "../../constants/amazonS3";

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
            setLoading(false);
          },
          (error) => {
            console.error("Error Get Chatroom Info: ", error);
            setLoading(false);
          }
        );
      },
      (error) => {
        console.log("Error Get ChatRoom: ", error);
      }
    );
  }, []);

  return (
    <Container>
      <h2 className="chat-title">채팅목록</h2>
      {loading ? (
        <CircularProgress />
      ) : (
        <>
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
                          src={AmazonSrc + chatInfoList[index].image}
                          alt="Thumbnail"
                        />
                      )}
                      <div className="chatlist-content">
                        <div className="chatlist-nickname">
                          {chatInfoList[index].nickname}
                        </div>
                        <Typography
                          component="div"
                          fontSize="small"
                          color="text.primary"
                        >
                          <Truncate truncateWidth="50vw">
                            {chatroom.latestChat
                              ? chatroom.latestChat.message
                              : "채팅을 시작해보세요 ✉️"}
                          </Truncate>
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
        </>
      )}
    </Container>
  );
};
export default ChatList;
