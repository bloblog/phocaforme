package com.phofor.phocaforme.notification.service;

import com.phofor.phocaforme.chat.entity.ChatRoom;
import com.phofor.phocaforme.notification.dto.NotificationDto;
import com.phofor.phocaforme.notification.dto.message.NotificationMessageDto;
import com.phofor.phocaforme.notification.dto.message.RequestDTO;

import java.io.IOException;
import java.util.List;

public interface FCMNotificationService {
    public void sendMessageTo(RequestDTO requestDTO) throws IOException;

    public Boolean sendChatMessage(ChatRoom chatRoom, String userId);
    public Boolean sendChatMessage(NotificationDto notificationDto);
    public Boolean sendBiasMessage(List<String> ids, Long articleId);

    public List<NotificationMessageDto> getMessageList(String userId);

    public String readMessage(Long notificationId);

    public Boolean deleteMessage(Long notificationId);
}
