// store.js

import { configureStore } from '@reduxjs/toolkit';
import todoReducer from './todo/TodoSlice';
import authReducer from './auth/AuthSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    todo: todoReducer,
  },
});
