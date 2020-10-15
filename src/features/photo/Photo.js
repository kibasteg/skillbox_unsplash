import React, {useEffect, useState} from 'react';
import UnsplashApi from '../../unsplashApi';
import './photo.css';
import DatePhoto from '../../components/DatePhoto'
import {Link} from 'react-router-dom'
import {selectStatus as selectUserStatus} from "../user/userSlice";
import {useSelector} from "react-redux";

export default function Photo(props) {

    const [photo, setPhoto] = useState(props.location.photo || props.match.params.id);
    const [error, setError] = useState('');
    const [loaded, setLoaded] = useState(false);
    const [likeInProcess, setLikeInProcess] = useState(false);
    const [like, setLike] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const userStatus = useSelector(selectUserStatus);

    useEffect(() => {

        if (typeof photo === 'string') {

            /*
            //TODO: cache photos for dev
            const cachedPhotos = JSON.parse(window.localStorage.getItem('cachedPhotos'));
            const cachedPhoto = cachedPhotos.find(item => item.id == photo);

            if (cachedPhoto) {

                setPhoto(cachedPhoto);
                loadComplete();
                return;
            }*/

            UnsplashApi.getPhoto(photo).then(response => {

                setPhoto(response);
                loadComplete();

            }).catch(err => {

                setError(err.message);

            });

        } else
            loadComplete();


    }, [loaded, photo]);

    const loadComplete = () => {

        setLike(photo.liked_by_user);
        setLikeCount(photo.likes);
        setLoaded(true);
    };

    const handleLike = () => {

        if (userStatus !== 'success') {
            alert('Требуется авторизация');
            return;
        }

        setLikeInProcess(true);

        UnsplashApi.setLike(photo.id, !like)
            .then(response => {

                if (response.photo && response.photo) {

                    setLikeCount(response.photo.likes);
                    setLike(response.photo.liked_by_user);

                } else {
                    setLike(!like);
                    setLikeCount(like ? likeCount - 1 : likeCount + 1);
                }

                setLikeInProcess(false);

            }).catch(e => {

                setLikeInProcess(false);
                window.console.log(e, e.message);

            });
    };

    let content;

    if (loaded) {

        const likeBtn = userStatus === 'success'
            ? <button className="photo__like-btn" type="button" disabled={likeInProcess} onClick={handleLike}>{like ? 'Unlike' : 'Like'}</button>
            : '';

        content = (
            <div className="photo">
                <Link className="photo__back-main-btn" to="/">На главную</Link>
                <div className={`photo__pic${photo.width/photo.height < 1 ? ' photo__pic--vertical' : ''}`} style={{backgroundImage: `url(${photo.urls.regular})`, paddingTop: `${Math.ceil(photo.height/photo.width*100)}%`}}></div>
                <div className="photo__captions">
                    <div className="photo__captions__item photo__captions__item--user"><a href={photo.user.links.html} target="_blank">{photo.user.name}</a></div>
                    <div className="photo__captions__item photo__captions__item--date"><DatePhoto date={photo.created_at} /></div>
                    <div className="photo__captions__item photo__captions__item--likes">
                        <span>Likes: {likeCount}</span>
                        {likeBtn}
                    </div>
                </div>
            </div>);

    } else {

        if (error) {

            content = <div className="photo__err">{error}</div>

        } else {

            content = <div className="photo__loader">Загрузка фото...</div>
        }
    }

    return (
        <div className="photo">
            {content}
        </div>
    )

}