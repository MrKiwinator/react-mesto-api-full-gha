class Api {
    constructor(options) {
        this._url = options.baseUrl;
        this._headers = options.headers;
        this._credentials = options.credentials;
    }

    _checkResponse(res) {
        if (res.ok) {
            return res.json();
        }
        return Promise.reject(`Ошибка: ${res.status}`);
    }

    getUserInfo() {
        return fetch(`${this._url}/users/me`, {
            method: "GET",
            credentials: this._credentials,
            headers: this._headers
        })
            .then(this._checkResponse)
    }

    setUserInfo(userData) {
        return fetch(`${this._url}/users/me`, {
            method: "PATCH",
            credentials: this._credentials,
            headers: this._headers,
            body: JSON.stringify({
                name: userData.name,
                about: userData.about,
                avatar: userData.avatar
            })
        })
            .then(this._checkResponse)
    }

    setUserAvatar(avatar) {
        return fetch(`${this._url}/users/me/avatar`, {
            method: "PATCH",
            credentials: this._credentials,
            headers: this._headers,
            body: JSON.stringify({
                avatar: avatar
            })
        })
            .then(this._checkResponse)
    }

    getCards() {
        return fetch(`${this._url}/cards`, {
            method: "GET",
            credentials: this._credentials,
            headers: this._headers
        })
            .then(this._checkResponse)
    }

    addCard(cardData) {
        return fetch(`${this._url}/cards`, {
            method: "POST",
            credentials: this._credentials,
            headers: this._headers,
            body: JSON.stringify({
                name: cardData.name,
                link: cardData.link
            })
        })
            .then(this._checkResponse)
    }

    delCard(cardId) {
        return fetch(`${this._url}/cards/${cardId}`, {
            method: "DELETE",
            credentials: this._credentials,
            headers: this._headers
        })
            .then(this._checkResponse);
    }

    setLike(cardId) {
        return fetch(`${this._url}/cards/${cardId}/likes`, {
            method: "PUT",
            credentials: this._credentials,
            headers: this._headers
        })
            .then(this._checkResponse)
    }

    deleteLike(cardId) {
        return fetch(`${this._url}/cards/${cardId}/likes`, {
            method: "DELETE",
            credentials: this._credentials,
            headers: this._headers
        })
            .then(this._checkResponse)
    }

    changeLikeCardStatus(cardId, isLiked) {
        if (isLiked) {
            return this.setLike(cardId);
        } else {
            return this.deleteLike(cardId);
        }
    }
}

const api = new Api({
    baseUrl: "https://api.mesto-service.nomoredomains.work", // "http://localhost:3000"
    credentials: "include",
    headers: {
        'Content-Type': 'application/json',
    }
});

export default api;