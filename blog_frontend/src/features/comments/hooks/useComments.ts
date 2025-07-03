import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
  fetchCommentsByPostId,
  createComment,
  updateComment,
  deleteComment,
  clearComments,
  clearError,
} from "../store/commentsSlice";
import type { CreateCommentRequest, UpdateCommentRequest } from "../types";

export const useComments = () => {
  const dispatch = useAppDispatch();
  const { comments, loading, error } = useAppSelector(
    (state) => state.comments
  );

  const loadCommentsByPostId = useCallback(
    (postId: string) => {
      return dispatch(fetchCommentsByPostId(postId));
    },
    [dispatch]
  );

  const addComment = useCallback(
    (commentData: CreateCommentRequest) => {
      return dispatch(createComment(commentData));
    },
    [dispatch]
  );

  const editComment = useCallback(
    (id: string, commentData: UpdateCommentRequest) => {
      return dispatch(updateComment({ id, commentData }));
    },
    [dispatch]
  );

  const removeComment = useCallback(
    (id: string) => {
      return dispatch(deleteComment(id));
    },
    [dispatch]
  );

  const clearAllComments = useCallback(() => {
    dispatch(clearComments());
  }, [dispatch]);

  const clearErrorState = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    // State
    comments,
    loading,
    error,

    // Actions
    loadCommentsByPostId,
    addComment,
    editComment,
    removeComment,
    clearAllComments,
    clearErrorState,
  };
};
