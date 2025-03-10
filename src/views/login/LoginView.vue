<template>
    <div class="login-page-content">
        <div class="login-box">
            <h1>Welcome, Please Login!</h1>
            <div class="input-container">
                <v-form v-model="isFormValid">
                    <div class="input-container">
                        <v-text-field
                            v-model="email"
                            label="Email"
                            :rules="emailRules"
                            hide-details="auto"
                        ></v-text-field>

                        <v-text-field
                            v-model="password"
                            label="Password"
                            type="password"
                            :rules="passwordRules"
                            hide-details="auto"
                            @keyup.enter="submitLogin()"
                        ></v-text-field>

                        <v-alert v-if="errorMsg !== ''" :type="alertType" @click="errorMsg = ''">
                            {{ errorMsg }}
                        </v-alert>
                    </div>
                </v-form>

                <div class="button-container">
                    <v-btn
                        v-if="!isAuthenticated"
                        :loading="isLoading"
                        :disable="!isFormValid"
                        @click="submitLogin()"
                    >
                        Login Here
                    </v-btn>
                    <!-- This is where the forgot user logic is-->
                    <v-btn @click="forgotpassworddialog = true">Forgot Password </v-btn>
                    <v-dialog
                        v-model="forgotpassworddialog"
                        :scrim="true"
                        persistent
                        class="popout"
                    >
                        <v-card>
                            <v-card-text>
                                <v-text-field
                                    v-model="email"
                                    label="Password Reset Email"
                                    :rules="emailRules"
                                    hide-details="auto"
                                ></v-text-field>
                            </v-card-text>
                            <v-card-actions>
                                <v-btn variant="text" @click="forgotpassworddialog = false">
                                    Close
                                </v-btn>
                                <v-btn variant="text"> Submit </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                    <!-- This is where the register logic is -->
                    <v-btn @click="registerdialog = true"> Register </v-btn>
                    <v-dialog v-model="registerdialog" persisten class="popout" t>
                        <v-form v-model="isRegisterFormValid">
                            <v-card>
                                <v-card-text>
                                    <v-text-field
                                        label="Full name"
                                        v-model="register.name"
                                        :rules="registerRules.name"
                                    ></v-text-field>
                                </v-card-text>
                                <v-card-text>
                                    <v-text-field
                                        label="Email"
                                        v-model="register.email"
                                        :rules="registerRules.email"
                                    ></v-text-field>
                                </v-card-text>
                                <v-card-text>
                                    <v-text-field
                                        label="Password"
                                        type="password"
                                        v-model="register.password"
                                        :rules="registerRules.password"
                                    ></v-text-field>
                                </v-card-text>
                                <v-card-text>
                                    <v-text-field
                                        label="Confirm Password"
                                        type="password"
                                        v-model="register.c_password"
                                        :rules="registerRules.c_password"
                                    ></v-text-field>
                                </v-card-text>
                                <v-card-actions>
                                    <v-btn variant="text" @click="registerdialog = false">
                                        Close
                                    </v-btn>
                                    <v-btn
                                        variant="text"
                                        :disable="!isRegisterFormValid"
                                        :loading="registerFormIsLoading"
                                        @click="submitRegister()"
                                    >
                                        Submit
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-form>
                    </v-dialog>
                </div>
            </div>
        </div>
    </div>
</template>
<script src="./LoginView.ts" />

<style src="./LoginView.scss" />
