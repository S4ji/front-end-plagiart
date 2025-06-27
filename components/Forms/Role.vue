<template>
    <div :class="wrapperClass">
        <form @submit.prevent="handleSubmit" :class="formClass">
            <label :class="labelClass">
                Nom du rôle:
                <input
                    type="text"
                    v-model="formData.nom"
                    required
                    :class="inputClass"
                />
            </label>
            <Button type="submit" block styleName="primary">
                Créer le rôle
            </Button>
        </form>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

// Données du formulaire
const formData = ref({
    nom: '',
})

// Classes Tailwind extraites
const wrapperClass = 'max-w-md mx-auto p-4'
const formClass = 'space-y-4'
const labelClass = 'block text-sm font-semibold'
const inputClass =
    'mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'

// Soumission du formulaire
const handleSubmit = () => {
    console.log(formData.value)
}
</script>

<style scoped>
/* Ajoute des animations ou effets si besoin */
</style>
