import axios from 'axios'
import API_URL from './env'
import authHeader from './auth-header'
class UserService {
    getUser() {
        return axios.get(API_URL + 'user', { headers: authHeader() }).then((response) => {
            console.log(response)
            return response.data.results
        })
    }
    uploadAvatar(image) {
        let formData = new FormData()
        formData.append('image', image)
        return axios
            .post(API_URL + 'user/upload_avatar', formData, { headers: authHeader('multipart') })
            .then((response) => {
                return response.data.results
            })
    }
    removeAvatar() {
        return axios
            .delete(API_URL + 'user/remove_avatar', { headers: authHeader() })
            .then((response) => {
                return response.data.results
            })
    }
    sendVerificationEmail(emailData) {
        return axios
            .post(API_URL + 'user/send_verification_email', emailData, { headers: authHeader() })
            .then((response) => {
                return response.data
            })
    }
    changeEmail(changeEmail) {
        return axios
            .post(API_URL + 'user/change_email', changeEmail, { headers: authHeader() })
            .then((response) => {
                return response.data.results
            })
    }
}

const userService = new UserService()
export default userService
