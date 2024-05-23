import { createSlice } from '@reduxjs/toolkit';

const initialChatState = {
  chat: [],
};

const chatSlice = createSlice({
  name: 'chat',
  initialState: initialChatState,
  reducers: {
    sendChat: (state, action) => {
      return {
        ...state,
        chat: [...state.chat, action.payload],
      };
    },
    
    initChat: (state, action) => {
      return {
        ...state,
        chat: action.payload,
      };
    }
  },
});

export const { sendChat, initChat } = chatSlice.actions;
export default chatSlice.reducer;
