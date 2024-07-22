export function setCookie(name, value, daysToLive) {
    let cookie = name + '=' + encodeURIComponent(value);

    if (daysToLive) {
        let expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + daysToLive);
        cookie += '; expires=' + expirationDate.toUTCString();
    }

    document.cookie = cookie;
}


export function getCookie(name) {
    let cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        let cookieName = cookie.split('=')[0];
        let cookieValue = cookie.split('=')[1];
        if (cookieName === name) {
            return decodeURIComponent(cookieValue);
        }
    }
    return null;
}


