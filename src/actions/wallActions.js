import {createAsyncThunk} from '@reduxjs/toolkit'
import api from '../api'

export const getPhotos = createAsyncThunk('wall/getPhotos', async ({page, perPage}) => {

    const photos = await api.getPhotos(page, perPage);
    return photos;
});

