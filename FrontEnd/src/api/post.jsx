import { localAxios } from "./http";

const local = localAxios();
const url = "/barter"; // 공통 URL

// 교환 게시글 이미지 가져오기
function getImage(param, success, fail) {
  local.get(`${url}/${param}`).then(success).catch(fail);
}

export { getImage };
