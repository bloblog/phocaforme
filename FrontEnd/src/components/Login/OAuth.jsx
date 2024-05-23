
const Client_id = '0c667ea3c8f35cc83690ec0c37f136e2'
const Redirect_URI = 'https://localhost:3000/main'

export const KAKAO_AUTH_URL = process.env.REACT_APP_LOGIN_API_URL + `oauth2/authorization/kakao`;
// export const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${Client_id}&redirect_uri=${Redirect_URI}&response_type=code`