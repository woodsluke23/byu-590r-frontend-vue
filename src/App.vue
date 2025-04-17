<script lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import LoginView from './views/login/LoginView.vue'
import { mapState } from 'vuex'

export default {
    name: 'App',
    components: {
        LoginView,
        RouterLink,
        RouterView,
    },
    data() {
        return {
            profileDialog: false,
            profileIsUploading: false,
            verificationEmailLoading: false,
            showEmailNotVerifiedDialog: false,
            showChangeEmailTextField: false,
            changeEmail: false,
            successVerificationMessage: '',
            changeEmailRules: [
                (value) => !!value || 'Required.',
                (value) => (value && value.length >= 3) || 'Min 3 characters',
            ],
            profile: {
                avatar: '',
                name: '',
                title: '',
                icon: 'mdi-account-circle',
                color: 'info',
            },
            profilePictureImage: '',
            emailOfVerification: '',
        }
    },
    computed: {
        ...mapState({
            user() {
                return this.$store.state.user.user
            },
            auth() {
                return this.$store.state.auth
            },
            authUser() {
                return this.auth.user
            },
            isAuthenticated() {
                return this.auth.status.loggedIn && this.authUser.token !== undefined
            },
            title() {
                return 'Welcome ' + this.authUser.name + '!'
            },
            avatarURL() {
                return this.user.avatar || ''
            },
            profilePictureChangeLabel() {
                return 'Profile picture change'
            },
        }),
    },
    created() {
        if (this.isAuthenticated) {
            this.$router.push('/restaurants')
        }
    },
    methods: {
        logout() {
            this.$store.dispatch('auth/logout')
            this.isAuthenticated = false
        },
        checkAuth(auth) {
            console.log('Authenticated!', auth)
            this.isAuthenticated = auth
        },
        onAvatarChange(e) {
            var image = e.target.files || e.dataTransfer.files
            if (!image.length) return
            this.profileIsUploading = true

            this.$store
                .dispatch('user/uploadAvatar', image[0])
                .then((response) => {
                    this.$store.commit('user/setAvatar', response.avatar) // Commit to 'user'
                    this.profileIsUploading = false
                })
                .catch((error) => {
                    console.log(error)
                    alert('Error. Try again')
                    this.profileIsUploading = false
                })
        },
        removeAvatar() {
            this.profileIsUploading = true

            this.$store
                .dispatch('user/removeAvatar')
                .then(() => {
                    this.$store.commit('user/setAvatar', '') // Reset avatar
                    this.profileIsUploading = false
                })
                .catch((error) => {
                    console.log(error)
                    alert('Error. Try again')
                    this.profileIsUploading = false
                })
        },
        getCurrentUser() {
            this.profile.name = this.authUser.name

            this.profile.title = this.title
            this.$store
                .dispatch('user/getUser')
                .then((response) => {
                    if (response.avatar) {
                        this.$store.commit('user/setAvatar', response.avatar) // Commit avatar
                    }
                    if (!response.email_verified_at) {
                        this.showEmailNotVerifiedDialog = true
                    }
                })
                .catch((error) => {
                    this.logout()
                })
        },
    },
}
</script>

<template>
    <v-app>
        <v-app-bar v-if="isAuthenticated" elevation="1">
            <v-app-bar-title>Chicken Restaurants</v-app-bar-title>

            <v-spacer></v-spacer>

            <v-btn to="/restaurants" variant="text">Restaurants</v-btn>
            <v-btn to="about" variant="text"> About </v-btn>

            <v-menu location="bottom end" transition="slide-y-transition">
                <template v-slot:activator="{ props }">
                    <v-btn icon class="ml-2" v-bind="props">
                        <v-avatar color="brown" size="38">
                            <v-img v-if="avatarURL" alt="Avatar" :src="avatarURL" cover></v-img>
                            <v-icon v-else :color="profile.color" :icon="profile.icon"></v-icon>
                        </v-avatar>
                    </v-btn>
                </template>
                <v-card min-width="200">
                    <v-card-text class="pa-4">
                        <div class="d-flex flex-column align-center mb-4">
                            <v-avatar color="brown" size="64" class="mb-2">
                                <v-img v-if="avatarURL" alt="Avatar" :src="avatarURL" cover></v-img>
                                <v-icon
                                    v-else
                                    :color="profile.color"
                                    :icon="profile.icon"
                                    size="36"
                                ></v-icon>
                            </v-avatar>
                            <h3 class="text-h6 font-weight-medium mb-0">{{ profile.name }}</h3>
                        </div>

                        <v-divider class="mb-3"></v-divider>

                        <div class="d-flex flex-column">
                            <v-btn
                                variant="text"
                                @click="profileDialog = true"
                                prepend-icon="mdi-account-edit"
                                block
                                class="justify-start mb-2"
                            >
                                Profile
                            </v-btn>
                            <v-btn
                                variant="text"
                                color="error"
                                @click="logout()"
                                prepend-icon="mdi-logout"
                                block
                                class="justify-start"
                            >
                                Logout
                            </v-btn>
                        </div>
                    </v-card-text>
                </v-card>
            </v-menu>
        </v-app-bar>

        <v-main>
            <!-- Remove the fixed height container that's causing scroll issues -->
            <div v-if="isAuthenticated" class="main-content">
                <RouterView />
            </div>
            <LoginView
                v-else
                :is-authenticated="isAuthenticated"
                @authenticate="checkAuth($event)"
            />

            <!-- Profile Dialog -->
            <v-dialog v-model="profileDialog" max-width="500px">
                <v-card>
                    <v-card-title class="pb-2">
                        <h3 class="text-h5">My Profile</h3>
                    </v-card-title>
                    <v-card-subtitle class="pb-4">Manage your profile information</v-card-subtitle>

                    <v-divider></v-divider>

                    <v-card-text class="pt-4">
                        <div class="d-flex flex-column align-center mb-6">
                            <v-avatar color="brown" size="120" class="mb-4">
                                <v-img v-if="avatarURL" :src="avatarURL" cover></v-img>
                                <v-icon
                                    v-else
                                    :color="profile.color"
                                    :icon="profile.icon"
                                    size="64"
                                ></v-icon>
                            </v-avatar>

                            <div class="d-flex">
                                <v-file-input
                                    accept="image/*"
                                    :loading="profileIsUploading"
                                    :disabled="profileIsUploading"
                                    @change="onAvatarChange"
                                    :label="profilePictureChangeLabel"
                                    variant="outlined"
                                    density="comfortable"
                                    hide-details
                                    class="mr-2"
                                ></v-file-input>

                                <v-btn
                                    @click="removeAvatar"
                                    :disabled="profileIsUploading || !avatarURL"
                                    variant="outlined"
                                    color="error"
                                    icon="mdi-delete"
                                    class="mt-1"
                                ></v-btn>
                            </div>
                        </div>

                        <v-text-field
                            v-model="profile.name"
                            label="Name"
                            variant="outlined"
                            readonly
                            class="mb-4"
                        ></v-text-field>
                    </v-card-text>

                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="primary" variant="text" @click="profileDialog = false"
                            >Close</v-btn
                        >
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-main>
    </v-app>
</template>

<style>
.main-content {
    height: 100%;
    width: 100%;
}
</style>
