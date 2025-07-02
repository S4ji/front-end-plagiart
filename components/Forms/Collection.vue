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

            <Button type="submit" block :styleName="'primary'">
                {{ isEditing ? 'Mettre à jour' : 'Créer la collection' }}
            </Button>
        </form>
    </Container>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const config = useRuntimeConfig()
const API_URL = config.public.API_BASE_URL

const router = useRouter()
const route = useRoute()

const formData = ref({
    nom: '',
    description: '',
})

const isEditing = ref(false)

onMounted(async () => {
    if (route.params.id) {
        isEditing.value = true
        try {
            const res = await fetch(`${API_URL}/collections/${route.params.id}`)
            if (!res.ok) throw new Error('Erreur chargement collection')
            const data = await res.json()
            formData.value.nom = data.nom || ''
            formData.value.description = data.description || ''
        } catch (e) {
            alert('Erreur chargement collection')
        }
    }
})

const handleSubmit = async () => {
    try {
        if (isEditing.value && route.params.id) {
            // UPDATE
            const res = await fetch(`${API_URL}/collections/update`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id_collection: route.params.id,
                    nom: formData.value.nom,
                    description: formData.value.description,
                }),
            })
            if (!res.ok) throw new Error('Erreur mise à jour')
            const updated = await res.json()
            alert('✅ Collection mise à jour')
            router.push(`/collection/${updated.id_collection}`)
        } else {
            // CREATE
            const userId = localStorage.getItem('id')
            if (!userId) throw new Error('Utilisateur non identifié')
            const res = await fetch(`${API_URL}/collections/new`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nom: formData.value.nom,
                    description: formData.value.description,
                    id_utilisateur: userId,
                }),
            })
            if (!res.ok) throw new Error('Erreur création')
            const created = await res.json()
            alert('✅ Collection créée')
            formData.value.nom = ''
            formData.value.description = ''
            router.push(`/collection/${created.id_collection}`)
        }
    } catch (err) {
        console.error('Erreur formulaire collection:', err)
        alert('❌ Une erreur est survenue.')
    }
}
</script>
