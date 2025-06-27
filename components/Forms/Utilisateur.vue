<template>
    <div :class="wrapperClass">
        <form
            :id="formId"
            @submit.prevent="handleSubmit"
            :class="formClass"
            novalidate
        >
            <label :class="labelClass">
                Nom:
                <input
                    type="text"
                    v-model="formData.nom"
                    required
                    :class="inputClass"
                />
            </label>

            <label :class="labelClass">
                Email:
                <input
                    type="email"
                    v-model="formData.email"
                    required
                    :class="inputClass"
                />
            </label>

            <label :class="labelClass">
                Mot de passe:
                <input
                    type="password"
                    v-model="formData.motDePasse"
                    required
                    :class="inputClass"
                />
            </label>

            <label :class="labelClass">
                Re-Tapez le mot de passe:
                <input
                    type="password"
                    v-model="formData.motDePasseConfirm"
                    required
                    :class="inputClass"
                />
            </label>

            <label :class="labelClass" class="flex items-center space-x-2">
                <input type="checkbox" v-model="formData.rgpd" />
                <span
                    >Acceptez vous les conditions d'utilisations du site ?</span
                >
            </label>

            <p v-if="errorMessage" class="text-red-600 text-sm">
                {{ errorMessage }}
            </p>
            <p v-if="successMessage" class="text-green-600 text-sm">
                {{ successMessage }}
            </p>

            <Button type="submit" block styleName="primary">
                Créer l'utilisateur
            </Button>
        </form>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const config = useRuntimeConfig()
const API_URL = config.public.API_BASE_URL

const formId = 'userForm'

const formData = ref({
    nom: '',
    email: '',
    motDePasse: '',
    motDePasseConfirm: '',
    rgpd: false,
})

const errorMessage = ref('')
const successMessage = ref('')

const wrapperClass = 'max-w-2xl mx-auto p-4'
const formClass = 'space-y-4'
const labelClass = 'block text-sm font-semibold'
const inputClass =
    'mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'

const handleSubmit = async () => {
    errorMessage.value = ''
    successMessage.value = ''

    if (!formData.value.motDePasse || !formData.value.motDePasseConfirm) {
        errorMessage.value = 'Veuillez remplir les deux champs de mot de passe.'
        return
    }

    if (formData.value.motDePasse !== formData.value.motDePasseConfirm) {
        errorMessage.value = 'Les mots de passe ne correspondent pas.'
        return
    }

    if (!formData.value.rgpd) {
        errorMessage.value = 'Vous devez accepter les conditions d’utilisation.'
        return
    }

    // Use real input data
    const payload = {
        nom: formData.value.nom,
        email: formData.value.email,
        mot_de_passe: formData.value.motDePasse,
    }

    try {
        const response = await fetch(`${API_URL}/auth/inscription`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        })

        if (!response.ok) {
            const errorData = await response.json()
            errorMessage.value = errorData.message || 'Une erreur est survenue.'
            return
        }

        successMessage.value = "L'utilisateur a été créé avec succès !"
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
