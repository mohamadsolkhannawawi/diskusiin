import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import api from '../../utils/api';
import {nextVoteType, getUserVote, applyVote} from '../shared/voteHelper';

export const asyncFetchThreadDetail = createAsyncThunk(
  'threadDetail/fetch',
  async (threadId) => api.getThreadDetail(threadId),
);

export const asyncCreateComment = createAsyncThunk(
  'threadDetail/createComment',
  async ({threadId, content}) => api.createComment({threadId, content}),
);

const threadVoteApiByType = {
  '1': api.upVoteThread.bind(api),
  '-1': api.downVoteThread.bind(api),
  '0': api.neutralizeThreadVote.bind(api),
};

const commentVoteApiByType = {
  '1': api.upVoteComment.bind(api),
  '-1': api.downVoteComment.bind(api),
  '0': api.neutralizeCommentVote.bind(api),
};

export const asyncToggleVoteThreadDetail = createAsyncThunk(
  'threadDetail/toggleThreadVote',
  async ({threadId, voteType}, {dispatch, rejectWithValue}) => {
    try {
      await threadVoteApiByType[voteType](threadId);
      return {voteType};
    } catch (error) {
      dispatch(rollbackThreadDetailVote());
      return rejectWithValue(error.message);
    }
  },
);

export const asyncToggleVoteComment = createAsyncThunk(
  'threadDetail/toggleCommentVote',
  async ({threadId, commentId, voteType}, {dispatch, rejectWithValue}) => {
    try {
      await commentVoteApiByType[voteType](threadId, commentId);
      return {commentId, voteType};
    } catch (error) {
      dispatch(rollbackCommentVote({commentId}));
      return rejectWithValue(error.message);
    }
  },
);

const threadDetailSlice = createSlice({
  name: 'threadDetail',
  initialState: {
    value: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    clearThreadDetail: (state) => {
      state.value = null;
      state.status = 'idle';
    },
    optimisticVoteThreadDetail: (state, action) => {
      const {clicked, userId} = action.payload;
      if (!state.value) return;

      state.value.previousVoteSnapshot = {
        upVotesBy: [...state.value.upVotesBy],
        downVotesBy: [...state.value.downVotesBy],
      };

      const currentVote = getUserVote(state.value, userId);
      const voteType = nextVoteType(currentVote, clicked);
      Object.assign(state.value, applyVote(state.value, userId, voteType));
    },
    rollbackThreadDetailVote: (state) => {
      if (state.value?.previousVoteSnapshot) {
        Object.assign(state.value, state.value.previousVoteSnapshot);
        delete state.value.previousVoteSnapshot;
      }
    },
    optimisticVoteComment: (state, action) => {
      const {commentId, clicked, userId} = action.payload;
      const comment = state.value?.comments.find((item) => item.id === commentId);
      if (!comment) return;

      comment.previousVoteSnapshot = {
        upVotesBy: [...comment.upVotesBy],
        downVotesBy: [...comment.downVotesBy],
      };

      const currentVote = getUserVote(comment, userId);
      const voteType = nextVoteType(currentVote, clicked);
      Object.assign(comment, applyVote(comment, userId, voteType));
    },
    rollbackCommentVote: (state, action) => {
      const comment = state.value?.comments.find(
        (item) => item.id === action.payload.commentId,
      );
      if (comment?.previousVoteSnapshot) {
        Object.assign(comment, comment.previousVoteSnapshot);
        delete comment.previousVoteSnapshot;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(asyncFetchThreadDetail.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(asyncFetchThreadDetail.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.value = action.payload;
      })
      .addCase(asyncFetchThreadDetail.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(asyncCreateComment.fulfilled, (state, action) => {
        if (state.value) {
          state.value.comments = [action.payload, ...state.value.comments];
        }
      })
      .addCase(asyncToggleVoteThreadDetail.fulfilled, (state) => {
        if (state.value) delete state.value.previousVoteSnapshot;
      })
      .addCase(asyncToggleVoteComment.fulfilled, (state, action) => {
        const comment = state.value?.comments.find(
          (item) => item.id === action.payload.commentId,
        );
        if (comment) delete comment.previousVoteSnapshot;
      });
  },
});

export const {
  clearThreadDetail,
  optimisticVoteThreadDetail,
  rollbackThreadDetailVote,
  optimisticVoteComment,
  rollbackCommentVote,
} = threadDetailSlice.actions;

export default threadDetailSlice.reducer;

/**
 * Thunk creator: optimistically vote on the currently open thread detail.
 * @param {string} threadId - The thread being voted on.
 * @param {'up'|'down'} clicked - Which vote button was pressed.
 * @return {function} A thunk to dispatch.
 */
export function voteThreadDetail(threadId, clicked) {
  return (dispatch, getState) => {
    const {authUser, threadDetail} = getState();
    if (!authUser.value || !threadDetail.value) return;

    const userId = authUser.value.id;
    const currentVote = getUserVote(threadDetail.value, userId);
    const voteType = nextVoteType(currentVote, clicked);

    dispatch(optimisticVoteThreadDetail({clicked, userId}));
    dispatch(asyncToggleVoteThreadDetail({threadId, voteType}));
  };
}

/**
 * Thunk creator: optimistically vote on a comment within the open thread.
 * @param {string} threadId - The parent thread id.
 * @param {string} commentId - The comment being voted on.
 * @param {'up'|'down'} clicked - Which vote button was pressed.
 * @return {function} A thunk to dispatch.
 */
export function voteComment(threadId, commentId, clicked) {
  return (dispatch, getState) => {
    const {authUser, threadDetail} = getState();
    if (!authUser.value || !threadDetail.value) return;

    const userId = authUser.value.id;
    const comment = threadDetail.value.comments.find((item) => item.id === commentId);
    const currentVote = getUserVote(comment, userId);
    const voteType = nextVoteType(currentVote, clicked);

    dispatch(optimisticVoteComment({commentId, clicked, userId}));
    dispatch(asyncToggleVoteComment({threadId, commentId, voteType}));
  };
}
