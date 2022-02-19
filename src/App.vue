<template>
    <v-app>
        <dashboard v-if="loggedIn" :userId="userId" />
        <auth v-else />

        <v-snackbar v-model="snackbar.open" :timeout="2000" :color="snackbar.color" dark>
            {{ snackbar.text }}

            <template v-slot:action="{ attrs }">
                <v-btn color="white" text v-bind="attrs" @click="snackbar.open = false"> Close </v-btn>
            </template>
        </v-snackbar>
    </v-app>
</template>

<script>
    import Dashboard from '@/components/Dashboard.vue';
    import Auth from '@/components/Auth.vue';

    export default {
        data() {
            return {
                userId: undefined,
                loggedIn: false,
				snackbar: {
					open: false,
					text: '',
					color: 'primary'
				}
            };
        },
        created() {
            this.authentication();
            this.$root.$refs.timezoneID = this.timezoneID;
            this.$root.$refs.getDate = this.getDate;
			this.$root.$refs.notif = this.notif;
        },
        components: {
            Dashboard,
            Auth,
        },
        methods: {
            authentication() {
                const id = sessionStorage.getItem('activity-user-id');
                if (id) {
                    this.userId = id;
                    this.loggedIn = true;
                }
            },
            timezoneID(datetimes) {
                const datetime = datetimes.split('-');
                const time = datetime[2].slice(3);

                const date = new Date(Date.UTC(datetime[0], parseInt(datetime[1]) - 1, datetime[2].slice(0, 2)));
                const result = date.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) + ' ' + time.slice(0, 5) + ' WIB';

                return result;
            },
            getDate() {
                const date = new Date();

                var date_string = date.getFullYear();
                date_string += '-' + ((date.getMonth() + 1).toString().length > 1 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1));
                date_string += '-' + (date.getDate().toString().length > 1 ? date.getDate() : '0' + date.getDate());

                return date_string;
            },
			notif(error, text) {
				this.snackbar = {
					open: true,
					text: text,
					color: error ? 'red' : 'green'
				}
			}
        },
    };
</script>
