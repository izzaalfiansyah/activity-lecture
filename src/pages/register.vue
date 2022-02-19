<template>
    <v-row justify="center" align="center" class="h-100">
        <v-col cols="12" md="5">
            <v-card class="pa-10 elevation-6">
                <h2>Register</h2>
                <div class="grey--text">Fill your data to register an account</div>

                <v-form ref="form" class="my-10" @submit.prevent="handleSubmit">
                    <v-text-field 
                        v-model="req.name" 
                        :rules="textRules('name')"
                        label="Name"
                        filled
                        required
                    ></v-text-field>

                    <v-text-field 
                        v-model="req.username" 
                        :rules="textRules('username')"
                        label="Username"
                        filled
                        required
                    ></v-text-field>

                    <v-divider>Password</v-divider>

                    <v-text-field
                        v-model="req.password"
                        :rules="textRules('password')"
                        label="Password"
                        type="password"
                        filled
                        required
                    >
                    </v-text-field>
                    
                    <v-text-field 
                        v-model="req.password_confirm" 
                        :rules="[
                            v => !!v || 'password confirmation must be filled',
                            v => !!(v == req.password) || 'password confirmation must same with password'
                        ]"
                        label="Password Confirmation"
                        type="password"
                        filled
                        required
                    ></v-text-field>

                    <center class="mb-4">
                        have an account? login <router-link to="/login">here</router-link>
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
                req: {},
                result: ''
            }
        },
        methods: {
            textRules(text) {
                return [
                    v => !!v || `${text} must be filled`
                ]
            },
            handleSubmit() {
                if (this.$refs.form.validate()) {
                    (async () => {
                        const { data: user, error: userError } = await supabase.from('users').select('*').eq('username', this.req.username)
    
                        if (user.length) {
                            this.$root.$refs.notif(true, 'username is unavailable')
                        } else {
                            const { data, error } = await supabase.from('users').insert([{
                                username: this.req.username,
                                password: this.req.password,
                                name: this.req.name
                            }])
            
                            if (error) {
                                this.$root.$refs.notif(true, error.message)
                            } else {
                                this.$root.$refs.notif(false, 'account registration successfully, you will automically logged in')
                                const item = data[0]
                                sessionStorage.setItem('activity-user-id', item.id)
        
                                window.location = '/'
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