import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchUsers = createAsyncThunk('fetchUsers', () => 
    axios('https://jsonplaceholder.typicode.com/users')
    .then(resp => resp.data)
);
const usersAdaptrer = createEntityAdapter();
const initialState = usersAdaptrer.getInitialState({
    status: 'iddle',
    error: null
});
const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
    },
    extraReducers: {
        [fetchUsers.pending]: state => {state.status = 'loading'},
        [fetchUsers.rejected]: (state, action) => {
            state.status = 'error';
            state.error = action.error.message;
        },
        [fetchUsers.fulfilled]: (state, action) => {
            state.status = 'complete';
            usersAdaptrer.upsertMany(state, action.payload)
        }
    }
});

export const {selectById: selectUserById, selectAll: selectAllUsers} = usersAdaptrer.getSelectors(state => state.users);
export default usersSlice.reducer;