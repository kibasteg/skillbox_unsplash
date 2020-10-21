const hasLocalStorage = window && window.localStorage;
const storageKey = 'unsplashAppStorage';

export const storage = hasLocalStorage ? JSON.parse(window.localStorage.getItem(storageKey) || "{}") : {};

export const updateStorage = (state) => {

    // delete state.wall; // не сохраняем стену

    if (hasLocalStorage)
        window.localStorage.setItem(storageKey, JSON.stringify(state));
};