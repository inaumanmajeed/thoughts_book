import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { thoughtsAPI } from "../../services/api";

// Async thunks
export const fetchThoughts = createAsyncThunk(
  'todo/fetchThoughts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await thoughtsAPI.getAll();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch thoughts');
    }
  }
);

export const createThought = createAsyncThunk(
  'todo/createThought',
  async (text, { rejectWithValue }) => {
    try {
      const response = await thoughtsAPI.create({ text });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create thought');
    }
  }
);

export const updateThought = createAsyncThunk(
  'todo/updateThought',
  async ({ id, text }, { rejectWithValue }) => {
    try {
      const response = await thoughtsAPI.update(id, { text });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update thought');
    }
  }
);

export const deleteThought = createAsyncThunk(
  'todo/deleteThought',
  async (id, { rejectWithValue }) => {
    try {
      await thoughtsAPI.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete thought');
    }
  }
);

const initialState = {
  todos: [],
  loading: false,
  error: null,
};

export const todoSlice = createSlice({
  name: "todo",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch thoughts
      .addCase(fetchThoughts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchThoughts.fulfilled, (state, action) => {
        state.loading = false;
        state.todos = action.payload.map(thought => ({
          id: thought._id,
          text: thought.text,
        }));
      })
      .addCase(fetchThoughts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create thought
      .addCase(createThought.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createThought.fulfilled, (state, action) => {
        state.loading = false;
        state.todos.unshift({
          id: action.payload._id,
          text: action.payload.text,
        });
      })
      .addCase(createThought.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update thought
      .addCase(updateThought.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateThought.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.todos.findIndex(todo => todo.id === action.payload._id);
        if (index !== -1) {
          state.todos[index].text = action.payload.text;
        }
      })
      .addCase(updateThought.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete thought
      .addCase(deleteThought.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteThought.fulfilled, (state, action) => {
        state.loading = false;
        state.todos = state.todos.filter((todo) => todo.id !== action.payload);
      })
      .addCase(deleteThought.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = todoSlice.actions;
export default todoSlice.reducer;
