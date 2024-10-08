import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const userAuthStore = defineStore('user_auth', {
    state: () => {
        return { auth: {}}
    },
    actions: {
        setAuth(lauth) {
            this.auth = lauth
        },
        getId() {
            // check
            this.auth.id
        },

    }
}) 
