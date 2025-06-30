<template>
    <Container>
        <form @submit.prevent="handleSubmit" :class="formClass">
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
                Description:
                <textarea
                    v-model="formData.description"
                    :class="inputClass"
                ></textarea>
            </label>

            <Button type="submit" block styleName="primary">
                Créer la collection
            </Button>
        </form>
    </Container>
</template>

<script setup>
import { ref } from 'vue'

const config = useRuntimeConfig()
const API_URL = config.public.API_BASE_URL

const formData = ref({
    nom: '',
    description: '',
})

const userId = localStorage.getItem('id')
console.log('userid', userId)

const handleSubmit = async () => {
    const payload = {
        nom: formData.value.nom,
        description: formData.value.description || '',
        id_utilisateur: userId,
    }

    try {
        const res = await fetch(`${API_URL}/collections/new`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        })

        if (!res.ok) {
            throw new Error('Erreur lors de la création de la collection')
        }

        const data = await res.json()
        console.log('Collection créée:', data)

        // Reset form
        formData.value.nom = ''
        formData.value.description = ''
    } catch (error) {
        console.error('Erreur:', error)
    }
}

const formClass = 'space-y-4'
const labelClass = 'block text-sm font-semibold'
const inputClass =
    'mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
</script>

<style scoped></style>
