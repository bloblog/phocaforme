import "./index.css";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  List,
  ListItem,
  ListItemAvatar,
  IconButton,
  FormControlLabel,
  Checkbox,
  Container,
} from "@mui/material";

import { TaskAlt, Close, RadioButtonUnchecked } from "@mui/icons-material";
import {
  deleteNotification,
  getNotification,
  updateAllNotification,
  updateNotification,
} from "@/api/notification";
import { alarmTimeFormat } from "../../utils/timeFormat";

const AlarmList = () => {
  const alarmType = { Chatting: "채팅 ✉️", Article: "갈망포카 🛒" };
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    getNotification(
      (data) => {
        setNotifications(data.data);
      },
      (error) => {
        console.error("Error fetching notifications:", error);
      }
    );
  }, []);

  // 알림 클릭 핸들러
  const handleItemClick = (item) => {
    if (item.notificationType === "Article") {
      navigate(`/post/${item.articleId}`);
    } else if (item.notificationType === "Chatting") {
      navigate(`/chat`);
    }

    // 서버에 알림을 읽은 상태로 변경 요청 보내기
    updateNotification(
      { notificationId: item.notificationId },
      () => {},
      (error) => {
        console.error("Error handling item click:", error);
      }
    );
  };

  // 알림 삭제 핸들러
  const handleReadAlarm = (index) => {
    console.log(notifications[index].notificationId);
    deleteNotification(
      { notificationId: notifications[index].notificationId },
      () => {
        const updatedNotifications = [...notifications];
        updatedNotifications.splice(index, 1);
        setNotifications(updatedNotifications);
      },
      (error) => {
        console.error("Error deleting notification:", error);
      }
    );
  };

  // 알림 모두읽음 처리
  const markAllAsRead = () => {
    updateAllNotification(
      notifications,
      () => {
        // 화면 상태 업데이트
        const updatedNotifications = notifications.map((notification) => ({
          ...notification,
          readStatus: true,
        }));
        setNotifications(updatedNotifications);
      },
      (error) => {
        console.error("Error marking all as read:", error);
      }
    );
  };

  return (
    <Container>
      <div>
        <h2 className="alarm-title">알림리스트</h2>
        <FormControlLabel
          id="alarm-check-all"
          control={
            <Checkbox
              checked={notifications.every((item) => item.readStatus)}
              onChange={markAllAsRead}
              disabled={notifications.every((item) => item.readStatus)}
            />
          }
          label="모두 읽음"
        />
      </div>

      <div>
        {notifications.length === 0 ? (
          <div id="no-alarm-title">현재 알림이 없습니다.</div>
        ) : (
          <List>
            {notifications.map((item, index) => (
              <ListItem
                onClick={() => handleItemClick(item)}
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
                    <div className="alarm-title-container">
                      <div id="alarm-title">
                        {alarmType[item.notificationType]}
                      </div>
                      <div id="alarm-time">
                        {alarmTimeFormat(item.createdAt)}
                      </div>
                    </div>
                    <div className="alarm-content">{item.content}</div>
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

export default AlarmList;
