<template>
    <div class="restaurant-view">
        <h1>Restaurants</h1>
        <v-btn color="green" @click="openCreateDialog()" prepend-icon="mdi-plus"
            >Add a Restaurant</v-btn
        >
        <v-table v-if="restaurants && restaurants.length > 0">
            <thead>
                <tr>
                    <th>Logo</th>
                    <th>Restaurant Name</th>
                    <th>Description</th>
                    <th>Signature Sauce</th>
                    <th>Type of Chicken</th>
                    <th>Edit Restaurant</th>
                    <th>Delete Restaurant</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="restaurant in restaurants" :key="restaurant.id">
                    <td>
                        <img :src="restaurant.file" alt="Restaurant Logo" class="restaurant-logo" />
                    </td>
                    <td>{{ restaurant.restaurant_name }}</td>
                    <td>{{ restaurant.restaurant_description || 'No description available' }}</td>
                    <td>
                        {{ restaurant.sauce ? restaurant.sauce.sauce_name : 'No sauce selected' }}
                    </td>
                    <td>
                        {{
                            restaurant.chicken_type
                                ? restaurant.chicken_type.chicken_type_name
                                : 'No chicken type specified'
                        }}
                    </td>
                    <td>
                        <v-btn
                            @click="openEditRestaurantDialog(restaurant)"
                            color="pink"
                            icon="mdi-pencil"
                            size="small"
                        >
                        </v-btn>
                    </td>
                    <td>
                        <v-btn
                            @click="openDeleteRestaurantDialog(restaurant)"
                            color="red"
                            icon="mdi-delete"
                            size="small"
                        >
                        </v-btn>
                    </td>
                </tr>
            </tbody>
        </v-table>

        <!-- Show a message if no restaurants are available -->
        <p v-else>No restaurants available</p>

        <!-- Show error message if any -->
        <p v-if="errorMessage">{{ errorMessage }}</p>
    </div>

    <v-dialog v-model="createRestaurantDialog">
        <v-card>
            <v-card-title>
                <h5>Add a New Restaurant</h5>
            </v-card-title>
            <v-card-text>
                <v-container>
                    <v-row>
                        <v-col>
                            <v-text-field
                                v-model="newRestaurant.restaurant_name"
                                label="Restaurant Name*"
                                required
                            ></v-text-field>
                        </v-col>
                        <v-col>
                            <v-text-field
                                v-model="newRestaurant.restaurant_description"
                                label="Restaurant Description"
                                required
                            ></v-text-field>
                        </v-col>
                        <v-col>
                            <v-select
                                v-model="newRestaurant.chicken_type_id"
                                :items="chickenTypes"
                                item-title="chicken_type_name"
                                item-value="id"
                                label="Type of Chicken"
                                required
                            ></v-select>
                        </v-col>
                        <v-col>
                            <v-text-field
                                v-model="newRestaurant.sauce_name"
                                label="Signature Sauce Name"
                            ></v-text-field>
                        </v-col>
                        <v-col>
                            <v-file-input
                                accept="image/*"
                                @change="onNewRestaurantFileChange"
                                label="Restaurant Logo*"
                            ></v-file-input>
                        </v-col>
                    </v-row>
                </v-container>
                <small>* indicates a required field </small>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue-darken-1" variant="text" @click="closeCreateDialog()"
                    >Close</v-btn
                >
                <v-btn color="blue-darken-1" variant="text" @click="createRestaurant()"
                    >Add Restaurant</v-btn
                >
            </v-card-actions>
        </v-card>
    </v-dialog>

    <v-dialog v-model="editRestaurantDialog">
        <v-card>
            <v-card-title>
                <h5>Edit {{ editRestaurant.restaurant_name }}</h5>
            </v-card-title>
            <v-card-text>
                <v-container>
                    <v-row>
                        <v-col>
                            <v-text-field
                                v-model="editRestaurant.restaurant_name"
                                label="Restaurant Name*"
                                required
                            ></v-text-field>
                        </v-col>
                        <v-col>
                            <v-text-field
                                v-model="editRestaurant.restaurant_description"
                                label="Restaurant Description"
                                required
                            ></v-text-field>
                        </v-col>
                        <v-col>
                            <v-select
                                v-model="editRestaurant.chicken_type_id"
                                :items="chickenTypes"
                                item-title="chicken_type_name"
                                item-value="id"
                                label="Type of Chicken"
                                required
                            ></v-select>
                        </v-col>
                        <v-col>
                            <v-text-field
                                v-model="editRestaurant.sauce_name"
                                label="Signature Sauce Name"
                            ></v-text-field>
                        </v-col>
                        <v-col>
                            <div v-if="editFileChangeDialogBtn">
                                <v-file-input
                                    accept="image/*"
                                    @change="onExistingRestaurantPictureChange"
                                    label="Restaurant Logo*"
                                ></v-file-input>
                                <v-btn @click="editFileChangeDialogBtn = false"
                                    >Cancel File Change</v-btn
                                >
                            </div>

                            <v-btn v-else @click="editFileChangeDialogBtn = true"
                                >Change File</v-btn
                            >
                        </v-col>
                    </v-row>
                </v-container>
                <small> * Indicates required field</small>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue-darken-1" variant="text" @click="editRestaurantDialog = false"
                    >Close</v-btn
                >

                <v-btn color="blue-darken-1" variant="text" @click="updateRestaurant()"
                    >Save Changes</v-btn
                >
            </v-card-actions>
        </v-card>
    </v-dialog>

    <v-dialog v-model="deleteRestaurantDialog">
        <v-card>
            <v-card-text>
                Are you sure you wish to delete this restaurant? This can not be undone!
            </v-card-text>
            <v-card-actions>
                <v-btn color="red" @click="deleteRestaurantDialog = null">No</v-btn>
                <v-btn color="green" @click="deleteRestaurant()">Yes</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script src="./RestaurantsView.ts" />

<style scoped src="./RestaurantsView.scss" />
