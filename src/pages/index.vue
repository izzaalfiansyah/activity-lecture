<template>
    <div>
        <v-card v-if="userId">
            <v-card-title class="primary white--text"> Home </v-card-title>

            <v-spacer></v-spacer>
            <hello-world />
        </v-card>

        <v-container v-else>
            <v-card align="center" class="elevation-10">
                <v-row class="pa-4" align="center">
                    <v-col cols="6">
                        <v-card-title>TASK APP</v-card-title>
                    </v-col>
                    <v-col cols="6" align="right">
                        <v-btn color="primary" @click="$router.push('/login')">Login</v-btn>
                    </v-col>
                </v-row>
            </v-card>
            <div class="mt-4">
                <v-timeline :dense="$vuetify.breakpoint.smAndDown">
                    <v-timeline-item v-for="item in data" :key="item.id" color="red">
                        <span slot="opposite" class="white--text">{{ item.deadline ? $root.$refs.timezoneID(item.deadline) : 'undefined' }}</span>
                        <v-card class="elevation-10">
                            <v-card-title class="text-h5">
                                {{ item.lessons.name }}
                            </v-card-title>
                            <v-card-text>
                                <v-chip class="elevation-2 mb-4" :color="item.team ? 'primary' : 'primary'" x-small>{{ item.team ? 'Group Task' : 'Individual Task' }}</v-chip
                                ><br />
                                {{ item.description }} <br />
                                <span class="red--text text-xs">Deadline: {{ item.deadline ? $root.$refs.timezoneID(item.deadline) : 'undefined' }}</span>
                            </v-card-text>

                            <v-spacer></v-spacer>
                        </v-card>
                    </v-timeline-item>
                </v-timeline>
            </div>
        </v-container>
    </div>
</template>

<script>
    import HelloWorld from '@/components/HelloWorld.vue';
    import supabase from '@/plugins/supabase.js';

    export default {
        layout: 'default',
        data() {
            return {
                data: [],
                userId: sessionStorage.getItem('activity-user-id'),
            };
        },
        created() {
            this.get();
        },
        components: {
            HelloWorld,
        },
        methods: {
            get() {
                (async () => {
                    const date = this.$root.$refs.getDate()
                    const { data, error } = await supabase.from('tasks').select('*, lessons(*)').order('deadline');

                    this.data = []
                    data.forEach(item => {
                        const deadline = item.deadline ? item.deadline.slice(0, 10) :date
                        if (deadline < date) {
                            (async () => {
                                await supabase.from('task_success').delete().match({'task_id': item.id})
                                await supabase.from('tasks').delete().match({'id': item.id})
                                console.log(item.description, 'sukses dihapus')
                            })()
                        } else {
                            this.data.push(item)
                        }
                    })
                })();
            },
        },
    };
</script>
