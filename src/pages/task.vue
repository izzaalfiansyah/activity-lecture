<template>
    <div>
        <v-card class="mt-3 mb-8">
            <v-card-title class="primary white--text">
                Task
            </v-card-title>

            <v-row justify="end" class="pa-4">
                <v-col cols="12" md="6" lg="4">
                    <v-select 
                        v-model="type"
                        label="Type"
                        :items="[
                            {
                                value: '',
                                text: 'All Types'
                            },
                            {
                                value: '1',
                                text: 'Group Task'
                            },
                            {
                                value: '2',
                                text: 'Individual Task'
                            }
                        ]"
                        item-text="text"
                        item-value="value"
                    ></v-select>
                </v-col>
                <v-col cols="12" md="6" lg="4">
                    <v-select 
                        v-model="lesson_id"
                        label="Lesson"
                        :items="lesson"
                        item-text="text"
                        item-value="value"
                    ></v-select>
                </v-col>
                <v-col cols="12" md="6" lg="4">
                    <v-select 
                        v-model="status"
                        label="Status"
                        :items="[
                            {
                                value: '',
                                text: 'All Tasks'
                            },
                            {
                                value: '0',
                                text: 'In Process'
                            },
                            {
                                value: '1',
                                text: 'Finished'
                            }
                        ]"
                        item-text="text"
                        item-value="value"
                    ></v-select>
                </v-col>
            </v-row>
        </v-card>
        <div>
            <v-timeline dense v-if="status == '0' || status == ''">
                <v-timeline-item v-for="item in tasks()" :key="item.id" color="red">
                    <span slot="opposite">Task</span>
                    <v-card class="elevation-2">
                        <v-card-title class="text-h5">
                            {{ item.lessons.name }}
                        </v-card-title>
                        <v-card-text>
                            <v-chip class="elevation-2 mb-4" :color="item.team ? 'primary' : 'primary'" x-small>{{ item.team ? 'Group Task' : 'Individual Task' }}</v-chip><br>
                            {{ item.description }} <br>
                            <span class="red--text text-xs">Deadline: {{ item.deadline ? $root.$refs.timezoneID(item.deadline) : 'undefined' }}</span>
                        </v-card-text>

                        <v-spacer></v-spacer>

                        <div class="pa-4">
                            <v-btn small color="primary" text class="white--text mr-2" @click="() => {
                                edit.dialog = true
                                edit.task = item
                            }">Finish Task</v-btn>
                        </div>
                    </v-card>
                </v-timeline-item>
            </v-timeline>
            <v-timeline dense v-if="status == '1' || status == ''">
                <v-timeline-item v-for="item in successTasks()" :key="item.id" color="teal accent-4">
                    <span slot="opposite">Success Task</span>
                    <v-card class="elevation-2">
                        <v-card-title class="text-h5">
                            {{ item.tasks.lessons.name }}
                        </v-card-title>
                        <v-card-text>
                            <v-chip class="elevation-2 mb-4" :color="item.team ? 'primary' : 'primary'" x-small>{{ item.tasks.team ? 'Group Task' : 'Individual Task' }}</v-chip><br>
                            {{ item.tasks.description }} <br>
                            <span class="text-xs">Deadline: {{ item.tasks.deadline ? $root.$refs.timezoneID(item.tasks.deadline) : 'undefined' }}</span>
                        </v-card-text>

                        <v-spacer></v-spacer>

                        <div class="pa-4">
                            <v-chip class="white--text elevation-2" label small color="teal accent-4">
                                <v-avatar left>
                                    <v-icon>mdi-check</v-icon>
                                </v-avatar>
                                Submitted: 
                                {{ item.created_at ? $root.$refs.timezoneID(item.created_at) : 'undefined' }}
                            </v-chip>
                        </div>
                    </v-card>
                </v-timeline-item>
            </v-timeline>
        </div>
        <v-dialog
            v-model="edit.dialog"
            width="500"
        >
            <v-card>
                <v-card-title class="text-h5">
                Finish
                </v-card-title>

                <v-card-text>
                    Are you sure to finish the task <strong>{{ edit.task.lessons.name }} - {{ edit.task.description }}</strong>?
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        color="grey"
                        text
                        @click="edit.dialog = false"
                    >
                        Cancel
                    </v-btn>
                    <v-btn
                        color="blue"
                        text
                        @click="finish"
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
        data() {
            return {
                data: [],
                lesson: [],
                success: [],
                status: '',
                type: '',
                lesson_id: '',
                edit: {
                    task: {
                        lessons: {}
                    },
                    dialog: false
                }
            }
        },
        created() {
            this.get()
            this.getLesson()
        },
        methods: {
            get() {
                (async() => {
                    const userId = await sessionStorage.getItem('activity-user-id')

                    const { data: success, error: successError } = await supabase.from('task_success').select('*, tasks(*, lessons(*))').eq('user_id', userId).order('created_at', { ascending: false })
                    this.success = success

                    let noTask = []
                    success.forEach(item => {
                        noTask.push(item.task_id)
                    })

                    const { data, error } = await supabase.from('tasks').select('*, lessons(*)').order('deadline', { ascending: true })
                    this.data = []
                    data.forEach(item => {
                        if (noTask.indexOf(item.id) < 0) {
                            this.data.push(item)
                        }
                    })
                })()
            },
            getLesson() {
                (async () => {
                    const { data, error } = await supabase.from('lessons').select('*').order('name')

                    this.lesson = [];

                    this.lesson.push({
                        text: 'All Lessons',
                        value: ''
                    })

                    data.forEach(item => {
                        this.lesson.push({
                            text: item.name,
                            value: item.id
                        })
                    })
                })()
            },
            tasks() {
                let data = this.data

                if (this.lesson_id) {
                    data = data.filter(item => item.lesson_id == this.lesson_id)
                }

                if (this.type) {
                    data = data.filter(item => this.type == '1' ? item.team : !item.team)
                }

                return data
            },
            successTasks() {
                let data = this.success

                if (this.lesson_id) {
                    data = data.filter(item => item.tasks.lesson_id == this.lesson_id)
                }

                if (this.type) {
                    data = data.filter(item => this.type == '1' ? item.tasks.team : !item.tasks.team)
                }

                return data
            },
            finish() {
                (async () => {
                    const userId = sessionStorage.getItem('activity-user-id')

                    const date = new Date()

                    var timezone = date.getFullYear()
                    timezone += '-' + ((date.getMonth() + 1).toString().length > 1 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1))
                    timezone += '-' + (date.getDate().toString().length > 1 ? date.getDate() : '0' + date.getDate())
                    timezone += 'T'
                    timezone += date.getHours().toString().length > 1 ? date.getHours() : '0' + date.getHours()
                    timezone += ':' + (date.getMinutes().toString().length > 1 ? date.getMinutes() : '0' + date.getMinutes())
                    timezone += ':' + (date.getSeconds().toString().length > 1 ? date.getSeconds() : '0' + date.getSeconds())

                    const { data, error } = await supabase.from('task_success').insert([{
                        user_id: userId,
                        task_id: this.edit.task.id,
                        created_at: timezone
                    }])

                    if (error) {
                        this.$root.$refs.notif(true, error.message)
                    } else {
                        this.edit.dialog = false
                        this.$root.$refs.notif(false, 'task successfully finished')
                        this.get()
                    }
                })()
            }
        }
    }
</script>