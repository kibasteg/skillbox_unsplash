import {createSlice} from '@reduxjs/toolkit';
import unsplashApi from '../../unsplashApi';

const unsplashUser = 'unsplashUser';
const unsplashUserToken = 'unsplashUserToken';

const hasLocalStorage = window && window.localStorage ? true : false;

export const slice = createSlice({

    name: 'user',

    initialState: {

        init: false,
        status: 'idle',
        statusText: '',
        token: hasLocalStorage ? JSON.parse(window.localStorage.getItem(unsplashUserToken) || false) : false,
        user: hasLocalStorage ? JSON.parse(window.localStorage.getItem(unsplashUser) || false) : false
    },

    reducers: {

        setInit: (state) => {

            if (state.user && state.token) {

                unsplashApi.setAccessToken(state.token.access_token);
                state.status = 'success';
            }

            state.init = true;
        },

        setStatus: (state, action) => {

            state.status = action.payload.status;
            state.statusText = action.payload.statusText;
        },

        setToken: (state, action) =>  {

            state.token = action.payload;

            unsplashApi.setAccessToken(state.token.access_token);

            if (hasLocalStorage)
                window.localStorage.setItem(unsplashUserToken, JSON.stringify(action.payload));

        },

        setUser: (state, action) => {

            state.user = action.payload;

            if (hasLocalStorage)
                window.localStorage.setItem(unsplashUser, JSON.stringify(state.user));
        },

        removeUser: state => {

            if (hasLocalStorage) {

                window.localStorage.removeItem(unsplashUser);
                window.localStorage.removeItem(unsplashUserToken);
            }

            state.token = false;
            state.user = false;
            state.status = 'idle';

        },
    }

});

export const {setStatus, setToken, setUser, setInit, removeUser} = slice.actions;

export const loadUser = code => dispatch => {

    dispatch(setStatus({status: 'loading'}));

    unsplashApi.getToken(code)

        .then(accessToken => {

            if (accessToken.error) {

                throw new Error(`${accessToken.error}: ${accessToken.error_description}`);
            }

            dispatch(setToken(accessToken));

            unsplashApi.getUser()

                .then(user => {

                    if (user.error)
                        throw new Error(`${user.error}: ${user.error_description}`);

                    dispatch(setUser(user));

                    dispatch(setStatus({status: 'success'}));

                }).catch(err => {

                    dispatch(setStatus({status: 'error', statusText: err.message}));

                })

        }).catch(err => {

            dispatch(setStatus({status: 'error', statusText: err.message}));

        });
};

export const getAuthUrl = () => unsplashApi.getAuthUrl();

export const selectStatus = state => state.user.status;
export const selectStatusText = state => state.user.statusText;
export const selectUser = state => state.user.user;
export const selectInit = state => state.user.init;

export default slice.reducer;