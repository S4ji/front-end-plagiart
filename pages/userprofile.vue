<template>
    <Container>
        <div :class="containerClass">
            <div class="text-center mb-8">
                <img
                    src="https://via.placeholder.com/150"
                    alt="Avatar"
                    class="rounded-full mx-auto mb-4"
                />
                <h2 class="text-2xl font-semibold">Nom de l'utilisateur</h2>
                <p class="text-gray-600">Rôle: Artiste</p>
                <p class="text-gray-600">Lieu: Paris, France</p>
            </div>

            <h2 :class="sectionTitleClass">Vos œuvres</h2>
            <div :class="gridWrapperClass">
                <div
                    v-for="(image, index) in userOeuvres"
                    :key="image.id || index"
                    :class="imageCardClass"
                >
                    <Image
                        :showAddButton="false"
                        :image="image"
                        :isEditable="false"
                        :ownerId="currentUserId"
                    />
                </div>
            </div>

            <h2 :class="sectionTitleClass">Vos collections</h2>
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
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const config = useRuntimeConfig()
const API_URL = config.public.API_BASE_URL

definePageMeta({
    layout: 'main',
})

const route = useRoute()
const currentUserId = route.params.id

const userOeuvres = ref([])
const userCollections = ref([])

const containerClass = 'my-8'
const sectionTitleClass = 'text-2xl font-semibold text-center mt-8 mb-4'
const gridWrapperClass =
    'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6'
const imageCardClass =
    'relative group w-full border rounded-xl p-4 shadow hover:shadow-lg transition'

async function fetchUserOeuvres(currentUserId) {
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

async function fetchUserCollections(currentUserId) {
    try {
        const res = await fetch(`${API_URL}/collections/user/${currentUserId}`)
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

onMounted(async () => {
    userOeuvres.value = await fetchUserOeuvres(currentUserId)
    userCollections.value = await fetchUserCollections(currentUserId)
})
</script>
