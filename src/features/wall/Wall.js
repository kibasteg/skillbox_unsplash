import React, {useEffect} from 'react';
import {useSelector, useDispatch} from "react-redux";
import {Link} from 'react-router-dom';
import DatePhoto from '../../components/DatePhoto'

import {

    loadItems,
    selectStatus,
    selectItems,
    selectPage,
    selectPerPage,

} from './wallSlice';

import './wall.css';

function Photo(props) {

    const photo = props.photo;

    return (
        <div key={photo.id} className="wall-item">
            <Link to={{pathname: `/photo/${photo.id}`, photo: photo}} style={{backgroundImage: `url(${photo.urls.thumb})`}} className="wall-item__thumb">
                <div className={`wall-item__likes${photo.liked_by_user ? ' wall-item__likes--me' : ''}`}>{photo.likes}</div>
            </Link>
            <div className="wall-item__captions">
                <a target="_blank" href={photo.user.links.html} className="wall-item__user">{photo.user.name}</a>
                <div className="wall-item__date"><DatePhoto date={photo.created_at} /></div>
            </div>
        </div>
    );

}

function Wall() {

    const status = useSelector(selectStatus);
    const items = useSelector(selectItems);
    const page = useSelector(selectPage);
    const perPage = useSelector(selectPerPage);
    const dispatch = useDispatch();

    const handleLoadPage = () => {

        dispatch(loadItems({page: page+1, perPage: perPage}));

    };

    useEffect(() => {

        if (page === 0)
            handleLoadPage();

    }, [page, dispatch]);

    let statusContent;

    if (status === 'loading') {
        statusContent = <div>Loading...</div>
    }

    const photos = items.map(photo => {
        return <Photo key={photo.id} photo={photo} />
    });

    return (
        <div className="wall">
            <div className="wall__items">
                {photos}
            </div>
            <div>{statusContent}</div>
            <div className="wall__actions">
                <button type="button" onClick={handleLoadPage}>Load more</button>
            </div>
        </div>
    )

}

export default Wall;