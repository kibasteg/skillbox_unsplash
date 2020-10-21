import {createReducer} from "@reduxjs/toolkit";
import {getPhotos} from "../actions/wallActions";

const initialState = {

    status: 'idle', // (idle | process | error)
    items: [],
    page: 0,
    perPage: 10,
    errText: '',
};

export default createReducer(initialState, builder => {

    builder

        .addCase(getPhotos.pending, state => {

            state.status = 'process';
        })

        .addCase(getPhotos.rejected, (state, action) => {

            state.errText = action.error.message;
            state.status = 'error';
        })

        .addCase(getPhotos.fulfilled, (state, action) => {

            Array.prototype.push.apply(state.items, action.payload.items);
            state.page = action.payload.page;
            state.status = 'idle';

        });

});