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
                file: '',
                chicken_type_id: '',
                sauce_name: '',
            },
            editRestaurant: {},
            selectedDeleteRestaurant: null,

            newRestaurantImage: null,

            // Validation errors
            errors: {
                restaurant_name: '',
                restaurant_description: '',
                chicken_type_id: '',
            },
            editErrors: {
                restaurant_name: '',
                restaurant_description: '',
                chicken_type_id: '',
            },

            // Loading states
            isCreating: false,
            isUpdating: false,
            isDeleting: false,
            isPictureUpdating: false,

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
            chickenTypes() {
                return this.$store.state.restaurants.chickenTypes
            },
        }),
        createFormValid() {
            return (
                this.newRestaurant.restaurant_name.trim() !== '' &&
                this.newRestaurant.restaurant_description.trim() !== '' &&
                this.newRestaurant.chicken_type_id !== '' &&
                !this.errors.restaurant_name &&
                !this.errors.restaurant_description &&
                !this.errors.chicken_type_id
            )
        },
        editFormValid() {
            return (
                this.editRestaurant.restaurant_name?.trim() !== '' &&
                this.editRestaurant.restaurant_description?.trim() !== '' &&
                this.editRestaurant.chicken_type_id &&
                !this.editErrors.restaurant_name &&
                !this.editErrors.restaurant_description &&
                !this.editErrors.chicken_type_id
            )
        },
    },
    created() {
        this.getRestaurants() // Fetch restaurants when the component is created
        this.getChickenTypes() // Fetch chicken types when the component is created
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

        async getChickenTypes() {
            try {
                await this.$store.dispatch('restaurants/getChickenTypes')
            } catch (error) {
                this.errorMessage = 'Failed to load chicken types. Please try again later.'
                console.error('Error fetching chicken types:', error)
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
                file: '',
                chicken_type_id: '',
                sauce_name: '',
            }
            this.resetCreateErrors()
            this.createRestaurantDialog = true
        },

        resetCreateErrors() {
            this.errors = {
                restaurant_name: '',
                restaurant_description: '',
                chicken_type_id: '',
            }
            this.newRestaurantErrorMessage = null
        },

        resetEditErrors() {
            this.editErrors = {
                restaurant_name: '',
                restaurant_description: '',
                chicken_type_id: '',
            }
            this.editRestaurantErrorMessage = null
        },

        closeCreateDialog() {
            this.newRestaurant = {
                restaurant_name: '',
                restaurant_description: '',
                file: '',
                chicken_type_id: '',
                sauce_name: '',
            }
            this.resetCreateErrors()
            this.createRestaurantDialog = false
        },

        openEditRestaurantDialog(restaurant) {
            this.editRestaurant = { ...restaurant }

            if (restaurant.sauce) {
                this.editRestaurant.sauce_name = restaurant.sauce.sauce_name
                this.editRestaurant.sauce_description = restaurant.sauce.description || ''
            } else {
                this.editRestaurant.sauce_name = ''
                this.editRestaurant.sauce_description = ''
            }

            this.resetEditErrors()
            this.editRestaurantDialog = true
        },

        openDeleteRestaurantDialog(restaurant) {
            this.selectedDeleteRestaurant = restaurant
            this.deleteRestaurantDialog = true
        },

        validateCreateForm() {
            let isValid = true
            this.resetCreateErrors()

            if (!this.newRestaurant.restaurant_name.trim()) {
                this.errors.restaurant_name = 'Restaurant name is required'
                isValid = false
            } else if (this.newRestaurant.restaurant_name.length > 100) {
                this.errors.restaurant_name = 'Restaurant name must be less than 100 characters'
                isValid = false
            }

            if (!this.newRestaurant.restaurant_description.trim()) {
                this.errors.restaurant_description = 'Description is required'
                isValid = false
            } else if (this.newRestaurant.restaurant_description.length > 500) {
                this.errors.restaurant_description = 'Description must be less than 500 characters'
                isValid = false
            }

            if (!this.newRestaurant.chicken_type_id) {
                this.errors.chicken_type_id = 'Chicken type is required'
                isValid = false
            }

            return isValid
        },

        validateEditForm() {
            let isValid = true
            this.resetEditErrors()

            if (!this.editRestaurant.restaurant_name?.trim()) {
                this.editErrors.restaurant_name = 'Restaurant name is required'
                isValid = false
            } else if (this.editRestaurant.restaurant_name.length > 100) {
                this.editErrors.restaurant_name = 'Restaurant name must be less than 100 characters'
                isValid = false
            }

            if (!this.editRestaurant.restaurant_description?.trim()) {
                this.editErrors.restaurant_description = 'Description is required'
                isValid = false
            } else if (this.editRestaurant.restaurant_description.length > 500) {
                this.editErrors.restaurant_description =
                    'Description must be less than 500 characters'
                isValid = false
            }

            if (!this.editRestaurant.chicken_type_id) {
                this.editErrors.chicken_type_id = 'Chicken type is required'
                isValid = false
            }

            return isValid
        },

        async deleteRestaurant() {
            if (this.isDeleting) return

            this.isDeleting = true
            try {
                await this.$store.dispatch(
                    'restaurants/deleteRestaurant',
                    this.selectedDeleteRestaurant
                )
                await this.getRestaurants()
                this.selectedDeleteRestaurant = null
                this.deleteRestaurantDialog = false
            } catch (error) {
                this.deleteRestaurantErrorMessage =
                    error.response?.data?.data || 'Failed to delete restaurant'
                console.error('Error deleting restaurant:', error)
            } finally {
                this.isDeleting = false
            }
        },

        async updateRestaurant() {
            if (this.isUpdating) return

            if (!this.validateEditForm()) {
                return
            }

            this.isUpdating = true
            try {
                await this.$store.dispatch('restaurants/updateRestaurant', this.editRestaurant)

                // If the picture was changed, update it
                if (this.newRestaurantImage) {
                    this.isPictureUpdating = true
                    try {
                        await this.$store.dispatch('restaurants/updateRestaurantPicture', {
                            restaurant: this.editRestaurant,
                            picture: this.newRestaurantImage,
                        })
                        console.log('Restaurant picture updated successfully')
                    } catch (pictureError) {
                        console.error('Error updating restaurant picture:', pictureError)
                    } finally {
                        this.isPictureUpdating = false
                    }
                }

                this.editRestaurantDialog = false
                await this.getRestaurants() // Refresh the list
            } catch (error) {
                this.editRestaurantErrorMessage =
                    error.response?.data?.data || 'Failed to update restaurant'
                console.error('Error updating restaurant:', error)
            } finally {
                this.isUpdating = false
            }
        },

        async createRestaurant() {
            if (this.isCreating) return

            if (!this.validateCreateForm()) {
                return
            }

            this.isCreating = true
            try {
                await this.$store.dispatch('restaurants/createRestaurant', this.newRestaurant)
                await this.getRestaurants()
                this.createRestaurantDialog = false
            } catch (error) {
                this.newRestaurantErrorMessage =
                    error.response?.data?.data || 'Failed to create restaurant'
                console.error('Error creating restaurant:', error)
            } finally {
                this.isCreating = false
            }
        },

        onExistingRestaurantPictureChange(e) {
            var image = e.target.files || e.dataTransfer.files
            if (!image.length) return
            console.log(this.editRestaurant)
            this.editRestaurant.file = image[0]

            // Check if a file is selected
            this.$store
                .dispatch('restaurants/updateRestaurantPicture', this.editRestaurant)
                .then(() => {
                    console.log('Picture updated successfully')
                })
                .catch((error) => {
                    console.error('Error updating picture:', error)
                })
        },

        onNewRestaurantFileChange(event) {
            this.newRestaurant.file = null
            if (!event || !event.target || !event.target.files) return

            const files = event.target.files || event.dataTransfer.files
            if (!files.length) return

            const fileSize = files[0].size / 1024 / 1024 // size in MB

            if (fileSize > 5) {
                this.errors.file = 'Image must be less than 5MB'
                return
            }

            this.errors.file = ''
            this.newRestaurant.file = files[0]
        },
    },
})
