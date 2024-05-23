export default function getUserInfoFromCookie() {
  // 쿠키 문자열 가져오기
  const cookieString = document.cookie;
  
  // 쿠키 문자열을 세미콜론과 공백을 기준으로 분할하여 배열로 만들기
  const cookieArray = cookieString.split("; ");
  
  // userId와 nickname 쿠키를 저장할 객체
  const userInfo = {};

  // 배열에서 userId와 nickname 쿠키를 찾기
  cookieArray.forEach((row) => {
    if (row.includes("userId=")) {
      userInfo.userId = row.split("=")[1];
    }
    if (row.includes("nickname=")) {
      userInfo.nickname = decodeURIComponent(row.split("=")[1]);
    }
  });

  // userId와 nickname가 모두 존재하는 경우 객체를 반환
  if (userInfo.userId && userInfo.nickname) {
    return userInfo;
  } else {
    return null; // userId 또는 nickname 중 하나라도 존재하지 않는 경우 null 반환
  }
}
