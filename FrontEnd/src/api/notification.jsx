import { localAxios } from "./http";

const local = localAxios();
const url = "/notification"; // 공통 URL

// 알림 가져오기
function getNotification(success, fail) {
  local.get(url).then(success).catch(fail);
}

// 알림 읽음 상태로 변경
function updateNotification(param, success, fail) {
  local.post(url, JSON.stringify(param)).then(success).catch(fail);
}

// 알림 모두읽음 처리
function updateAllNotification(notifications, success, fail) {
  const promises = notifications.map((notification) => {
    return new Promise((resolve, reject) => {
      updateNotification(
        { notificationId: notification.notificationId },
        resolve,
        reject
      );
    });
  });

  // 모든 업데이트가 완료되면 처리
  Promise.all(promises).then(success).catch(fail);
}

// 알림 삭제
function deleteNotification(param, success, fail) {
  local.delete(url, { data: param }).then(success).catch(fail);
}

export {
  getNotification,
  updateNotification,
  updateAllNotification,
  deleteNotification,
};
