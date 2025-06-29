<template>
    <div :class="wrapperClass">
        <form @submit.prevent="handleSubmit" :class="formClass">
            <label :class="labelClass">
                Raison du signalement :
                <textarea
                    v-model="formData.raison"
                    required
                    :class="inputClass"
                />
            </label>
            <button
                type="submit"
                class="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
            >
                Envoyer le signalement
            </button>
        </form>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useRuntimeConfig } from '#imports'
import { useAuth } from '@/composables/useAuth'

const { userId, logout } = useAuth()

const router = useRouter()
const config = useRuntimeConfig()
const API_URL = config.public.API_BASE_URL

// En JS pur, on utilise defineProps sans typage
const props = defineProps(['idOeuvre'])

console.log('userId:', userId)
console.log('props.idOeuvre:', props.idOeuvre)

const formData = ref({
    raison: '',
})

const wrapperClass = 'max-w-2xl mx-auto p-4'
const formClass = 'space-y-4'
const labelClass = 'block text-sm font-semibold'
const inputClass =
    'mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'

const handleSubmit = async () => {
    const payload = {
        id_utilisateur: userId,
        id_oeuvre: Number(props.idOeuvre),
        raison: formData.value.raison,
    }

    try {
        const response = await fetch(`${API_URL}/signalements/new`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        })

        if (!response.ok) {
            throw new Error('Échec lors de l’envoi du signalement')
        }

        router.push('/')
        alert('Signalement envoyé avec succès.')
        formData.value.raison = ''
    } catch (err) {
        console.error(err)
        alert('Une erreur est survenue lors de l’envoi du signalement.')
    }
}
</script>
