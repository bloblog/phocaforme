import { createSlice } from "@reduxjs/toolkit";

const initialPostState = {
  posts: [],
};

const postSlice = createSlice({
  name: "post",
  initialState: initialPostState,
  reducers: {
    addPost: (state, action) => {
      state.posts = [...state.posts, action.payload];
      console.log(state.posts);
    },
    addCards: (state, action) => {
      state.posts = [...state.posts, ...action.payload];
    },
    modifyPost: (state, action) => {
      const modifiedPost = action.payload;
      state.posts = state.posts.map((post) =>
        post.id === modifiedPost.id ? modifiedPost : post
      );
    },
    searchPosts: (state, action) => {
      state.posts = action.payload;
    },
  },
});

export const { addPost, addCards, modifyPost, searchPosts } = postSlice.actions;
export default postSlice.reducer;
