import restaurantService from '../services/restaurant.service'

const initialState = {
    restaurantsList: [],
    chickenTypes: [],
}

export const restaurants = {
    namespaced: true,
    state: initialState,
    actions: {
        getRestaurants({ commit }) {
            return restaurantService.getRestaurants().then(
                (results) => {
                    commit('setRestaurants', results)
                    return Promise.resolve(results)
                },
                (response) => {
                    return Promise.resolve(response)
                }
            )
        },

        getChickenTypes({ commit }) {
            return restaurantService.getChickenTypes().then(
                (results) => {
                    commit('setChickenTypes', results)
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

        updateRestaurantPicture({ commit }, restaurant) {
            return restaurantService
                .updateRestaurantPicture(restaurant)
                .then((response) => {
                    // Assuming the API response includes the updated restaurant data
                    const updatedRestaurant = response.restaurant

                    // Commit mutation to update the restaurant's picture in the list
                    commit('updateRestaurantPictureInList', updatedRestaurant)

                    return Promise.resolve(response)
                })
                .catch((error) => {
                    return Promise.reject(error)
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
        setChickenTypes(state, results) {
            state.chickenTypes = results
        },
        addRestaurant(state, restaurant) {
            state.restaurantsList.push(restaurant)
        },
        setRestaurant(state, restaurant) {
            const index = state.restaurantsList.findIndex((r) => r.id === restaurant.id)
            if (index !== -1) {
                // Update the restaurant with the new data (including the image)
                state.restaurantsList[index] = {
                    ...state.restaurantsList[index],
                    ...restaurant, // This will update all fields, including the image
                }
            }
        },
        removeRestaurant(state, restaurant) {
            state.restaurantsList.splice(restaurant.index + 1, 1)
        },

        // Add this mutation to update the restaurant's image in the list
        updateRestaurantPictureInList(state, updatedRestaurant) {
            const index = state.restaurantsList.findIndex((r) => r.id === updatedRestaurant.id)
            if (index !== -1) {
                // Update the restaurant's image field
                state.restaurantsList[index].file = updatedRestaurant.file
            }
        },
    },
    getters: {
        getRestaurants: (state) => {
            return state.restaurantsList
        },

        getChickenTypes: (state) => {
            return state.chickenTypes
        },

        getRestaurantStateIndexByRestaurantID: (state) => (restaurantID) => {
            return state.restaurantsList.findIndex((restaurant) => {
                return restaurant.id === restaurantID
            })
        },
    },
}
