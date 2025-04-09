import axios from 'axios'
import API_URL from './env'
import authHeader from './auth-header'

class RestaurantService {
    // Get all restaurants (GET request)
    getRestaurants() {
        return axios.get(API_URL + 'restaurants', { headers: authHeader() }).then((response) => {
            console.log(response) // Optional: log the response to verify data
            return response.data.data
        })
    }

    createRestaurant(restaurant) {
        let formData = new FormData()
        formData.append('file', restaurant.file)
        formData.append('restaurant_name', restaurant.restaurant_name)
        formData.append('restaurant_description', restaurant.restaurant_description)
        for (let pair of formData.entries()) {
            console.log(pair[0] + ', ' + pair[1])
        }

        return axios
            .post(API_URL + 'restaurants', formData, {
                headers: authHeader(),
            })
            .then((response) => {
                return response.data.data
            })
    }

    updateRestaurant(restaurant) {
        return axios
            .put(API_URL + 'restaurants/' + restaurant.id, restaurant, { headers: authHeader() })
            .then((response) => {
                return response.data.data
            })
    }

    // updateRestaurantPicture(restaurant, picture) {
    //     // Check if the picture exists and is a valid file
    //     if (!picture || !picture[0]) {
    //         return Promise.reject(new Error('Invalid picture file'))
    //     }

    //     let formData = new FormData()
    //     formData.append('img', picture[0]) // Ensure picture[0] is a valid file

    //     // Logging the formData for debugging purposes
    //     for (let pair of formData.entries()) {
    //         console.log(pair[0] + ', ' + pair[1])
    //     }

    //     return axios
    //         .put(API_URL + `restaurants/${restaurant.id}/update-picture`, formData, {
    //             headers: authHeader(),
    //         })
    //         .then((response) => {
    //             return response.data.data
    //         })
    //         .catch((error) => {
    //             console.error('Error updating restaurant picture:', error)
    //             throw error
    //         })
    // }

    updateRestaurantPicture(restaurant) {
        let formData = new FormData()
        console.log(restaurant)
        formData.append('file', restaurant.file)
        return axios
            .post(
                API_URL + 'restaurants/' + restaurant.id + '/update_restaurant_picture',
                formData,
                {
                    headers: authHeader(),
                }
            )
            .then((response) => {
                return response.data.data
            })
    }

    deleteRestaurant(restaurant) {
        return axios
            .delete(API_URL + 'restaurants/' + restaurant.id, { headers: authHeader() })
            .then((response) => {
                return response.data.data
            })
    }
}

const restaurantService = new RestaurantService()
export default restaurantService
