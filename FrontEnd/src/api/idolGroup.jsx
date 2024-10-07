import { localAxios } from "./http";

const local = localAxios();
const url = "/idol/group"; // 공통 URL

// 그룹 가져오기
function getIdolGroup(success, fail) {
  local.get(url).then(success).catch(fail);
}

export { getIdolGroup };
