import {configureStore} from '@reduxjs/toolkit';
import authUserReducer from '../states/authUser/authUserSlice';
import isPreloadReducer from '../states/isPreload/isPreloadSlice';
import threadsReducer from '../states/threads/threadsSlice';
import threadDetailReducer from '../states/threadDetail/threadDetailSlice';
import leaderboardsReducer from '../states/leaderboards/leaderboardsSlice';
import usersReducer from '../states/users/usersSlice';
import alertReducer from '../states/shared/alertSlice';

const store = configureStore({
  reducer: {
    authUser: authUserReducer,
    isPreload: isPreloadReducer,
    threads: threadsReducer,
    threadDetail: threadDetailReducer,
    leaderboards: leaderboardsReducer,
    users: usersReducer,
    alert: alertReducer,
  },
});

export default store;
