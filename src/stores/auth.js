//import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const userAuthStore = defineStore('user_auth', {
    state: () => {
        return {
            user: null,
        }
    },
    getters: {
        getUser() { return this},
    },
    actions: {
        setUser(lauth) {
            this.user = lauth
        },
        getId() {
            // check
            this.user.id
        },

    }
}) 
