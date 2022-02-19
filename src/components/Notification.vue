<template>
    <v-snackbar
      v-model="open"
      :timeout="timeout"
      :color="color"
    >
      {{ text }}

      <template v-slot:action="{ attrs }">
        <v-btn
          color="white"
          text
          v-bind="attrs"
          @click="close"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
</template>

<script>
    export default {
        props: {
            text: String,
            open: {
              type: Boolean,
              default: false
            },
            color: {
              type: String,
              default: 'primary'
            }
        },
        data() {
            return {
                timeout: 3000
            }
        },
        methods: {
          close() {
            this.$emit('update:open', false)
          }
        }
    }
</script>