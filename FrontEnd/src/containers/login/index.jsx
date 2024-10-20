import "./index.css";

import { KAKAO_AUTH_URL } from "./OAuth";

import icon from "@/assets/images/icon.PNG";
import kakao from "@/assets/images/kakao_login.png";

const LoginPage = () => {
  const loginHandler = () => {
    window.location.href = KAKAO_AUTH_URL;
  };

  // const [loginPersistChecked, setLoginPersistChecked] = useState(false);

  // const toggleLoginPersist = () => {
  //   setLoginPersistChecked(prevState => !prevState);

  //   if (!loginPersistChecked) {
  //     tokenExtension();

  //   };
  // }

  // const tokenExtension = () => {
  //   axios.post(import.meta.env.VITE_APP_API_URL + "auth/login-status",
  //       { loginStatus: loginPersistChecked },
  //       { withCredentials: true,}
  //   ).then(res => {
  //     console.log('연장성공')
  //   }).catch(e => {
  //    console.log('에러')
  //   })
  // }

  return (
    <div>
      <div id="login-container">
        <img id="icon-container" src={icon} />
        <div id="text-container">
          <div id="login-title">카카오 간편 로그인으로</div>
          <div id="login-title">포카포미의 모든 기능을 누리세요!</div>
        </div>
        <img id="kakao-button" src={kakao} onClick={() => loginHandler()} />
        {/* <input
          type="checkbox"
          checked={loginPersistChecked}
          onChange={toggleLoginPersist}
        /> */}
        {/* <label>로그인유지여부</label> */}
      </div>
    </div>
  );
};

export default LoginPage;
