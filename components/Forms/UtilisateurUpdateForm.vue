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
                Email:
                <input
                    type="email"
                    v-model="formData.email"
                    required
                    :class="inputClass"
                />
            </label>

            <label :class="labelClass">
                Nouveau mot de passe:
                <input
                    type="password"
                    v-model="formData.password"
                    :class="inputClass"
                    minlength="6"
                    placeholder="Laisser vide pour ne pas changer"
                />
            </label>

            <label :class="labelClass">
                Avatar:
                <input
                    type="file"
                    @change="handleFileChange"
                    :class="inputClass"
                    accept="image/jpeg, image/png, image/jpg"
                />
            </label>

            <img
                v-if="avatarPreview"
                :src="avatarPreview"
                alt="Preview Avatar"
                class="w-24 h-24 rounded-full object-cover mt-2"
            />

            <p v-if="errorMessage" class="text-red-600 text-sm">
                {{ errorMessage }}
            </p>
            <p v-if="successMessage" class="text-green-600 text-sm">
                {{ successMessage }}
            </p>

            <Button type="submit" block styleName="primary">
                Mettre à jour
            </Button>
        </form>
    </Container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRuntimeConfig } from '#imports'

const config = useRuntimeConfig()
const API_URL = config.public.API_BASE_URL

const userId = localStorage.getItem('id')

const formData = ref({
    nom: '',
    email: '',
    avatar: '',
    password: '',
})

const selectedFile = ref(null)
const avatarPreview = ref(null)
const errorMessage = ref('')
const successMessage = ref('')

const formClass = 'space-y-4'
const labelClass = 'block text-sm font-semibold'
const inputClass =
    'mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'

const handleFileChange = (event) => {
    const file = event.target.files?.[0]
    if (file) {
        selectedFile.value = file
        avatarPreview.value = URL.createObjectURL(file)
    }
}

const uploadImage = async (file) => {
    const form = new FormData()
    form.append('file', file)

    const response = await fetch(`${API_URL}/image/upload/avatar`, {
        method: 'POST',
        body: form,
    })

    if (!response.ok) {
        throw new Error('Échec de l’upload de l’image.')
    }

    const data = await response.json()
    return data.url
}

const handleSubmit = async () => {
    try {
        errorMessage.value = ''
        successMessage.value = ''

        let avatarUrl = formData.value.avatar

        if (selectedFile.value) {
            avatarUrl = await uploadImage(selectedFile.value)
        }

        const payload = {
            nom: formData.value.nom,
            email: formData.value.email,
            avatar: avatarUrl,
        }

        if (formData.value.password.trim()) {
            payload.password = formData.value.password
        }

        const response = await fetch(`${API_URL}/users/${userId}/update`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        })

        if (!response.ok) {
            const errorData = await response.json()
            errorMessage.value = errorData.message || 'Une erreur est survenue.'
            return
        }

        successMessage.value = "L'utilisateur a été mis à jour avec succès !"
        formData.value.password = ''
    } catch (error) {
        errorMessage.value = 'Erreur réseau, veuillez réessayer plus tard.'
        console.error(error)
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
