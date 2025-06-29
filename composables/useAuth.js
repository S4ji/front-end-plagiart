import { ref, computed } from 'vue'

const isBrowser = typeof window !== 'undefined'

const _isLoggedIn = ref(isBrowser && !!localStorage.getItem('id'))

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

function login(data) {
    if (!isBrowser) return
    localStorage.setItem('sub', data.sub)
    localStorage.setItem('role', data.role)
    localStorage.setItem('name', data.name)
    localStorage.setItem('id', data.id)
    _isLoggedIn.value = true
}

function logout() {
    if (!isBrowser) return
    localStorage.removeItem('sub')
    localStorage.removeItem('role')
    localStorage.removeItem('name')
    localStorage.removeItem('id')
    _isLoggedIn.value = false
}

export function useAuth() {
    return {
        isLoggedIn: _isLoggedIn,
        userId: _userId,
        login,
        logout,
    }
}
