import { localAxios } from "./http";

const local = localAxios();
const url = "/user"; // 공통 URL

// 최애 가져오기
function getBias(success, fail) {
  local
    .get(url + "/bias")
    .then(success)
    .catch(fail);
}

// 최애 설정하기
function addBias(param, success, fail) {
  local
    .put(url + "/bias", JSON.stringify(param))
    .then(success)
    .catch(fail);
}

// 위시카드 수정 및 생성
function makeWishcard(param, success, fail) {
  local.put(`${url}/wishCard`, param).then(success).catch(fail);
}

// 위시카드 가져오기
function getWishcard(success, fail) {
  local.get(`${url}/wishCard`).then(success).catch(fail);
}

// 위시카드 삭제
function deleteWishcard(success, fail) {
  local.delete(`${url}/wishCard`).then(success).catch(fail);
}

// GPS 위치 가져오기
function getGPS(param, success, fail) {
  local.put("/gps", JSON.stringify(param)).then(success).catch(fail);
}

// GPS 위치 쿠키에서 삭제
function deleteGPS(success, fail) {
  local.get("/gps").then(success).catch(fail);
}

export {
  getBias,
  addBias,
  makeWishcard,
  getWishcard,
  deleteWishcard,
  getGPS,
  deleteGPS,
};
