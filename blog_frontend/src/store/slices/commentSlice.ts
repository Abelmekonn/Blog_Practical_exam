import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Comment, CommentState } from "../../types/comment";

const initialState: CommentState = {
  comments: [],
};

const commentSlice = createSlice({
  name: "comment",
  initialState,
  reducers: {
    setComments(state, action: PayloadAction<Comment[]>) {
      state.comments = action.payload;
    },
    addComment(state, action: PayloadAction<Comment>) {
      state.comments.push(action.payload);
    },
  },
});

export const { setComments, addComment } = commentSlice.actions;
export default commentSlice.reducer;
