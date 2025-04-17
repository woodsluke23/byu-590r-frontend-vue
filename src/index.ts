import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            redirect: '/restaurants', // Redirect root path to restaurants
        },
        {
            path: '/about',
            name: 'about',
            component: () => import('./views/about/AboutView.vue'),
        },
        {
            path: '/restaurants',
            name: 'restaurants',
            component: () => import('./views/restaurants/RestaurantsView.vue'),
        },
    ],
})

export default router
