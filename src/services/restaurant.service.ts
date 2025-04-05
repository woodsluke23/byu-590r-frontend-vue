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
        formData.append('img', restaurant.img)
        formData.append('restaurant_name', restaurant.restaurant_name)
        formData.append('restaurant_description', restaurant.restaurant_description)
        return axios
            .post(API_URL + 'restaurants', formData, {
                headers: authHeader('multipart'),
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

    deleteRestaurant(restaurant) {
        return axios
            .delete(API_URL + "restaurants/" + restaurant.id, { headers: authHeader() })
            .then((response) => {
                return response.data.data
            })
    }
}

const restaurantService = new RestaurantService()
export default restaurantService
