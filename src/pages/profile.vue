<template>
    <div>
        <v-card>
            <v-card-title class="primary white--text"> 
              Profile
            </v-card-title>
            <v-spacer></v-spacer>

            <v-card-text>
              You can change the data (name, username, and password) for authentication here. Please insert data!
            </v-card-text>
            
            <v-form ref="form" @submit.prevent="handleSubmit" class="pa-4">
              <v-row>
                <v-col cols="12">
                  <v-text-field 
                    v-model="req.name"
                    label="Name"
                    :rules="[
                      v => !!v || 'name must be filled',
                      v => !(v.length > 50) || 'name maximal is 50 character'
                    ]"
                    required
                  >
                  </v-text-field>
                </v-col>

                <v-col cols="12" lg="6">
                  <v-text-field
                    v-model="req.username"
                    label="Username"
                    :rules="[
                      v => !!v || 'username must be filled',
                      v => !(v.length < 5) || 'username minimal is 5 character',
                      v => !(v.length > 20) || 'username maximal is 20 character',
                    ]"
                    required
                  >

                  </v-text-field>
                </v-col>

                <v-col cols="12" lg="6">
                  <v-text-field
                    v-model="req.password"
                    label="Password"
                    :rules="[
                      v => !!v || 'password must be filled',
                      v => !(v.length < 5) || 'password minimal is 8 character',
                      v => !(v.length > 20) || 'password maximal is 16 character',
                    ]"
                    :type="showPassword ? 'text' : 'password'"
                    required
                  >
                  </v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-switch v-model="showPassword" label="Show Password"></v-switch>
                </v-col>

                <v-col cols="12" align="right">
                  <v-btn type="submit" color="primary">Save</v-btn>
                </v-col>
              </v-row>
            </v-form>
        </v-card>
    </div>
</template>

<script>
import supabase from '@/plugins/supabase.js'

export default {
    data() {
      return {
        req: {
          username: '',
          password: '',
          name: ''
        },
        showPassword: false,
        userId: ''
      }
    },
    created() {
      this.userId = sessionStorage.getItem('activity-user-id')
      this.get()
    },
    methods: {
      get() {
        (async () => {
          const userId = this.userId

          const { data, error } = await supabase.from('users').select('*').range(0, 1).eq('id', userId)

          this.req = data[0]
        })()
      },
      handleSubmit() {
        if (this.$refs.form.validate()) {
          (async () => {
            const { data, error } = await supabase.from('users').update(this.req).eq('id', this.userId)
  
            if (error) {
              this.$root.$refs.notif(true, error.message)
            } else {
              this.$root.$refs.notif(false, 'account successfully edited')
              this.get()
            }
          })()
        }
      }
    }
}
</script>
