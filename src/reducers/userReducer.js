import {createReducer} from "@reduxjs/toolkit";
import {storage} from '../appLocalStorage';
import api from '../api';
import {initUser, removeUser, fetchToken, fetchUser} from '../actions/userActions';

const initialState = {

    tokenStatus: 'init',
    userStatus: 'init',
    token: storage.user && storage.user.token ? storage.user.token : false,
    user: storage.user && storage.user.user ? storage.user.user : false,
    errText: ''
};

export default createReducer(initialState, builder => {

    builder

        // sync actions

        .addCase(initUser, state => {

            state.tokenStatus = state.token ? 'success' : 'idle';
            state.userStatus = state.user ? 'success' : 'idle';

            if (state.tokenStatus === 'success')
                api.setAccessToken(state.token.access_token);
        })

        .addCase(removeUser, state => {

            state.token = false;
            state.user = false;
            state.tokenStatus = 'idle';
            state.userStatus = 'idle';
            state.errText = '';
        })

        // async token

        .addCase(fetchToken.pending, (state, action) => {

            state.tokenStatus = 'process';
        })

        .addCase(fetchToken.fulfilled, (state, action) => {

            state.token = action.payload;
            api.setAccessToken(state.token.access_token);
            state.tokenStatus = 'success';
        })

        .addCase(fetchToken.rejected, (state, action) => {

            state.tokenStatus = 'error';
            state.errText = action.error.message;
        })

        // async user

        .addCase(fetchUser.pending, (state, action) => {

            state.userStatus = 'process';
        })

        .addCase(fetchUser.fulfilled, (state, action) => {

            state.user = action.payload;
            state.userStatus = 'success';
        })

        .addCase(fetchUser.rejected, (state, action) => {

            state.userStatus = 'error';
            state.errText = action.error.message;
        });
});