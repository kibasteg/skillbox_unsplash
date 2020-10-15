import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";

import {
    BrowserRouter as Router,
    Switch,
    Route
} from 'react-router-dom'

import {
    selectInit as selectUserInit,
    selectStatus as selectUserStatus,
    selectUser,

    removeUser,
    setInit as setUserInit,
    getAuthUrl,
} from './features/user/userSlice'

import Auth from './features/auth/Auth';
import Wall from './features/wall/Wall';
import Photo from './features/photo/Photo'

import './app.css';

function App() {

    const dispatch = useDispatch();
    const userInit = useSelector(selectUserInit);
    const userStatus = useSelector(selectUserStatus);
    const user = useSelector(selectUser);

    useEffect(() => {

        if (!userInit)
            dispatch(setUserInit());

    }, [userInit, dispatch]);

    const handleLogin = () => {

        window.location.assign(getAuthUrl());
    };

    const handleLogout = () => {

        dispatch(removeUser())

    };

    let userBar;

    if (userStatus === 'success')
        userBar = <div><span title={`${user.name} (${user.username})`} className="user-bar__name">{user.name} ({user.username})</span> <button className="btn user-bar__btn user-bar__btn--logout" type="button" onClick={handleLogout}>Выйти</button></div>;
    else
        userBar = <button className="btn user-bar__btn user-bar__btn--login" type="button" onClick={handleLogin}>Войти</button>;

    return (

        <div className="App">
            <div className="wrap">
                <div className="user-bar">{userBar}</div>
            </div>
            <div className="wrap">
                <Router>

                    <Switch>

                        <Route path="/auth" component={Auth} />
                        <Route path="/photo/:id" component={Photo} />
                        <Route path="/" component={Wall} />

                    </Switch>
                </Router>
            </div>
        </div>
    )
}

export default App;
