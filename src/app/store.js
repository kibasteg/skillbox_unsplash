import {configureStore} from '@reduxjs/toolkit';
import wallReducer from '../reducers/wallReducer';
import userReducer from '../reducers/userReducer';
import {updateStorage} from '../appLocalStorage';

const store = configureStore({
    reducer: {
        wall: wallReducer,
        user: userReducer,
    }
});

store.subscribe(() => { updateStorage(store.getState()) });

export default store;