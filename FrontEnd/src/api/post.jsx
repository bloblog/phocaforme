import { localAxios } from "./http";

const local = localAxios();
const url = "/barter"; // 공통 URL

// 전체 게시글 가져오기
function getAllPost(success, fail) {
  local.get(url).then(success).catch(fail);
}

// 교환 게시글 가져오기
function getPost(param, success, fail) {
  local.get(`${url}/${param}`).then(success).catch(fail);
}

// 교환 게시글 이미지 가져오기
function getImage(param, success, fail) {
  local.get(`${url}/${param}`).then(success).catch(fail);
}

// 끌어올리기
function pullupPost(param, success, fail) {
  local.post(`${url}/regen/${param}`).then(success).catch(fail);
}

// 교환 게시글 삭제하기
function deletePost(param, success, fail) {
  local.delete(`${url}/${param}`).then(success).catch(fail);
}

// 검색 결과 가져오기 (무한 스크롤)
function getPostInfi(param, success, fail) {
  local.get(`${url}/search?page=${param}`).then(success).catch(fail);
}

export { getAllPost, getPost, getImage, pullupPost, deletePost, getPostInfi };
