class Auth {
    constructor(baseUrl) {
        this._url = baseUrl;
    }

    _checkResponse(res) {
        if (res.ok) {
            console.log(res);
            return res.json();
        }
        return Promise.reject(`Ошибка: ${res.status}`);
    }

    register(email, password) {
        return fetch(`${this._url}/signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        })
            .then(this._checkResponse)
    };

    authorize(email, password) {
        return fetch(`${this._url}/signin`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        })
            .then(this._checkResponse)
            .then((data) => {
                localStorage.setItem("userId", data._id);
                return data;
            })
    };

    logout(userId) {
        return fetch(`${this._url}/logout`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId }),
        })
            .then(this._checkResponse)
    }
}

const auth = new Auth ("http://localhost:3000");

export default auth;
