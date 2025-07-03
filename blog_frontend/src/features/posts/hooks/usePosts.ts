import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
  fetchPosts,
  fetchPostById,
  createPost,
  updatePost,
  deletePost,
  clearCurrentPost,
  clearError,
} from "../store/postsSlice";
import type { CreatePostRequest, UpdatePostRequest } from "../types";
import type { PaginationParams } from "../api/posts.api";

export const usePosts = () => {
  const dispatch = useAppDispatch();
  const { posts, currentPost, loading, error, pagination } = useAppSelector(
    (state) => state.posts
  );

  const loadPosts = useCallback(
    (params?: PaginationParams) => {
      return dispatch(fetchPosts(params));
    },
    [dispatch]
  );

  const loadPostById = useCallback(
    (id: string) => {
      return dispatch(fetchPostById(id));
    },
    [dispatch]
  );

  const addPost = useCallback(
    (postData: CreatePostRequest) => {
      return dispatch(createPost(postData));
    },
    [dispatch]
  );

  const editPost = useCallback(
    (id: string, postData: UpdatePostRequest) => {
      return dispatch(updatePost({ id, postData }));
    },
    [dispatch]
  );

  const removePost = useCallback(
    (id: string) => {
      return dispatch(deletePost(id));
    },
    [dispatch]
  );

  const clearPost = useCallback(() => {
    dispatch(clearCurrentPost());
  }, [dispatch]);

  const clearErrorState = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    // State
    posts,
    currentPost,
    loading,
    error,
    pagination,

    // Actions
    loadPosts,
    loadPostById,
    addPost,
    editPost,
    removePost,
    clearPost,
    clearErrorState,
  };
};

export const useCurrentPost = () => {
  const { currentPost, loading, error } = usePosts();
  return { currentPost, loading, error };
};
