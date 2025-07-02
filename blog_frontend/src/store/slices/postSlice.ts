import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Post, PostState } from "../../types/post";

const initialState: PostState = {
  posts: [],
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    setPosts(state, action: PayloadAction<Post[]>) {
      state.posts = action.payload;
    },
    addPost(state, action: PayloadAction<Post>) {
      state.posts.unshift(action.payload);
    },
  },
});

export const { setPosts, addPost } = postSlice.actions;
export default postSlice.reducer;
