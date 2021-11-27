

function getOrgInfo() {
    let item = localStorage.getItem("kwickquick-organization")

    return JSON.parse(item)
}

function DecodeJWT() {
    this.b64DecodeUnicode = (str) => {
        return decodeURIComponent(
            Array.prototype.map.call(atob(str), c =>
                '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
            ).join(''))
    }


    this.parseJwt = (token) => {
        return JSON.parse(
            this.b64DecodeUnicode(
                token.split('.')[1].replace('-', '+').replace('_', '/')
            )
        )
    }

    // return parseJwt
}
let decodeJwt = new DecodeJWT()


const isLoggedIn = () => {
    let tokens = getOrgInfo()
    if (!tokens || tokens.refreshToken === "" || tokens.accessToken === "") {
        return false;
    }

    try {
        // exp gives us date in milliseconds
        let { exp } = decodeJwt.parseJwt(tokens.refreshToken);

        // convert milliseconds -> seconds
        let date = new Date().getTime() / 1000;

        // check if exp date is < the present date
        if (exp < date) {
            return false;
        }

    } catch (e) {
        return false;
    }

    return true;
}
