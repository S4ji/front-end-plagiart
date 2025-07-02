import { ref, computed } from 'vue'

const isBrowser = typeof window !== 'undefined'

// État connecté / déconnecté
const _isLoggedIn = ref(isBrowser && !!localStorage.getItem('id'))

// ID utilisateur
const _userId = computed({
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
        _isLoggedIn.value = !!value
    },
})

// Rôle utilisateur (ADMIN, USER, etc.)
const _userRole = computed({
    get() {
        return isBrowser ? localStorage.getItem('role') : null
    },
    set(value) {
        if (!isBrowser) return
        if (value === null || value === undefined) {
            localStorage.removeItem('role')
        } else {
            localStorage.setItem('role', value)
        }
    },
})

// Nom utilisateur
const _userName = computed({
    get() {
        return isBrowser ? localStorage.getItem('name') : null
    },
    set(value) {
        if (!isBrowser) return
        if (value === null || value === undefined) {
            localStorage.removeItem('name')
        } else {
            localStorage.setItem('name', value)
        }
    },
})

// Connexion : stocke les infos en localStorage
function login(data) {
    if (!isBrowser) return
    localStorage.setItem('sub', data.sub)
    localStorage.setItem('role', data.role)
    localStorage.setItem('name', data.name)
    localStorage.setItem('id', data.id)
    _isLoggedIn.value = true
}

// Déconnexion : nettoyage du localStorage
function logout() {
    if (!isBrowser) return
    localStorage.removeItem('sub')
    localStorage.removeItem('role')
    localStorage.removeItem('name')
    localStorage.removeItem('id')
    _isLoggedIn.value = false
}

// Export du composable
export function useAuth() {
    return {
        isLoggedIn: _isLoggedIn,
        userId: _userId,
        userRole: _userRole,
        userName: _userName,
        login,
        logout,
    }
}
