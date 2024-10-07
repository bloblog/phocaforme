import axios from "axios";

// axios 인스턴스를 생성하는 함수
export const localAxios = () => {
  return axios.create({
    baseURL: import.meta.env.VITE_APP_API_URL, // 공통 API URL 설정
    withCredentials: true, // 공통 옵션 설정
    headers: {
      "Content-Type": "application/json",
    },
  });
};
