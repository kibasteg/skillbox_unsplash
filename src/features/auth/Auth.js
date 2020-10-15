import React, {useEffect} from 'react'
import {useDispatch, useSelector} from "react-redux";
import {Redirect} from 'react-router-dom'
import {
    loadUser,
    selectStatus,
    selectStatusText,
} from "../user/userSlice";

function Auth() {

    const dispatch = useDispatch();
    const userStatus = useSelector(selectStatus);
    const userStatusText = useSelector(selectStatusText);

    const code = window.location.search.split('code=')[1];

    useEffect(() => {

        if (userStatus === 'idle')
            dispatch(loadUser(code));

    }, [userStatus, dispatch, code]);

    let content;

    if (!code) {

        content = <div>Не получен код авторизации. Вернуться на главную</div>;

    } else {

        if (userStatus === 'loading')
            content = <div>Загрузка пользователя...</div>;
        else if (userStatus === 'success')
            content = <Redirect to="/" />;
        else if (userStatus === 'error')
            content = <div>Ошибка загрузки пользователя: ({userStatusText}) <a href={'/'}>Вернуться на главную</a></div>
    }


    return (
        <div>
            <div>{content}</div>
        </div>
    );

}

export default Auth;