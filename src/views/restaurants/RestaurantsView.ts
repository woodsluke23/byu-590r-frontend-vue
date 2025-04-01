import { defineComponent } from 'vue'
import { mapState } from 'vuex'

export default defineComponent({
    name: 'RestaurantView',
    data() {
        return {
            errorMessage: '',
        }
    },
    computed: {
        ...mapState({
            restaurants() {
                console.log(this.$store.state.restaurants)
                return this.$store.state.restaurants.restaurantsList
            },
        }),
    },
    created() {
        this.getRestaurants() // Fetch restaurants when the component is created
    },
    methods: {
        async getRestaurants() {
            try {
                await this.$store.dispatch('restaurants/getRestaurants')
            } catch (error) {
                this.errorMessage = 'Failed to load restaurants. Please try again later.'
                console.error('Error fetching restaurants:', error)
            }
        },

        // Method to generate the full image URL
        getImageUrl(imgPath: string | null): string | null {
            const baseUrl = 'https://590r-woodsluke-2025.s3.us-east-1.amazonaws.com/'
            return imgPath ? baseUrl + imgPath : null
        },
    },
})
