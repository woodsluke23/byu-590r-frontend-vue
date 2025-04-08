import { restaurants } from '@/store/restaurants.module'
import { defineComponent } from 'vue'
import { mapState } from 'vuex'

export default defineComponent({
    name: 'RestaurantView',
    data() {
        return {
            newRestaurant: {
                restaurant_name: '',
                restaurant_description: '',
                img: '',
            },
            editRestaurant: {},
            selectedDeleteRestaurant: null,

            newRestaurantImage: null,

            // Messages
            errorMessage: '',
            editRestaurantErrorMessage: null,
            newRestaurantErrorMessage: null,
            reportSentMessage: null,

            // Dialogs
            createRestaurantDialog: false,
            editRestaurantDialog: false,
            deleteRestaurantDialog: false,
            editFileChangeDialogBtn: false,
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

        openCreateDialog() {
            this.newRestaurant = {
                restaurant_name: '',
                restaurant_description: '',
                img: '',
            }
            this.createRestaurantDialog = true
        },

        closeCreateDialog() {
            this.newRestaurant = {
                restaurant_name: '',
                restaurant_description: '',
                img: '',
            }
            this.createRestaurantDialog = false
        },

        openEditRestaurantDialog(restaurant) {
            this.editRestaurant = restaurant
            this.editRestaurantDialog = true
        },

        openDeleteRestaurantDialog(restaurant) {
            this.selectedDeleteRestaurant = restaurant
            this.deleteRestaurantDialog = true
        },

        deleteRestaurant() {
            this.deleteRestaurantErrorMessage = null
            this.$store
                .dispatch('restaurants/deleteRestaurant', this.selectedDeleteRestaurant)
                .then(() => {
                    this.getRestaurants()
                    this.selectedDeleteRestaurant = false
                    this.deleteRestaurantDialog = false
                })
                .catch((error) => {
                    this.deleteRestaurantErrorMessage = error.response.data.data
                })
        },

        updateRestaurant() {
            this.$store
                .dispatch('restaurants/updateRestaurant', this.editRestaurant)
                .then(() => {
                    // If the picture was changed, update it
                    if (this.newRestaurantImage) {
                        this.$store
                            .dispatch('restaurants/updateRestaurantPicture', {
                                restaurant: this.editRestaurant,
                                picture: this.newRestaurantImage,
                            })
                            .then(() => {
                                console.log('Restaurant picture updated successfully')
                            })
                            .catch((error) => {
                                console.error('Error updating restaurant picture:', error)
                            })
                    }
                    this.editRestaurantDialog = false
                    this.getRestaurants() // Refresh the list
                })
                .catch((error) => {
                    console.error('Error updating restaurant:', error)
                })
        },

        createRestaurant() {
            this.newRestaurantErrorMessage = null
            console.log('Creating restaurant:', this.newRestaurant)
            this.$store
                .dispatch('restaurants/createRestaurant', this.newRestaurant)
                .then(() => {
                    this.getRestaurants()
                    this.createRestaurantDialog = false
                })
                .catch((error) => {
                    this.newRestaurantErrorMessage = error.response.data.data
                })
        },

        onExistingRestaurantPictureChange(file) {
            if (file) {
                // Check if a file is selected
                this.editRestaurant.img = file // Store the new image in the component state
                this.$store
                    .dispatch('restaurants/updateRestaurantPicture', {
                        restaurant: this.editRestaurant,
                        picture: file, // Pass the selected file to the store
                    })
                    .then(() => {
                        console.log('Picture updated successfully')
                    })
                    .catch((error) => {
                        console.error('Error updating picture:', error)
                    })
            }
        },

        onNewRestaurantFileChange(event) {
            this.newRestaurant.file = null

            if (!event || !event.target || !event.target.files) return

            const image = event.target.files || event.dataTransfer.files
            if (!image.length) return

            this.newRestaurant.img = image[0]
        },
    },
})
