import { ref } from 'vue'

const isBrowser =
    typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'

// Initialize with `false` or check only if in browser
const isLoggedIn = ref(false)

if (isBrowser) {
    isLoggedIn.value = !!localStorage.getItem('sub')
}

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

export function useAuth() {
    return { isLoggedIn, login, logout }
}
