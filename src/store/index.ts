import { createStore } from 'vuex'
import { auth } from './auth.module'
import { user } from './user.module'
import restaurantService from '@/services/restaurant.service'
import { restaurants } from './restaurants.module'
const store = createStore({
    modules: {
        auth,
        user,
        restaurants,
    },
})

export default store
