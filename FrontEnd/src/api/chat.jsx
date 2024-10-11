import { localAxios } from "./http";
import { getNickname } from "./nickname";
import { getImage } from "./post";

const local = localAxios();
const url_chatroom = "/chatRoom"; // 공통 URL
const url_chat = "/chats"; // 공통 URL

// 채팅방 가져오기
function getChatRoom(success, fail) {
  local.get(url_chatroom).then(success).catch(fail);
}

// 채팅방 정보 가져오기 (상대방 닉네임, 썸네일)
function getChatRoomInfo(chatrooms, loginUser, success, fail) {
  const promises = chatrooms.map(async (chatroom) => {
    const nicknamePromise = new Promise((resolve, reject) => {
      getNickname(
        {
          userId:
            chatroom.ownerId !== loginUser.userId
              ? chatroom.ownerId
              : chatroom.visiterId,
        },
        (data) => resolve({ type: "nickname", data: data.data }),
        reject
      );
    });

    const imagePromise = new Promise((resolve, reject) => {
      getImage(
        chatroom.boardId,
        (data) => resolve({ type: "image", data: data.data.photos[0] || null }),
        reject
      );
    });

    // 두 Promise를 동시에 처리
    const results = await Promise.all([nicknamePromise, imagePromise]);
    return {
      chatRoomId: chatroom.chatRoomId,
      nickname: results.find((res) => res.type === "nickname").data,
      image: results.find((res_1) => res_1.type === "image").data,
    };
  });

  // 모든 업데이트가 완료되면 처리
  Promise.all(promises).then(success).catch(fail);
}

// 채팅 내역 가져오기
function getChatList(param, success, fail) {
  local.get(`${url_chat}/${param}`).then(success).catch(fail);
}

// 판매 완료 처리하기
function updateChatState(param, success, fail) {
  local.put(`${url_chat}/done/${param}`).then(success).catch(fail);
}

export { getChatRoom, getChatRoomInfo, getChatList, updateChatState };
