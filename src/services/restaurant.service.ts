import axios from 'axios'
import API_URL from './env'
import authHeader from './auth-header'

class RestaurantService {
    // Get all restaurants (GET request)
    getRestaurants() {
        return axios.get(API_URL + 'restaurants', { headers: authHeader() }).then((response) => {
            console.log(response) // Optional: log the response to verify data
            return response.data.data // Change this to response.data.results
        })
    }

    // Add a new restaurant (POST request)
    addRestaurant(restaurantData) {
        return axios
            .post(API_URL + 'restaurants', restaurantData, { headers: authHeader() })
            .then((response) => {
                return response.data.data // Change this to response.data.results
            })
    }
}

const restaurantService = new RestaurantService()
export default restaurantService
