import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import api from '../api';

export const initUser = createAction('user/initUser');
export const setStatus = createAction('user/setStatus');
export const removeUser = createAction('user/removeUser');

export const fetchToken = createAsyncThunk('user/fetchToken', async code => {

    const accessToken = await api.getToken(code);
    return accessToken;

});

export const fetchUser = createAsyncThunk('user/fetchUser', async () => {

    const user = await api.getUser();
    return user;

});