import { localAxios } from "./http";

const local = localAxios();
const url = "/idol"; // 공통 URL

// 그룹 가져오기
function getIdolGroup(success, fail) {
  local.get(`${url}/group`).then(success).catch(fail);
}

// 그룹의 멤버 가져오기
function getIdolMember(param, success, fail) {
  local.get(`${url}/member/${param}`).then(success).catch(fail);
}

export { getIdolGroup, getIdolMember };
