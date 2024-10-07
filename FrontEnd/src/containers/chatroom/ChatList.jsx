import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import axios from "axios";

import { timeFormat } from "../../utils/timeFormat";

import { Container, List, ListItem, Typography } from "@mui/material";

const ChatList = () => {
  const navigate = useNavigate();
  const loginUser = useSelector((state) =>
    state.user ? state.user.user : null
  );

  const moveChatRoom = (roomId, chatroom) => {
    navigate(`/chatroom/${roomId}`, { state: chatroom });
  };

  const [nicknames, setNicknames] = useState({});
  const [thumbnails, setThumbnails] = useState({});
  const [chatLists, setChatLists] = useState([]);

  const getNickname = async (id) => {
    try {
      const response = await axios.post(
        import.meta.env.VITE_APP_API_URL + `users/nickname`,
        {
          userId: id,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error get nickname:", error);
    }
  };

  const getImages = async (boardId) => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_APP_API_URL + `barter/${boardId}`,
        { withCredentials: true }
      );
      if (response.data.photos.length > 0) {
        return response.data.photos[0];
      } else {
        return null; // If no photos, return null or handle accordingly
      }
    } catch (error) {
      console.error("Error get image:", error);
      return null; // Handle error, e.g., return default thumbnail or handle accordingly
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          import.meta.env.VITE_APP_API_URL + `chatRoom`,
          {
            withCredentials: true,
          }
        );
        const chatData = response.data;

        const nicknamePromises = chatData.map((chatroom) =>
          getNickname(
            chatroom.ownerId !== loginUser.userId
              ? chatroom.ownerId
              : chatroom.visiterId
          )
        );
        const nicknameResults = await Promise.all(nicknamePromises);

        const imagePromises = chatData.map((chatroom) =>
          getImages(chatroom.boardId)
        );
        const imageResults = await Promise.all(imagePromises);

        const nicknameMap = {};
        chatData.forEach((chatroom, index) => {
          const nickname = nicknameResults[index];
          nicknameMap[chatroom.chatRoomId] = nickname;
        });

        const thumbnailMap = {};
        chatData.forEach((chatroom, index) => {
          const thumbnail = imageResults[index];
          thumbnailMap[chatroom.chatRoomId] = thumbnail;
        });

        setNicknames(nicknameMap);
        setThumbnails(thumbnailMap);
        setChatLists(chatData);
      } catch (error) {
        console.error("Error ChatList:", error);
      }
    };
    fetchData();
  }, [loginUser.userId]);

  console.log(chatLists);

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
                  <img
                    className="chatlist-thumbnail"
                    src={`https://photocardforme.s3.ap-northeast-2.amazonaws.com/${
                      thumbnails[chatroom.chatRoomId]
                    }`}
                    alt="Thumbnail"
                  />
                  <div className="chatlist-content">
                    <div className="chatlist-nickname">
                      {nicknames[chatroom.chatRoomId]}
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
