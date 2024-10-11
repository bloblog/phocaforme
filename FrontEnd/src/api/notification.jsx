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

export { getNotification, updateNotification };
