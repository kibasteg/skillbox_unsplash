import React, {useCallback, useEffect, useRef, useState, createRef} from 'react';
import {useSelector, useDispatch} from "react-redux";
import {Link} from 'react-router-dom';
import DatePhoto from '../../components/DatePhoto'
import {
    selectWallStatus,
    selectWallItems,
    selectWallPage,
    selectWallPerPage,
    selectWallErrText} from "../../selectors/wallSelector";
import {getPhotos} from "../../actions/wallActions";
import LikeWrapper from '../like/LikeWrapper';

import './wall.css';

function Like(props) {

    const likes = props.likes || 0;
    const myLike = props.myLike || false;
    const likeInProcess = props.likeInProcess || false;

    return (
        <div className={`wall-item__likes${myLike ? ' wall-item__likes--my' : ''}${likeInProcess ? ' wall-item__likes--process' : ''}`}>
            <i className="icon-heart"></i> {likes}
        </div>
    );
}

const WrapLike = LikeWrapper(Like);

function Photo(props) {

    const photo = props.photo;

    return (
        <div key={photo.id} className="wall-item">
            <Link to={{pathname: `/photo/${photo.id}`, photo: photo}} style={{backgroundImage: `url(${photo.urls.thumb})`}} className="wall-item__thumb">
                <WrapLike likes={photo.likes} myLike={photo.liked_by_user} photoId={photo.id} />
            </Link>
            <div className="wall-item__captions">
                <a target="_blank" href={photo.user.links.html} className="wall-item__user" rel="noopener noreferrer">{photo.user.name}</a>
                <div className="wall-item__date"><DatePhoto date={photo.created_at} /></div>
            </div>
        </div>
    );
}

function Wall() {

    const dispatch = useDispatch();

    const status = useSelector(selectWallStatus);
    const page = useSelector(selectWallPage);
    const perPage = useSelector(selectWallPerPage);
    const items = useSelector(selectWallItems);
    const error = useSelector(selectWallErrText);

    const handleLoadNextPage = useCallback(() => {

        if (status !== 'idle')
            return;

        const newPage = page + 1;

        dispatch(getPhotos({page: newPage, perPage: perPage}));

    }, [page, status, perPage, dispatch]);

    const observerRef = createRef();
    const observer = new IntersectionObserver(entries => {

       if (entries[0] && entries[0].isIntersecting)
           handleLoadNextPage();
    });

    useEffect(() => {

        const el = observerRef.current;
        observer.observe(el);

        return () => { observer.disconnect(); }

    }, [observerRef, observer]);

    let itemsContent;

    if (items.length)
        itemsContent = items.map(item => <Photo key={item.id} photo={item} /> );
    else
        itemsContent = <div>ITEMS NOT FOUND</div>;

    let actionsContent;

    if (status == 'error')
        actionsContent = <div>Error: {error}</div>
    else
        actionsContent = <button disabled={status !== 'idle'} onClick={handleLoadNextPage} type="button">LOAD MORE{status !== 'idle' ? ' - loading': ''}</button>;

    return (
        <div className="wall">
            <div className="wall__items">{itemsContent}</div>
            <div className="wall__actions" ref={observerRef}>
                {actionsContent}
            </div>
        </div>
    )
}

export default Wall;