// composables/useAuth.js
import { ref, computed } from 'vue'

const isBrowser =
    typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'

const isLoggedIn = ref(false)

if (isBrowser) {
    isLoggedIn.value = !!localStorage.getItem('id')
}

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

function login(data) {
    if (!isBrowser) return
    localStorage.setItem('sub', data.sub)
    localStorage.setItem('role', data.role)
    localStorage.setItem('name', data.name)
    localStorage.setItem('id', data.id)
    isLoggedIn.value = true
}

function logout() {
    if (!isBrowser) return
    localStorage.removeItem('sub')
    localStorage.removeItem('role')
    localStorage.removeItem('name')
    localStorage.removeItem('id')
    isLoggedIn.value = false
}

// ✅ Ceci est l’export manquant
export function useAuth() {
    return {
        userId,
        isLoggedIn,
        login,
        logout,
    }
}
