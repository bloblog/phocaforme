import { createSlice } from '@reduxjs/toolkit';

// 쿠키에서 userId 및 nickname을 읽어오는 함수
const getDecodedCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return decodeURIComponent(parts.pop().split(';').shift());
};

// 쿠키에서 userId 및 nickname을 디코딩하여 초기 상태에 추가
const initialUserState = {
  user: {
    userId: getDecodedCookie('userId') || null,
    nickname: getDecodedCookie('nickname') || null,
    token: getDecodedCookie('token') || null,
    location: null, // 현재 위치 정보
    defaultGroup: null, // bias
    defaultMember: null,
    location_longlat: [],
  },
};

const loginUserSlice = createSlice({
  name: 'user',
  initialState: initialUserState,
  reducers: {
    loginUser: (state, action) => {
      state.user = action.payload;
    },
    logoutUser: (state) => {
      state.user = null;
    },
    setLocation: (state, action) => {
      state.user.location = action.payload;
    },
    setLocationLongLat: (state, action) => {
      state.user.location_longlat = [...action.payload];
    },
    setNickname: (state, action) => {
      state.user.nickname = action.payload;
      
    },
    setBias: (state, action) => {
      [state.user.defaultGroup, state.user.defaultMember] = action.payload;

    }
  },
});

export const { loginUser, logoutUser, setLocation, setNickname, setBias, setLocationLongLat } = loginUserSlice.actions;
export default loginUserSlice.reducer;
