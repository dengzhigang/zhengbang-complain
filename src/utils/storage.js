export const setStorage = (value, key = 'token') => {
    window.sessionStorage.setItem(key, value)
}

export const getStorage = (key = 'token') => {
    try {
        return JSON.parse(window.sessionStorage.getItem(key));
    } catch (error) {
        return window.sessionStorage.getItem(key);
    }
}

export const clearStorage = (key = 'token') => {
    window.sessionStorage.removeItem(key)
}