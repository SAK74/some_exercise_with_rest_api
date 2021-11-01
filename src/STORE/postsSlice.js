import { createSlice, createEntityAdapter, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchPosts = createAsyncThunk('fetchPosts', () => 
    axios('https://jsonplaceholder.typicode.com/posts')
    .then(resp => resp.data)
);
const postsAdapter = createEntityAdapter();
const initialState = postsAdapter.getInitialState({
    status: 'iddle',
    error: null
});
const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        postRemove: (state, action) => {
            postsAdapter.removeOne(state, action.payload)
        }
    },
    extraReducers: {
        [fetchPosts.pending]: state => {state.status = 'loading'},
        [fetchPosts.rejected]: (state, action) => {
            state.status = 'error';
            state.error = action.error.message;
        },
        [fetchPosts.fulfilled]: (state, action) => {
            state.status = 'complete';
            postsAdapter.upsertMany(state, action.payload);
        }
    }
});

export const {postRemove} = postsSlice.actions;
export const {
    // selectById: selectPostById,
    selectAll: selectAllPosts,
    // selectIds: selectPostsId,
    selectTotal: postsLength
} = postsAdapter.getSelectors(state => state.posts);
export default postsSlice.reducer;