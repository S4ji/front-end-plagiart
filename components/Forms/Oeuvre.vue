<template>
    <Container>
        <form @submit.prevent="handleSubmit" :class="formClass">
            <h2>{{ isEditing ? "Modifier l'œuvre" : 'Ajouter une œuvre' }}</h2>

            <label :class="labelClass">
                Titre:
                <input
                    type="text"
                    v-model="formData.titre"
                    required
                    :class="inputClass"
                />
            </label>

            <label :class="labelClass">
                Description:
                <textarea
                    v-model="formData.description"
                    required
                    :class="inputClass"
                ></textarea>
            </label>

            <label :class="labelClass">
                Upload Image:
                <input
                    type="file"
                    @change="handleFileChange"
                    :class="inputClass"
                    accept="image/jpeg, image/png, image/jpg, image/webp"
                />
            </label>

            <label :class="labelClass">
                Catégories:
                <CategoryPicker v-model="formData.categorie" />
            </label>

            <label :class="labelClass">
                AI Prompt:
                <textarea
                    v-model="formData.ai_prompt"
                    required
                    :class="inputClass"
                ></textarea>
            </label>

            <Button type="submit" block styleName="primary">
                {{
                    isEditing
                        ? 'Enregistrer les modifications'
                        : "Créer l'œuvre"
                }}
            </Button>
            <Button
                v-if="isEditing"
                type="button"
                block
                styleName="report"
                @click="emit('delete')"
            >
                Supprimer l'œuvre
            </Button>
        </form>
    </Container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const config = useRuntimeConfig()
const API_URL = config.public.API_BASE_URL

const router = useRouter()

const props = defineProps({
    initialOeuvre: {
        type: Object,
        default: null,
    },
    isEditing: {
        type: Boolean,
        default: false,
    },
})

const userId = localStorage.getItem('id')

const formData = ref({
    titre: '',
    description: '',
    image: '',
    ai_prompt: '',
    categorie: [],
    idArtiste: null,
})

const selectedFile = ref(null)

onMounted(() => {
    if (props.isEditing && props.initialOeuvre) {
        formData.value = {
            titre: props.initialOeuvre.titre || '',
            description: props.initialOeuvre.description || '',
            image: props.initialOeuvre.image || '',
            ai_prompt: props.initialOeuvre.ai_prompt || '',
            categorie: props.initialOeuvre.categorie || [],
            idArtiste: props.initialOeuvre.id_utilisateur || userId,
        }
    } else {
        formData.value.idArtiste = userId
    }
})

const formClass = 'space-y-4'
const labelClass = 'block text-sm font-semibold'
const inputClass =
    'mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'

const handleFileChange = (event) => {
    const file = event.target.files?.[0]
    if (file) {
        selectedFile.value = file
    }
}

const uploadImage = async (file) => {
    const form = new FormData()
    form.append('file', file)

    const response = await fetch(`${API_URL}/image/upload/oeuvreImage`, {
        method: 'POST',
        body: form,
    })

    if (!response.ok) {
        throw new Error(`Image upload failed: ${response.statusText}`)
    }

    const data = await response.json()
    return data.url
}

const handleSubmit = async () => {
    try {
        let imageUrl = formData.value.image

        if (selectedFile.value) {
            imageUrl = await uploadImage(selectedFile.value)
        }

        const payload = {
            titre: formData.value.titre,
            description: formData.value.description,
            image: imageUrl,
            ai_prompt: formData.value.ai_prompt,
            id_utilisateur: formData.value.idArtiste,
            categoryNames: formData.value.categorie,
        }

        const url = props.isEditing
            ? `${API_URL}/oeuvres/${props.initialOeuvre.id_oeuvre}`
            : `${API_URL}/oeuvres/new`

        const method = props.isEditing ? 'PUT' : 'POST'

        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        })

        if (!response.ok) {
            throw new Error(
                `${props.isEditing ? 'Modification' : 'Création'} échouée`
            )
        }

        const result = await response.json()
        alert(
            props.isEditing
                ? 'Œuvre modifiée avec succès ✅'
                : 'Œuvre créée avec succès 🎉'
        )

        // Redirection vers la page de l'œuvre modifiée / créée
        const oeuvreId = props.isEditing
            ? props.initialOeuvre.id_oeuvre
            : result.id_oeuvre // Attention que l'API renvoie bien l'id de la nouvelle œuvre

        router.push(`/oeuvre/${oeuvreId}`)

        // Reset uniquement si création
        if (!props.isEditing) {
            formData.value = {
                titre: '',
                description: '',
                image: '',
                ai_prompt: '',
                categorie: [],
                idArtiste: userId,
            }
            selectedFile.value = null
        }
    } catch (error) {
        console.error('Erreur soumission:', error)
        alert('Une erreur est survenue.')
    }
}
</script>

<style scoped>
/* Custom styles optionnels */
</style>
