import { localAxios } from "./http";

const local = localAxios();
const url = "/user"; // 공통 URL

// GPS 위치 가져오기
function getGPS(param, success, fail) {
  local.put("/gps", JSON.stringify(param)).then(success).catch(fail);
}

// GPS 위치 쿠키에서 삭제
function deleteGPS(success, fail) {
  local.get("/gps").then(success).catch(fail);
}

export { getGPS, deleteGPS };
