<template>
    <div class="restaurant-view">
        <!-- Header Section with Title and Add Button -->
        <div class="action-bar">
            <h1>Restaurants</h1>
            <v-btn
                color="success"
                @click="openCreateDialog()"
                prepend-icon="mdi-plus"
                class="add-restaurant-btn"
                >Add a Restaurant</v-btn
            >
        </div>

        <!-- Restaurant Table -->
        <div class="table-container">
            <v-table v-if="restaurants && restaurants.length > 0">
                <thead>
                    <tr>
                        <th>Logo</th>
                        <th>Restaurant Name</th>
                        <th>Description</th>
                        <th>Signature Sauce</th>
                        <th>Type of Chicken</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="restaurant in restaurants" :key="restaurant.id">
                        <td>
                            <v-avatar size="80">
                                <v-img
                                    :src="restaurant.file"
                                    alt="Restaurant Logo"
                                    class="restaurant-logo"
                                    contain
                                ></v-img>
                            </v-avatar>
                        </td>
                        <td>
                            <strong>{{ restaurant.restaurant_name }}</strong>
                        </td>
                        <td>
                            {{ restaurant.restaurant_description || 'No description available' }}
                        </td>
                        <td>
                            <v-chip color="amber-lighten-2" v-if="restaurant.sauce">
                                {{ restaurant.sauce.sauce_name }}
                            </v-chip>
                            <span v-else class="text-grey">No sauce selected</span>
                        </td>
                        <td>
                            <v-chip color="blue-lighten-4" v-if="restaurant.chicken_type">
                                {{ restaurant.chicken_type.chicken_type_name }}
                            </v-chip>
                            <span v-else class="text-grey">No chicken type specified</span>
                        </td>
                        <td>
                            <div class="d-flex">
                                <v-btn
                                    @click="openEditRestaurantDialog(restaurant)"
                                    color="primary"
                                    icon="mdi-pencil"
                                    size="small"
                                    class="action-btn"
                                    variant="text"
                                >
                                </v-btn>
                                <v-btn
                                    @click="openDeleteRestaurantDialog(restaurant)"
                                    color="error"
                                    icon="mdi-delete"
                                    size="small"
                                    class="action-btn"
                                    variant="text"
                                >
                                </v-btn>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </v-table>

            <!-- Show a message if no restaurants are available -->
            <div v-else class="no-restaurants">
                <v-icon icon="mdi-food-turkey" size="64" color="grey-lighten-1"></v-icon>
                <h3 class="mt-4">No restaurants available</h3>
                <p class="text-grey">Add your first chicken restaurant to get started!</p>
            </div>
        </div>

        <!-- Show error message if any -->
        <v-alert v-if="errorMessage" type="error" class="mt-3">
            {{ errorMessage }}
        </v-alert>

        <!-- Create Restaurant Dialog -->
        <v-dialog v-model="createRestaurantDialog" max-width="800px">
            <v-card>
                <v-card-title>
                    <h5>Add a New Restaurant</h5>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col cols="12" md="6">
                                <v-text-field
                                    v-model="newRestaurant.restaurant_name"
                                    label="Restaurant Name*"
                                    required
                                    variant="outlined"
                                    :error-messages="errors.restaurant_name"
                                    @input="errors.restaurant_name = ''"
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-select
                                    v-model="newRestaurant.chicken_type_id"
                                    :items="chickenTypes"
                                    item-title="chicken_type_name"
                                    item-value="id"
                                    label="Type of Chicken*"
                                    required
                                    variant="outlined"
                                    :error-messages="errors.chicken_type_id"
                                    @change="errors.chicken_type_id = ''"
                                ></v-select>
                            </v-col>
                            <v-col cols="12">
                                <v-textarea
                                    v-model="newRestaurant.restaurant_description"
                                    label="Restaurant Description*"
                                    required
                                    variant="outlined"
                                    rows="3"
                                    :error-messages="errors.restaurant_description"
                                    @input="errors.restaurant_description = ''"
                                ></v-textarea>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field
                                    v-model="newRestaurant.sauce_name"
                                    label="Signature Sauce Name"
                                    variant="outlined"
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-file-input
                                    accept="image/*"
                                    @change="onNewRestaurantFileChange"
                                    label="Restaurant Logo*"
                                    required
                                    variant="outlined"
                                    prepend-icon="mdi-camera"
                                    :error-messages="errors.file"
                                ></v-file-input>
                            </v-col>
                        </v-row>
                    </v-container>
                    <div class="d-flex align-center">
                        <v-icon icon="mdi-information-outline" color="grey" class="mr-2"></v-icon>
                        <small>* indicates a required field</small>
                    </div>
                    <v-alert v-if="newRestaurantErrorMessage" type="error" class="mt-3">
                        {{ newRestaurantErrorMessage }}
                    </v-alert>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        color="grey"
                        variant="text"
                        @click="closeCreateDialog()"
                        :disabled="isCreating"
                        >Cancel</v-btn
                    >
                    <v-btn
                        color="primary"
                        @click="createRestaurant()"
                        :disabled="isCreating || !createFormValid"
                        :loading="isCreating"
                    >
                        Add Restaurant
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Edit Restaurant Dialog -->
        <v-dialog v-model="editRestaurantDialog" max-width="800px">
            <v-card>
                <v-card-title>
                    <h5>Edit {{ editRestaurant.restaurant_name }}</h5>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col cols="12" md="6">
                                <v-text-field
                                    v-model="editRestaurant.restaurant_name"
                                    label="Restaurant Name*"
                                    required
                                    variant="outlined"
                                    :error-messages="editErrors.restaurant_name"
                                    @input="editErrors.restaurant_name = ''"
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-select
                                    v-model="editRestaurant.chicken_type_id"
                                    :items="chickenTypes"
                                    item-title="chicken_type_name"
                                    item-value="id"
                                    label="Type of Chicken*"
                                    required
                                    variant="outlined"
                                    :error-messages="editErrors.chicken_type_id"
                                    @change="editErrors.chicken_type_id = ''"
                                ></v-select>
                            </v-col>
                            <v-col cols="12">
                                <v-textarea
                                    v-model="editRestaurant.restaurant_description"
                                    label="Restaurant Description*"
                                    required
                                    variant="outlined"
                                    rows="3"
                                    :error-messages="editErrors.restaurant_description"
                                    @input="editErrors.restaurant_description = ''"
                                ></v-textarea>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field
                                    v-model="editRestaurant.sauce_name"
                                    label="Signature Sauce Name"
                                    variant="outlined"
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <div v-if="editFileChangeDialogBtn">
                                    <v-file-input
                                        accept="image/*"
                                        @change="onExistingRestaurantPictureChange"
                                        label="Restaurant Logo*"
                                        required
                                        variant="outlined"
                                        prepend-icon="mdi-camera"
                                        :error-messages="editErrors.file"
                                    ></v-file-input>
                                    <v-btn
                                        @click="editFileChangeDialogBtn = false"
                                        :disabled="isPictureUpdating"
                                        variant="text"
                                        size="small"
                                        color="grey"
                                        class="mt-1"
                                        >Cancel</v-btn
                                    >
                                </div>
                                <div v-else class="d-flex align-center">
                                    <v-img
                                        :src="editRestaurant.file"
                                        width="60"
                                        height="60"
                                        class="mr-3"
                                        contain
                                    ></v-img>
                                    <v-btn
                                        @click="editFileChangeDialogBtn = true"
                                        :disabled="isPictureUpdating"
                                        variant="outlined"
                                        color="primary"
                                        prepend-icon="mdi-image-edit"
                                        >Change Logo</v-btn
                                    >
                                </div>
                            </v-col>
                        </v-row>
                    </v-container>
                    <div class="d-flex align-center">
                        <v-icon icon="mdi-information-outline" color="grey" class="mr-2"></v-icon>
                        <small>* Indicates required field</small>
                    </div>
                    <v-alert v-if="editRestaurantErrorMessage" type="error" class="mt-3">
                        {{ editRestaurantErrorMessage }}
                    </v-alert>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        color="grey"
                        variant="text"
                        @click="editRestaurantDialog = false"
                        :disabled="isUpdating || isPictureUpdating"
                    >
                        Cancel
                    </v-btn>

                    <v-btn
                        color="primary"
                        @click="updateRestaurant()"
                        :disabled="isUpdating || isPictureUpdating || !editFormValid"
                        :loading="isUpdating || isPictureUpdating"
                    >
                        Save Changes
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Delete Restaurant Dialog -->
        <v-dialog v-model="deleteRestaurantDialog" max-width="400px">
            <v-card>
                <v-card-title class="text-h5">Delete Restaurant</v-card-title>
                <v-card-text>
                    <div class="text-center mb-4">
                        <v-icon icon="mdi-alert-circle" size="64" color="error"></v-icon>
                    </div>
                    <p class="text-center">
                        Are you sure you want to delete
                        <strong>{{
                            deleteRestaurantDialog ? deleteRestaurantDialog.restaurant_name : ''
                        }}</strong
                        >?
                        <br />
                        This action cannot be undone!
                    </p>
                    <v-alert v-if="deleteRestaurantErrorMessage" type="error" class="mt-3">
                        {{ deleteRestaurantErrorMessage }}
                    </v-alert>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        color="grey"
                        variant="text"
                        @click="deleteRestaurantDialog = null"
                        :disabled="isDeleting"
                    >
                        Cancel
                    </v-btn>
                    <v-btn
                        color="error"
                        @click="deleteRestaurant()"
                        :disabled="isDeleting"
                        :loading="isDeleting"
                    >
                        Delete
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script src="./RestaurantsView.ts" />

<style scoped src="./RestaurantsView.scss" />
