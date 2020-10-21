import React, {useEffect} from 'react'
import {useDispatch, useSelector} from "react-redux";
import {Redirect} from 'react-router-dom'
import {fetchToken, fetchUser} from "../../actions/userActions";
import {selectUserStatus, selectTokenStatus, selectErrText} from "../../selectors/userSelector";

function Auth() {

    const dispatch = useDispatch();
    const userStatus = useSelector(selectUserStatus);
    const tokenStatus = useSelector(selectTokenStatus);
    const errText = useSelector(selectErrText);
    const code = window.location.search.split('code=')[1];

    useEffect(() => {

        if (tokenStatus === 'idle') {

            dispatch(fetchToken(code));

        } else if (tokenStatus === 'success') {

            dispatch(fetchUser());
        }

    }, [tokenStatus, code, dispatch]);

    let content;

    if (tokenStatus === 'success' && userStatus === 'success')
        content = <Redirect to="/" />;
    else if (tokenStatus === 'process')
        content = 'Загрузка токена...';
    else if (userStatus === 'process')
        content = 'Загрузка пользователя...';
    else
        content = <div>Ошибка авторизации: {errText}</div>;

    return (
        <div>
            <div>{content}</div>
        </div>
    );

}

export default Auth;