<template>
    <div>
        <v-navigation-drawer app class="elevation-2" v-model="sidebar.open">
            <template v-slot:prepend>
                <v-list-item two-line class="py-1">
                    <v-list-item-avatar>
                        <img src="https://jenepontokab.go.id/images/user.png" />
                    </v-list-item-avatar>

                    <v-list-item-content>
                        <v-list-item-title>{{ user.username }}</v-list-item-title>
                        <v-list-item-subtitle class="text-xs">{{ user.name }}</v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
            </template>

            <v-divider></v-divider>

            <v-list dense>
                <v-subheader>MAIN MENU</v-subheader>
                <v-list-item-group v-model="sidebar.selectedItem" color="primary">
                    <v-list-item v-for="(item, i) in sidebar.items" :key="i" @click="handlePage(item.path)">
                        <v-list-item-icon>
                            <v-icon v-text="item.icon"></v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title v-text="item.title"></v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list-item-group>
            </v-list>
        </v-navigation-drawer>

        <v-app-bar color="primary accent-4" dark app>
            <v-app-bar-nav-icon @click="toggleSidebar"></v-app-bar-nav-icon>

            <v-toolbar-title>TASK APP</v-toolbar-title>

            <v-spacer></v-spacer>

            <v-menu left bottom>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn icon v-bind="attrs" v-on="on">
                        <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                </template>

                <v-list>
                    <v-list-item @click="$router.push('/profile')">
                        <v-list-item-title>Profile</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="logoutOpen = true">
                        <v-list-item-title>Logout</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
        </v-app-bar>

        <v-main class="grey lighten-5">
            <v-container fluid>
                <router-view></router-view>
            </v-container>
        </v-main>

        <v-dialog
            v-model="logoutOpen"
            width="500"
        >
            <v-card>
                <v-card-title class="text-h5">
                Logout
                </v-card-title>

                <v-card-text>
                    Are you sure to logout? Your session will finished!
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        color="grey"
                        text
                        @click="logoutOpen = false"
                    >
                        Cancel
                    </v-btn>
                    <v-btn
                        color="red"
                        text
                        @click="logout"
                    >
                        Ok
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    import supabase from '@/plugins/supabase.js'

    export default {
        props: {
            userId: [String, undefined]
        },
        data() {
            return {
                sidebar: {
                    open: true,
                    selectedItem: 0,
                    items: [
                        { title: 'Home', icon: 'mdi-home-city', path: '/' },
                        { title: 'Task', icon: 'mdi-table', path: '/task' },
                        { title: 'Profile', icon: 'mdi-cog', path: '/profile' },
                        { title: 'Logout', icon: 'mdi-logout', path: 'logout' }
                    ]
                },
                logoutOpen: false,
                darkMode: false,
                user: {}
            }
        },
        created() {
            this.authentication()
        },
        methods: {
            toggleSidebar() {
                this.sidebar.open = !this.sidebar.open
            },
            handlePage(path) {
                if (path == 'logout') {
                    this.logoutOpen = true;
                } else {
                    this.$router.push(path)
                }
            },
            authentication() {
                (async () => {
                    const { data, error } = await supabase.from('users').select('*').range(0,1).eq('id', this.userId)
                    this.user = data[0]

                    if (!this.user) {
                        window.location = '/login'
                    }
                })()
            },
            logout() {
                sessionStorage.removeItem('activity-user-id')
                window.location = '/'
            }
        }
    }
</script>
