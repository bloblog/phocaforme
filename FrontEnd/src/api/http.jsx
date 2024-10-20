import axios from "axios";

// axios 인스턴스를 생성하는 함수
export const localAxios = () => {
  const instance = axios.create({
    baseURL: import.meta.env.VITE_APP_API_URL, // 공통 API URL 설정
    withCredentials: true, // 공통 옵션 설정
    headers: {
      "Content-Type": "application/json",
    },
  });

  // 응답 인터셉터 추가 (401)
  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response && error.response.status === 401) {
        window.location.href = "/login"; // 로그인 페이지로 리다이렉트
      }
      return Promise.reject(error);
    }
  );

  return instance;
};
