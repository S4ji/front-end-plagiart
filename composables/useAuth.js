// composables/useAuth.js
import { computed } from 'vue'

const isBrowser =
    typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'

const userId = computed({
    get() {
        return isBrowser ? localStorage.getItem('id') : null
    },
    set(value) {
        if (!isBrowser) return
        if (value === null || value === undefined) {
            localStorage.removeItem('id')
        } else {
            localStorage.setItem('id', value)
        }
    },
})

const isLoggedIn = computed(() => {
    return isBrowser && !!localStorage.getItem('id')
})

function login(data) {
    if (!isBrowser) return
    localStorage.setItem('sub', data.sub)
    localStorage.setItem('role', data.role)
    localStorage.setItem('name', data.name)
    localStorage.setItem('id', data.id)
}

function logout() {
    if (!isBrowser) return
    localStorage.removeItem('sub')
    localStorage.removeItem('role')
    localStorage.removeItem('name')
    localStorage.removeItem('id')
}

export function useAuth() {
    return {
        isLoggedIn,
        login,
        logout,
        userId,
    }
}
