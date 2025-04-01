<template>
    <div class="restaurant-view">
        <h1>Restaurants</h1>
        <v-table v-if="restaurants && restaurants.length > 0">
            <thead>
                <tr>
                    <th>Logo</th>
                    <th>Restaurant Name</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="restaurant in restaurants" :key="restaurant.id">
                    <td>
                        <img
                            v-if="getImageUrl(restaurant.img)"
                            :src="getImageUrl(restaurant.img)"
                            alt="Restaurant Logo"
                            class="restaurant-logo"
                        />
                        <span v-else>No image available</span>
                    </td>
                    <td>{{ restaurant.restaurant_name }}</td>
                    <td>{{ restaurant.restaurant_description || 'No description available' }}</td>
                </tr>
            </tbody>
        </v-table>

        <!-- Show a message if no restaurants are available -->
        <p v-else>No restaurants available</p>

        <!-- Show error message if any -->
        <p v-if="errorMessage">{{ errorMessage }}</p>
    </div>
</template>

<script src="./RestaurantsView.ts" />

<style scoped src="./RestaurantsView.scss" />
