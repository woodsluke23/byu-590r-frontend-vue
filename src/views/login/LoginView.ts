export default {
    name: 'LoginView',
    emits: ['authenticate'],
    data: function () {
        return {
            isAuthenticated: false,
            alertType: 'error',
            errorMsg: '',
            password: '',
            c_password: '',
            email: '',
            forgotEmail: '',
            submitForgotPasswordLoading: false,
            name: '',
            forgotpassworddialog: false,
            registerdialog: false,
            isLoading: false,
            isFormValid: false,
            isRegisterFormValid: false,
            registerFormIsLoading: false,
            register: {
                name: '',
                email: '',
                password: '',
                c_password: '',
            },
            registerRules: {
                name: [(v) => !!v || 'Name is required'],
                email: [
                    (v) => !!v || 'Email is required',
                    (v) => (v && v.length > 3) || 'Min 3 Characters', // Same as emailRules
                ],
                password: [
                    (v) => !!v || 'Password is required',
                    (v) => (v && v.length >= 10) || 'Min 10 Characters', // Same as passwordRules
                ],
                c_password: [
                    (v) => !!v || 'Password confirmation is required',
                    (v) => (v && v.length >= 10) || 'Min 10 Characters', // Same as passwordRules
                    (v) => v === this.register.password || 'Passwords must match', // Check if passwords match
                ],
            },
            emailRules: [
                (value) => !!value || 'Required.',
                (value) => (value && value.length > 3) || 'Min 3 Characters',
            ],
            passwordRules: [
                (value) => !!value || 'Required.',
                (value) => (value && value.length >= 10) || 'Min 10 Characters',
            ],
        }
    },
    methods: {
        submitLogin() {
            if (!this.isFormValid) {
                return
            }
            const user = {
                email: this.email,
                password: this.password,
            }
            this.errorMsg = ''
            this.isLoading = true
            this.$store.dispatch('auth/login', user).then(
                (response) => {
                    const token = response.data.token // Assuming 'response' contains token
                    if (token) {
                        localStorage.setItem('userToken', token) // Store token in localStorage
                        this.isAuthenticated = true
                        this.$emit('authenticate', this.isAuthenticated)

                        window.location.href = 'http://52.6.178.78:4444/'

                        alert('Login successful!')
                    }
                },
                (error) => {
                    this.isLoading = false
                    this.errorMsg =
                        (error.response && error.response.data && error.response.data.message) ||
                        error.message ||
                        error.toString()
                }
            )
        },
        forgotPassword() {
            console.log('here')
        },
        submitRegister() {
            if (!this.isRegisterFormValid) {
                return
            }

            const register = {
                name: this.register.name,
                email: this.register.email,
                password: this.register.password,
                c_password: this.register.c_password,
            }

            this.registerFormIsLoading = true
            this.$store.dispatch('auth/register', register).then(
                () => {
                    alert('success!')
                    this.registerFormIsLoading = false
                    this.registerdialog = false
                },
                (error) => {
                    this.registerFormIsLoading = false
                    alert('error!')
                }
            )
        },
    },
}
