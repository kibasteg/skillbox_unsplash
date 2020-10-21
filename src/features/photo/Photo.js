import React, {useCallback, useEffect, useState} from 'react';
import api from '../../api';
import './photo.css';
import DatePhoto from '../../components/DatePhoto'
import {Link} from 'react-router-dom'
import LikeWrapper from '../like/LikeWrapper';

function Like(props) {

    const likes = props.likes || 0;
    const myLike = props.myLike || false;
    const likeInProcess = props.likeInProcess || false;

    return (
        <div className={`photo__captions__item photo__captions__item--likes${myLike ? ' photo__captions__item--likes-my' : ''}${likeInProcess ? ' photo__captions__item--likes-process' : ''}`}>
            <span>Likes: {likes}</span>
            <button className="photo__like-btn" type="button" disabled={likeInProcess}>{myLike ? 'Unlike' : 'Like'}</button>
        </div>
    );
}

const WrapLike = LikeWrapper(Like);

export default function Photo(props) {

    const photoId = props.match.params.id;
    const [photo, setPhoto] = useState(props.location.photo || false);
    const [loading, setLoading] = useState(photo ? false : true);
    const [error, setError] = useState('');

    const getPhoto = useCallback(() => {

        api.getPhoto(photoId).then(response => {

            setPhoto(response);
            setLoading(false);

        }).catch(e => {

            setError(e.message);
            setLoading(false);
        });

    }, [photoId]);

    useEffect(() => {

        if (!photo) getPhoto();

    }, [photo, getPhoto]);

    let content;

    if (loading) {

        content = <div>Loading photo...</div>;

    } else {

        if (error.length) {

            content = <div>Error: {error}</div>;

        } else {

            content = (
                <div className="photo">
                    <Link className="photo__back-main-btn" to="/">На главную</Link>
                    <div className={`photo__pic${photo.width/photo.height < 1 ? ' photo__pic--vertical' : ''}`} style={{backgroundImage: `url(${photo.urls.regular})`, paddingTop: `${photo.height/photo.width*100}%`}}></div>
                    <div className="photo__captions">
                        <div className="photo__captions__item photo__captions__item--user"><a rel="noopener noreferrer" href={photo.user.links.html} target="_blank">{photo.user.name}</a></div>
                        <div className="photo__captions__item photo__captions__item--date"><DatePhoto date={photo.created_at} /></div>
                        <WrapLike likes={photo.likes} myLike={photo.liked_by_user} photoId={photo.id} />
                    </div>
                </div>
            );
        }
    }

    return (
        <div className="photo">
            {content}
        </div>
    )

}