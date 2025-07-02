<template>
    <div class="p-6">
        <div class="mb-6 flex justify-between items-start">
            <div>
                <h1 :class="titleClass">
                    {{ collectionStore.currentCollection.nom }}
                </h1>
                <p
                    v-if="collectionStore.currentCollection.description"
                    :class="subTextClass"
                >
                    {{ collectionStore.currentCollection.description }}
                </p>
            </div>

            <Button
                v-if="
                    collectionStore.currentCollection.userId == loggedUser.value
                "
                @click="goToEdit"
            >
                Éditer informations collection
            </Button>
        </div>

        <div class="overflow-x-auto mt-8">
            <div :class="gridClass">
                <div
                    v-for="(image, index) in collectionStore.currentCollection
                        .images"
                    :key="image.id || image.src + index"
                    :class="cardClass"
                >
                    <Image
                        :image="image"
                        :isRemovable="true"
                        :onRemove="removeFromCollection"
                        :ownerId="collectionStore.currentCollection.userId"
                    />
                </div>
            </div>
        </div>

        <div
            v-if="collectionStore.currentCollection.suggestions?.length"
            class="mt-12"
        >
            <h2 :class="sectionTitle">Suggestions similaires</h2>
            <div :class="gridClass">
                <div
                    v-for="(suggestion, index) in collectionStore
                        .currentCollection.suggestions"
                    :key="suggestion.id_oeuvre || index"
                    :class="cardClass"
                >
                    <Image
                        :image="{
                            src: suggestion.image || placeholderImage,
                            alt: suggestion.title,
                            id: suggestion.id_oeuvre,
                        }"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCollectionStore } from '@/stores/collection'
import { useAuth } from '@/composables/useAuth'
definePageMeta({ layout: 'main' })

const { userId, logout } = useAuth()

const loggedUser = computed(() => userId.value)

const config = useRuntimeConfig()
const API_URL = config.public.API_BASE_URL

const collectionStore = useCollectionStore()
const route = useRoute()
const router = useRouter()

const placeholderImage = 'https://via.placeholder.com/500x500?text=No+Image'

async function fetchCollection(id) {
    try {
        const response = await fetch(`${API_URL}/collections/${id}`)
        if (!response.ok) throw new Error('Erreur lors du chargement')
        const data = await response.json()
        collectionStore.setCollection(data)
        console.log(data)
    } catch (error) {
        console.error('Erreur:', error)
        collectionStore.clearCollection()
        collectionStore.currentCollection.nom = 'Erreur lors du chargement'
    }
}

onMounted(() => {
    fetchCollection(route.params.id)
})

watch(
    () => collectionStore.refreshFlag,
    () => {
        if (route.params.id) {
            fetchCollection(route.params.id)
        }
    }
)

// Navigation vers la page d'édition
function goToEdit() {
    if (route.params.id) {
        router.push(`/editcollection/${route.params.id}`)
    } else {
        alert("Impossible d'éditer : collection non chargée.")
    }
}

// Remove image handler
function removeFromCollection(imageId) {
    collectionStore.removeImageFromCurrentCollection(imageId)
}

// Styles
const gridClass = 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'
const cardClass =
    'relative group w-full border rounded-xl p-4 shadow hover:shadow-lg transition'
const titleClass = 'text-3xl font-semibold'
const subTextClass = 'text-gray-600 mt-2'
const sectionTitle = 'text-xl font-semibold mb-4'
</script>
