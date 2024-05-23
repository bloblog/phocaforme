import { createSlice } from '@reduxjs/toolkit';

const initialChatListState = {
  // 임의의 값 넣어놓음
  // owner, visiter 동일하면 같은 방에 넣어야 함
  chatList: [],
};

const chatListSlice = createSlice({
  name: 'chatList',
  initialState: initialChatListState,
  reducers: {
    initChatList: (state, action) => {
      state.chatList = action.payload;
    },
    addChatList: (state, action) => {
      state.chatList = [...state.chatList, action.payload];
    },
  },
});

export const { initChatList, addChatList, } = chatListSlice.actions;
export default chatListSlice.reducer;
