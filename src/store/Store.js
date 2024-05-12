// store.js

import { configureStore } from '@reduxjs/toolkit';
import todoReducer from './todo/TodoSlice';
import { saveStateToLocalStorage, loadStateFromLocalStorage } from './LocalStorage';

// Initialize Redux store with persisted state from local storage
const persistedState = loadStateFromLocalStorage();

export const store = configureStore({
  reducer: todoReducer,
  preloadedState: persistedState // Use preloadedState option to initialize the store with persisted state
});

// Subscribe to store changes and save state to local storage whenever it changes
store.subscribe(() => {
  saveStateToLocalStorage(store.getState());
});
