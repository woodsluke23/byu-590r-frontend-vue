<template>
    <div class="login-page-content">
        <div class="login-box">
            <div class="login-header">
                <v-avatar color="primary" size="64" class="mb-4">
                    <v-icon size="32" icon="mdi-food-drumstick"></v-icon>
                </v-avatar>
                <h1 class="text-h4 font-weight-bold mb-2">Welcome</h1>
                <p class="text-subtitle-1 text-medium-emphasis">Sign in to your account</p>
            </div>

            <v-divider class="mb-6"></v-divider>

            <div class="input-container">
                <v-form v-model="isFormValid">
                    <v-text-field
                        v-model="email"
                        label="Email"
                        :rules="emailRules"
                        variant="outlined"
                        prepend-inner-icon="mdi-email-outline"
                        class="mb-4"
                    ></v-text-field>

                    <v-text-field
                        v-model="password"
                        label="Password"
                        type="password"
                        :rules="passwordRules"
                        variant="outlined"
                        prepend-inner-icon="mdi-lock-outline"
                        @keyup.enter="submitLogin()"
                        class="mb-2"
                    ></v-text-field>

                    <v-alert
                        v-if="errorMsg !== ''"
                        :type="alertType"
                        @click="errorMsg = ''"
                        variant="tonal"
                        closable
                        class="mb-4"
                    >
                        {{ errorMsg }}
                    </v-alert>
                </v-form>

                <div class="button-container">
                    <v-btn
                        v-if="!isAuthenticated"
                        :loading="isLoading"
                        :disabled="!isFormValid"
                        @click="submitLogin()"
                        color="primary"
                        size="large"
                        block
                        class="mb-4"
                    >
                        Sign In
                    </v-btn>

                    <div class="d-flex justify-space-between w-100">
                        <v-btn
                            @click="forgotpassworddialog = true"
                            variant="text"
                            color="primary"
                            density="comfortable"
                        >
                            Forgot Password?
                        </v-btn>

                        <v-btn
                            @click="registerdialog = true"
                            variant="text"
                            color="primary"
                            density="comfortable"
                        >
                            Create Account
                        </v-btn>
                    </div>
                </div>
            </div>
        </div>

        <!-- Forgot Password Dialog -->
        <v-dialog
            v-model="forgotpassworddialog"
            :scrim="true"
            persistent
            max-width="500"
            class="popout"
        >
            <v-card>
                <v-card-title class="text-h5 pa-4"> Reset Password </v-card-title>
                <v-card-subtitle class="px-4 pb-0">
                    Enter your email address and we'll send you a password reset link
                </v-card-subtitle>

                <v-card-text class="pt-4">
                    <v-text-field
                        v-model="email"
                        label="Email Address"
                        :rules="emailRules"
                        variant="outlined"
                        prepend-inner-icon="mdi-email-outline"
                    ></v-text-field>
                </v-card-text>

                <v-card-actions class="pa-4">
                    <v-spacer></v-spacer>
                    <v-btn variant="text" @click="forgotpassworddialog = false"> Cancel </v-btn>
                    <v-btn color="primary" variant="elevated"> Send Reset Link </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Register Dialog -->
        <v-dialog v-model="registerdialog" persistent max-width="600" class="popout">
            <v-card>
                <v-card-title class="text-h5 pa-4"> Create New Account </v-card-title>

                <v-divider></v-divider>

                <v-form v-model="isRegisterFormValid" class="pa-4">
                    <v-row>
                        <v-col cols="12">
                            <v-text-field
                                label="Full Name"
                                v-model="register.name"
                                :rules="registerRules.name"
                                variant="outlined"
                                prepend-inner-icon="mdi-account-outline"
                            ></v-text-field>
                        </v-col>

                        <v-col cols="12">
                            <v-text-field
                                label="Email"
                                v-model="register.email"
                                :rules="registerRules.email"
                                variant="outlined"
                                prepend-inner-icon="mdi-email-outline"
                            ></v-text-field>
                        </v-col>

                        <v-col cols="12" md="6">
                            <v-text-field
                                label="Password"
                                type="password"
                                v-model="register.password"
                                :rules="registerRules.password"
                                variant="outlined"
                                prepend-inner-icon="mdi-lock-outline"
                            ></v-text-field>
                        </v-col>

                        <v-col cols="12" md="6">
                            <v-text-field
                                label="Confirm Password"
                                type="password"
                                v-model="register.c_password"
                                :rules="registerRules.c_password"
                                variant="outlined"
                                prepend-inner-icon="mdi-lock-check-outline"
                            ></v-text-field>
                        </v-col>
                    </v-row>
                </v-form>

                <v-card-actions class="pa-4">
                    <v-spacer></v-spacer>
                    <v-btn variant="text" @click="registerdialog = false"> Cancel </v-btn>
                    <v-btn
                        color="primary"
                        variant="elevated"
                        :disabled="!isRegisterFormValid"
                        :loading="registerFormIsLoading"
                        @click="submitRegister()"
                    >
                        Register
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script src="./LoginView.ts" />

<style src="./LoginView.scss" />
