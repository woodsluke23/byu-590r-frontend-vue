export default {
    name: 'LoginView',
    emits: ['authenticate'],
    data: function () {
        return {
            isAuthenticated: false,
            alertType: 'error',
            errorMsg: '',
            password: '',
            email: '',
            dialog: false,
            isLoading: false,
            emailRules: [
                (value) => !!value || 'Required.',
                (value) => (value && value.length > 3) || 'Min 3 Characters',
            ],
            passwordRules: [
                (value) => !!value || 'Required.',
                (value) => (value && value.length >= 10) || 'Min 10 Characters',
            ],
            isFormValid: false,
            hardCodedEmail: 'woodsluke23@gmail.com',
            hardCodedPassword: 'happy123456',
        }
    },
    methods: {
        submitLogin() {
            if (!this.isFormValid) {
                return
            }

            this.errorMsg = ''
            if (this.hardCodedPassword === this.password && this.hardCodedEmail === this.email) {
                this.alertType = 'success'
                this.errorMsg = 'Login Success. Redirecting'
                this.isLoading = true
                setTimeout(() => {
                    this.isAuthenticated = true
                    this.$emit('authenticate', this.isAuthenticated)
                }, 1000)
            } else if (this.email === this.password) {
                this.alertType = 'warning'
                this.errorMsg = 'Your username and Password can not be the same!'
            } else {
                this.alertType = 'error'
                this.errorMsg = 'Login Failed! Can not Authenticate'
            }
        },
        forgotPassword() {
            console.log('here')
        },
    },
}
