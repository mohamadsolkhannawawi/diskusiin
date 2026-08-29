import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import api from '../../utils/api';
import {nextVoteType, getUserVote, applyVote} from '../shared/voteHelper';

export const asyncFetchThreads = createAsyncThunk(
  'threads/fetchThreads',
  async () => api.getAllThreads(),
);

export const asyncCreateThread = createAsyncThunk(
  'threads/createThread',
  async ({title, body, category}) => api.createThread({title, body, category}),
);

const voteApiByType = {
  '1': api.upVoteThread.bind(api),
  '-1': api.downVoteThread.bind(api),
  '0': api.neutralizeThreadVote.bind(api),
};

/**
 * Thunk: optimistically apply a vote on a thread, then confirm with the API.
 * If the request fails, the reducer below rolls the vote back.
 */
export const asyncToggleVoteThread = createAsyncThunk(
  'threads/toggleVote',
  async ({threadId, voteType}, {dispatch, rejectWithValue}) => {
    try {
      await voteApiByType[voteType](threadId);
      return {threadId, voteType};
    } catch (error) {
      dispatch(rollbackThreadVote({threadId}));
      return rejectWithValue(error.message);
    }
  },
);

const threadsSlice = createSlice({
  name: 'threads',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    optimisticVoteThread: (state, action) => {
      const {threadId, clicked, userId} = action.payload;
      const thread = state.items.find((item) => item.id === threadId);
      if (!thread) return;

      thread.previousVoteSnapshot = {
        upVotesBy: [...thread.upVotesBy],
        downVotesBy: [...thread.downVotesBy],
      };

      const currentVote = getUserVote(thread, userId);
      const voteType = nextVoteType(currentVote, clicked);
      Object.assign(thread, applyVote(thread, userId, voteType));
    },
    rollbackThreadVote: (state, action) => {
      const {threadId} = action.payload;
      const thread = state.items.find((item) => item.id === threadId);
      if (thread?.previousVoteSnapshot) {
        Object.assign(thread, thread.previousVoteSnapshot);
        delete thread.previousVoteSnapshot;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(asyncFetchThreads.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(asyncFetchThreads.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(asyncFetchThreads.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(asyncCreateThread.fulfilled, (state, action) => {
        state.items = [action.payload, ...state.items];
      })
      .addCase(asyncToggleVoteThread.fulfilled, (state, action) => {
        const thread = state.items.find((item) => item.id === action.payload.threadId);
        if (thread) delete thread.previousVoteSnapshot;
      });
  },
});

export const {optimisticVoteThread, rollbackThreadVote} = threadsSlice.actions;
export default threadsSlice.reducer;

/**
 * Thunk creator: apply the vote optimistically first (instant UI feedback),
 * then send the real request. Used by ThreadItem's vote buttons.
 * @param {string} threadId - The thread being voted on.
 * @param {'up'|'down'} clicked - Which vote button was pressed.
 * @return {function} A thunk to dispatch.
 */
export function voteThread(threadId, clicked) {
  return (dispatch, getState) => {
    const {authUser} = getState();
    if (!authUser.value) return;

    const userId = authUser.value.id;
    const thread = getState().threads.items.find((item) => item.id === threadId);
    const currentVote = getUserVote(thread, userId);
    const voteType = nextVoteType(currentVote, clicked);

    dispatch(optimisticVoteThread({threadId, clicked, userId}));
    dispatch(asyncToggleVoteThread({threadId, voteType}));
  };
}
