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
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const config = useRuntimeConfig()
const API_URL = config.public.API_BASE_URL
const router = useRouter()

const props = defineProps({
    initialCollection: Object,
    isEditing: Boolean,
})

const emit = defineEmits(['updated'])

const formData = ref({
    nom: '',
    description: '',
})

onMounted(() => {
    if (props.isEditing && props.initialCollection) {
        formData.value.nom = props.initialCollection.nom || ''
        formData.value.description = props.initialCollection.description || ''
    }
})

const handleSubmit = async () => {
    try {
        if (props.isEditing && props.initialCollection?.id_collection) {
            // UPDATE
            const userId = localStorage.getItem('id')

            const res = await fetch(`${API_URL}/collections/update`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id_collection: props.initialCollection.id_collection,
                    nom: formData.value.nom,
                    description: formData.value.description,
                    id_utilisateur: userId,
                }),
            })
            if (!res.ok) throw new Error('Erreur mise à jour')

            const updated = await res.json()
            emit('updated', updated)
            alert('✅ Collection mise à jour')
            router.push(`/collection/${updated.id_collection}`)
        } else {
            // CREATE
            const userId = localStorage.getItem('id')
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
        }
    } catch (err) {
        console.error('Erreur formulaire collection:', err)
        alert('❌ Une erreur est survenue.')
    }
}

const formClass = 'space-y-4'
const labelClass = 'block text-sm font-semibold'
const inputClass =
    'mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
</script>
