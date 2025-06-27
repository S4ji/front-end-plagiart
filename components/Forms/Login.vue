<template>
    <div :class="wrapperClass">
        <form
            :id="formId"
            @submit.prevent="handleLogin"
            :class="formClass"
            novalidate
        >
            <label :class="labelClass">
                Email:
                <input
                    type="email"
                    v-model="loginData.email"
                    required
                    :class="inputClass"
                />
            </label>

            <label :class="labelClass">
                Mot de passe:
                <input
                    type="password"
                    v-model="loginData.motDePasse"
                    required
                    :class="inputClass"
                />
            </label>

            <p v-if="errorMessage" class="text-red-600 text-sm">
                {{ errorMessage }}
            </p>
            <p v-if="successMessage" class="text-green-600 text-sm">
                {{ successMessage }}
            </p>

            <Button type="submit" block styleName="primary"> Connexion </Button>
        </form>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const config = useRuntimeConfig()
const API_URL = config.public.API_BASE_URL

const formId = 'loginForm'
const router = useRouter()
const { login } = useAuth()

const loginData = ref({
    email: '',
    motDePasse: '',
})

const errorMessage = ref('')
const successMessage = ref('')

const wrapperClass = 'max-w-md mx-auto p-4'
const formClass = 'space-y-4'
const labelClass = 'block text-sm font-semibold'
const inputClass =
    'mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'

async function handleLogin() {
    errorMessage.value = ''
    successMessage.value = ''

    if (!loginData.value.email || !loginData.value.motDePasse) {
        errorMessage.value = 'Veuillez remplir tous les champs.'
        return
    }

    const payload = {
        email: loginData.value.email,
        mot_de_passe: loginData.value.motDePasse,
    }

    try {
        const response = await fetch(`${API_URL}/auth/connexion`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        })

        const data = await response.json()

        if (!response.ok) {
            errorMessage.value = data.message || 'Identifiants invalides.'
            return
        }

        login(data) // update storage and reactive state

        successMessage.value = 'Connexion réussie !'
        router.push('/')
    } catch {
        errorMessage.value = 'Erreur réseau, veuillez réessayer plus tard.'
    }
}
</script>

<style scoped>
.text-red-600 {
    color: #dc2626;
}
.text-green-600 {
    color: #16a34a;
}
</style>
