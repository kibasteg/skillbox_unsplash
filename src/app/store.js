import {configureStore} from '@reduxjs/toolkit';
import wallReducer from '../features/wall/wallSlice';
import userReducer from '../features/user/userSlice';

export default configureStore({
    reducer: {
        wall: wallReducer,
        user: userReducer,
    }
});