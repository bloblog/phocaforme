import { localAxios } from "./http";

const local = localAxios();
const url = "/user"; // 공통 URL

// 카카오로그인
function doLogin(param, success, fail) {
  local
    .get(`https://example.com/oauth?code=${param}`)
    .then(success)
    .catch(fail);
}

export { doLogin };
