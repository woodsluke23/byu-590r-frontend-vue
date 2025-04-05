import restaurantService from '../services/restaurant.service'

const initialState = {
    restaurantsList: [],
}

export const restaurants = {
    namespaced: true,
    state: initialState,
    actions: {
        getRestaurants({ commit }) {
            return restaurantService.getRestaurants().then(
                (results) => {
                    console.log('here')
                    commit('setRestaurants', results)
                    return Promise.resolve(results)
                },
                (response) => {
                    return Promise.resolve(response)
                }
            )
        },

        createRestaurant({ commit }, restaurant) {
            return restaurantService.createRestaurant(restaurant).then((response) => {
                commit('addRestaurant', response.restaurant)
                return Promise.resolve(response.restaurant)
            })
        },

        updateRestaurant({ commit, getters }, restaurant) {
            return restaurantService.updateRestaurant(restaurant).then((response) => {
                response.restaurant.index = getters.getRestaurantStateIndexByRestaurantID(
                    response.restaurant.id
                )
                commit('setRestaurant', response.restaurant)
                return Promise.resolve(response.restaurant)
            })
        },

        deleteRestaurant({ commit, getters }, restaurant) {
            return restaurantService.deleteRestaurant(restaurant).then((response) => {
                response.restaurant.index = getters.getRestaurantStateIndexByRestaurantID(
                    response.restaurant.id
                )
                commit('removeRestaurant', response.restaurant)
                return Promise.resolve(response.restaurant)
            })
        },
    },
    mutations: {
        setRestaurants(state, results) {
            state.restaurantsList = results
        },

        addRestaurant(state, restaurant) {
            state.restaurantsList.push(restaurant)
        },
        setRestaurant(state, restaurant) {
            state.restaurantsList[restaurant.index] = restaurant
        },
        removeRestaurant(state, restaurant) {
            state.restaurantsList.splice(restaurant.index + 1, 1)
        },
    },
    getters: {
        getRestaurants: (state) => {
            return state.restaurantsList
        },

        getRestaurantStateIndexByRestaurantID: (state) => (restaurantID) => {
            return state.restaurantsList.findIndex((restaurant) => {
                return restaurant.id === restaurantID
            })
        },
    },
}
