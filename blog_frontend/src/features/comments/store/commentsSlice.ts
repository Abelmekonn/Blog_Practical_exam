import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type {
  Comment,
  CommentState,
  CreateCommentRequest,
  UpdateCommentRequest,
} from "../types";
import { commentsApi } from "../api/comments.api";

const initialState: CommentState = {
  comments: [],
  loading: false,
  error: null,
};

// Async thunks using feature API
export const fetchCommentsByPostId = createAsyncThunk(
  "comments/fetchByPostId",
  async (postId: string, { rejectWithValue }) => {
    try {
      const response = await commentsApi.getCommentsByPostId(postId);
      return response;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch comments"
      );
    }
  }
);

export const fetchCommentById = createAsyncThunk(
  "comments/fetchById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await commentsApi.getCommentById(id);
      return response;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch comment"
      );
    }
  }
);

export const createComment = createAsyncThunk(
  "comments/create",
  async (commentData: CreateCommentRequest, { rejectWithValue }) => {
    try {
      const response = await commentsApi.createComment(commentData);
      return response;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to create comment"
      );
    }
  }
);

export const updateComment = createAsyncThunk(
  "comments/update",
  async (
    { id, commentData }: { id: string; commentData: UpdateCommentRequest },
    { rejectWithValue }
  ) => {
    try {
      const response = await commentsApi.updateComment(id, commentData);
      return response;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to update comment"
      );
    }
  }
);

export const deleteComment = createAsyncThunk(
  "comments/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await commentsApi.deleteComment(id);
      return id;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to delete comment"
      );
    }
  }
);

const commentsSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {
    clearComments: (state) => {
      state.comments = [];
    },
    clearError: (state) => {
      state.error = null;
    },
    setComments: (state, action: PayloadAction<Comment[]>) => {
      state.comments = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch Comments by Post ID
    builder
      .addCase(fetchCommentsByPostId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCommentsByPostId.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = action.payload;
      })
      .addCase(fetchCommentsByPostId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create Comment
    builder
      .addCase(createComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.loading = false;
        state.comments.push(action.payload);
      })
      .addCase(createComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update Comment
    builder
      .addCase(updateComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateComment.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.comments.findIndex(
          (comment) => comment.id === action.payload.id
        );
        if (index !== -1) {
          state.comments[index] = action.payload;
        }
      })
      .addCase(updateComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete Comment
    builder
      .addCase(deleteComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = state.comments.filter(
          (comment) => comment.id !== action.payload
        );
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearComments, clearError, setComments } = commentsSlice.actions;
export default commentsSlice.reducer;
