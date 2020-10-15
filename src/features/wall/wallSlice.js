import {createSlice} from '@reduxjs/toolkit'
import unsplashApi from '../../unsplashApi'

export const slice = createSlice({

    name: 'wall',

    initialState: {
        status: 'idle',
        items: [],
        page: 0,
        perPage: 10
    },

    reducers: {

        setPage: (state, action) => {

            state.page = action.payload;

        },

        setStatus: (state, action) => {

            state.status = action.payload;
        },

        setItems: (state, action) => {

            Array.prototype.push.apply(state.items, action.payload);

            state.page = action.payload.page;
        }
    }
});

export const {setPage, setItems, setStatus} = slice.actions;

export const loadItems = params => dispatch => {

    dispatch(setStatus('loading'));

    /*
    // TODO: cache photos for dev

    if (params.page == 1) {

        const cachedPhotos = JSON.parse(window.localStorage.getItem('cachedPhotos'));

        if (cachedPhotos) {

            dispatch(setItems(cachedPhotos));
            dispatch(setPage(params.page));
            dispatch(setStatus('success'));

            return;
        }
    }
    */

    unsplashApi.getPhotos(params.page, params.perPage)
        .then(photos => {

            /*
            // TODO: cache photos for dev
            window.localStorage.setItem('cachedPhotos', JSON.stringify(photos));
            */

            dispatch(setItems(photos));
            dispatch(setPage(params.page));
            dispatch(setStatus('success'));

        })
        .catch(err => {

            dispatch(setStatus('error'));

        });

};

export const selectItems = state => state.wall.items;
export const selectPage = state => state.wall.page;
export const selectPerPage = state => state.wall.perPage;
export const selectStatus = state => state.wall.status;

export default slice.reducer;



