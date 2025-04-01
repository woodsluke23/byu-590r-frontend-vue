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
    },
    mutations: {
        setRestaurants(state, results) {
            state.restaurantsList = results
        },
    },
    getters: {
        getRestaurants: (state) => {
            return state.restaurantsList
        },
    },
}
