export default function authHeader(type = null) {
    let user = JSON.parse(localStorage.getItem('user'))

    if (user && user.token) {
        return { Authorization: 'Bearer ' + user.token }
    } else {
        return {}
    }
}
