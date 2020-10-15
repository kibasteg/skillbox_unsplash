import unsplashJS, {toJson} from 'unsplash-js'

const accessKey = 'cef1add7be42f2831f899aa6841f20aad77f4ab318aa330193eb723e3941b215';
const secretKey = 'c6de1ddb8918afe1345843c2ca22a287f19e0c152f2acc24f595c52607862bb9';

const unsplash = new unsplashJS({
    accessKey: accessKey,
    secret: secretKey,
    callbackUrl: /*'urn:ietf:wg:oauth:2.0:oob'*/ `${window.location.origin}/auth`,
});

const defaultPerPage = 2;

const responseToJson = function (resp) {

    if (Math.round(resp.status/100) !== 2)
        throw new Error(`Error ${resp.status}`);

    return toJson(resp);
};

export default {

    setAccessToken(accessToken) {

        unsplash.auth.setBearerToken(accessToken);

    },

    getAuthUrl() {

        return unsplash.auth.getAuthenticationUrl(['public', 'write_likes']);

    },

    getToken(code) {

        return new Promise((resolve, reject) => {

            unsplash.auth.userAuthentication(code)

                .then(responseToJson)

                .then(tokenData => {

                    if (tokenData.error) {

                        reject(`${tokenData.error}: ${tokenData.error_description}`);
                        return;
                    }

                    resolve(tokenData);

                })
                .catch(e => {

                    reject(e);

                });
        });

    },

    getUser() {

        return new Promise((resolve, reject) => {

            unsplash.currentUser.profile()

                .then(responseToJson)

                .then(userData => {

                    if (userData.error)
                        reject(`${userData.error}: ${userData.error_description}`);

                    resolve(userData);

                })
                .catch(e => {

                    reject(e);

                });
        });

    },

    getPhotos(page = 1, perPage = defaultPerPage) {

        return new Promise((resolve, reject) => {

            unsplash.photos.listPhotos(page, perPage, 'latest')
                .then(responseToJson)
                .then(response => {

                    if (response.error)
                        reject(`${response.error}: ${response.error_description}`);

                    resolve(response);

                }).catch(e => {

                     reject(e);

                });

        });

    },

    getPhoto(photoId) {

        return new Promise((resolve, reject) => {

            unsplash.photos.getPhoto(photoId)
                .then(responseToJson)
                .then(response => {

                    if (response.error)
                        reject(`${response.error}: ${response.error_description}`);

                    resolve(response);

                }).catch(e => {

                    reject(e);

                });

        });

    },

    setLike(photoId, like) {

        return new Promise((resolve, reject) => {

           unsplash.photos[like ? 'likePhoto' : 'unlikePhoto'](photoId)
               .then(responseToJson)
               .then(response => {

                   if (response.error)
                       reject(`${response.error}: ${response.error_description}`);

                   resolve(response);

               }).catch(e => {

                   reject(e);

               });
        });
    }

};


