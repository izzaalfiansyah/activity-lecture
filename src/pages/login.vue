<template>
    <v-row justify="center" align="center" class="h-100">
        <v-col cols="12" md="4">
            <v-card class="pa-10 elevation-6">
                <h2>Login</h2>
                <div class="grey--text">Insert username and password for entering app</div>

                <v-form ref="login" class="my-10" @submit.prevent="login">
                    <v-text-field 
                        v-model="req.username" 
                        :rules="textRules('username')"
                        label="Username"
                        filled
                        required
                    ></v-text-field>

                    <v-text-field
                        v-model="req.password"
                        :rules="textRules('password')"
                        label="Password"
                        type="password"
                        filled
                        required
                    >
                    </v-text-field>

                    <center class="mb-4">
                        Don't have account? register <router-link to="/register">here</router-link>
                    </center>

                    <v-btn type="submit" block color="primary">Submit</v-btn>
                </v-form>
            </v-card>
        </v-col>
    </v-row>
</template>

<script>
    import supabase from '@/plugins/supabase.js'

    export default {
        layout: 'default',
        data() {
            return {
                req: {}
            }
        },
        methods: {
            textRules(text) {
                return [
                    v => !!v || `${text} must be filled`
                ]
            },
            login() {
                if (this.$refs.login.validate()) {
                    (async () => {
                        const { data, error } = await supabase.from('users').select('*').range(0, 1).eq('username', this.req.username).eq('password', this.req.password)
    
                        const item = data[0]
    
                        if (error) {
                            this.$root.$refs.notif(true, error.message)
                        } else {
                            if (item) {
                                this.$root.$refs.notif(false, 'login successfully')
                                sessionStorage.setItem('activity-user-id', item.id)
        
                                window.location = '/'
                            } else {
                                this.$root.$refs.notif(true, 'username or password is wrong, please check again')
                            }
                        }
                    })()
                }
            }
        }
    }
</script>

<style>
    .h-100 {
        height: 100%;
    }
</style>