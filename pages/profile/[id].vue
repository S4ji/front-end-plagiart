<template>
    <Container>
        <div :class="containerClass">
            <div class="text-center mb-8">
                <h2 v-id="utilisateur" class="text-2xl font-semibold">
                    {{ utilisateur?.nom || 'Utilisateur inconnu' }}
                </h2>
            </div>

            <h2 :class="sectionTitleClass">Oeuvres</h2>
            <div :class="gridWrapperClass">
                <div
                    v-for="(image, index) in userOeuvres"
                    :key="image.id || index"
                    :class="imageCardClass"
                >
                    <Image
                        :image="image"
                        :ownerId="userId"
                        :isEditable="isOwnProfile"
                        :showAddButton="!isOwnProfile"
                    />
                </div>
            </div>

            <h2 :class="sectionTitleClass">Collections</h2>
            <div v-if="userCollections.length > 0">
                <ImageGallery :images="userCollections || []" />
            </div>
            <p v-else class="text-center text-gray-500">
                Aucune collection pour le moment.
            </p>
        </div>
    </Container>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const config = useRuntimeConfig()
const API_URL = config.public.API_BASE_URL

definePageMeta({
    layout: 'main',
})

const route = useRoute()
const userId = route.params.id

const { userId: connectedUserId } = useAuth()
const isOwnProfile = computed(() => userId === connectedUserId.value)

const utilisateur = ref(null)
const userOeuvres = ref([])
const userCollections = ref([])

const containerClass = 'my-8'
const sectionTitleClass = 'text-2xl font-semibold text-center mt-8 mb-4'
const gridWrapperClass =
    'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6'
const imageCardClass =
    'relative group w-full border rounded-xl p-4 shadow hover:shadow-lg transition'

async function fetchUserOeuvres(userId) {
    try {
        const res = await fetch(`${API_URL}/oeuvres/user/${userId}`)
        if (!res.ok) throw new Error('Failed to fetch œuvres')

        const data = await res.json()
        return data.map((item) => ({
            src:
                item.image ||
                'https://via.placeholder.com/500x500?text=No+Image',
            width: 500,
            height: 500,
            id: item.id_oeuvre,
            title: item.titre,
            categories: item.categories
                ? item.categories.map((c) => c.categorie.nom)
                : [],
        }))
    } catch (error) {
        console.error('Error fetching œuvres:', error)
        return []
    }
}

async function fetchUserCollections(userId) {
    try {
        const res = await fetch(`${API_URL}/collections/user/${userId}`)
        if (!res.ok) throw new Error('Failed to fetch collections')

        const data = await res.json()
        return data
            .filter(
                (item) =>
                    item.image &&
                    Array.isArray(item.image) &&
                    item.image.length > 0
            )
            .map((item) =>
                item.image.map((src, index) => ({
                    id: `${item.id_collection}`,
                    src,
                    alt: `Image ${index + 1} of collection ${
                        item.id_collection
                    }`,
                }))
            )
    } catch (error) {
        console.error('Error fetching collections:', error)
        return []
    }
}

async function fetchUtilisateurById(id) {
    try {
        const response = await fetch(`${API_URL}/utilisateurs/${id}`)
        if (!response.ok) {
            throw new Error(
                `Erreur ${response.status} : utilisateur non trouvé`
            )
        }
        const data = await response.json()
        console.log('fetchUtilisateurById', data)
        return data
    } catch (error) {
        console.error(
            'Erreur lors de la récupération de l’utilisateur :',
            error
        )
        return null
    }
}

onMounted(async () => {
    userOeuvres.value = await fetchUserOeuvres(userId)
    userCollections.value = await fetchUserCollections(userId)
    utilisateur.value = await fetchUtilisateurById(userId)
})
</script>
