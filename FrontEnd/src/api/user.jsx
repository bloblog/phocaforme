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

// GPS 위치 가져오기
function getGPS(param, success, fail) {
  local.put("/gps", JSON.stringify(param)).then(success).catch(fail);
}

// GPS 위치 쿠키에서 삭제
function deleteGPS(success, fail) {
  local.get("/gps").then(success).catch(fail);
}

export { getBias, getGPS, deleteGPS };
