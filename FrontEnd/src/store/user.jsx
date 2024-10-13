import { doLogin } from "../api/login";

const kakaoLogin = (code) => {
  return function (dispatch, getState, { history }) {
    doLogin(
      code,
      (data) => {
        const ACCESS_TOKEN = data.data.accessToken;
        localStorage.setItem("token", ACCESS_TOKEN); // 예시로 로컬에 저장
        history.replace("/main"); // 토큰 받았었고 로그인 됐으니 화면전환 ( 메인으로 )
      },
      (err) => {
        console.error("Error Kakao Login: ", err);
        window.alert("로그인에 실패했습니다.");
        history.replace("/login"); // 로그인 실패시 로그인화면으로 돌려보냄
      }
    );
  };
};

export default kakaoLogin;
