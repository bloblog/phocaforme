import { localAxios } from "./http";

const local = localAxios();
const url = "/user/nickname"; // 공통 URL

// 닉네임 가져오기
function getNickname(param, success, fail) {
  local
    .post("/users/nickname", JSON.stringify(param))
    .then(success)
    .catch(fail);
}

// 닉네임 중복체크
function isVaild(param, success, fail) {
  local.post(url, JSON.stringify(param)).then(success).catch(fail);
}

// 닉네임 업데이트
function updateNickname(param, success, fail) {
  local.put(url, JSON.stringify(param)).then(success).catch(fail);
}

export { isVaild, updateNickname, getNickname };
