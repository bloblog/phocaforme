import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton,
  FormControlLabel,
  Checkbox,
  Container,
} from "@mui/material";

import { TaskAlt, Close, RadioButtonUnchecked } from "@mui/icons-material";

const InteractiveList = () => {
  const navigate = useNavigate();

  // 알림 데이터를 저장할 상태
  const [notifications, setNotifications] = useState([]);

  // 컴포넌트가 마운트될 때 알림 데이터를 가져오는 useEffect
  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_APP_API_URL + "notification",
        { withCredentials: true }
      );

      setNotifications(response.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  // 알림 클릭 핸들러
  const handleItemClick = async (item) => {
    try {
      if (item.notificationType === "Article") {
        console.log("click");
        navigate(`/post/${item.articleId}`);
      } else if (item.notificationType === "Chatting") {
        console.log("click");
        navigate(`/chat`);
      }

      // 서버에 알림을 읽은 상태로 변경 요청 보내기
      await axios.post(
        import.meta.env.VITE_APP_API_URL + `notification`,
        { notificationId: item.notificationId },
        { withCredentials: true }
      );
    } catch (error) {
      console.error("Error handling item click:", error);
    }
  };

  // 알림 읽음 처리 핸들러 (삭제버튼 누른거)
  const handleReadAlarm = async (index) => {
    try {
      const updatedNotifications = [...notifications];

      const notification = updatedNotifications[index];
      console.log(notification);
      const notificationId = notification.notificationId; // 알림 ID 추출

      // 서버에 삭제 요청 보내기
      await axios.delete(import.meta.env.VITE_APP_API_URL + `notification`, {
        // 옵션 객체
        data: { notificationId }, // 요청 body에 데이터 설정
        withCredentials: true, // 인증 설정
      });

      // 클라이언트에서 상태 업데이트
      updatedNotifications.splice(index, 1);
      setNotifications(updatedNotifications);
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  // 모두읽음 처리
  const markAllAsRead = async () => {
    try {
      // 현재 알림 데이터의 모든 notificationId를 배열로 추출
      const notificationIds = notifications.map(
        (notification) => notification.notificationId
      );

      // 서버에 모든 알림을 읽은 상태로 변경 요청 보내기
      await axios.post(
        import.meta.env.VITE_APP_API_URL + `notification`,
        { notificationId: notificationIds },
        { withCredentials: true }
      );

      // 클라이언트에서 상태 업데이트
      const updatedNotifications = notifications.map((notification) => ({
        ...notification,
        readStatus: true,
      }));
      setNotifications(updatedNotifications);
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  return (
    <Container>
      <div>
        <h2 className="alarm-title">알림리스트</h2>
        {/* <FormControlLabel
          id="alarm-check-all"
          control={
            // 여기주석처리하고 함수넣어보기
            <Checkbox
              // checked={() => markAllAsRead()}
              checked={notifications.every((item) => item.isRead)}
              onChange={markAllAsRead}
              // onChange={() =>
              //   setNotifications((prevNotifications) =>
              //     prevNotifications.map((item) => ({ ...item, readStatus: true }))
              //   )
              // }
              // disabled={notifications.every((item) => item.isRead)}
            />
          }
          label="모두 읽음"
        /> */}
      </div>

      <div>
        {notifications.length === 0 ? (
          <div id="no-alarm-title">현재 알림이 없습니다.</div>
        ) : (
          <List>
            {notifications.map((item, index) => (
              <ListItem
                key={index}
                className={
                  item.readStatus === true ? "alarm-read-item" : "alarm-item"
                }
                secondaryAction={
                  <IconButton edge="end" onClick={() => handleReadAlarm(index)}>
                    {<Close />}
                  </IconButton>
                }
              >
                <div className="alarm-item-container">
                  <ListItemAvatar>
                    {item.readStatus === true ? (
                      <TaskAlt />
                    ) : (
                      <RadioButtonUnchecked />
                    )}
                  </ListItemAvatar>
                  <div className="alarm-text-container">
                    <ListItemText
                      onClick={() => handleItemClick(item)}
                      className="alarm-content"
                      primary={item.notificationType}
                      secondary={item.content}
                    />
                    <span id="alarm-time">{item.sendTime}</span>
                  </div>
                </div>
              </ListItem>
            ))}
          </List>
        )}
      </div>
    </Container>
  );
};

export default InteractiveList;
