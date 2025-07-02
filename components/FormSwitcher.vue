<template>
    <Container>
        <div :class="containerClass">
            <!-- Menu de sélection -->
            <div :class="menuWrapperClass">
                <Button
                    v-for="form in formList"
                    :key="form.id"
                    @click="selectedForm = form.id"
                    :size="'md'"
                    :styleName="
                        selectedForm === form.id ? 'primary' : 'outline'
                    "
                >
                    {{ form.label }}
                </Button>
            </div>

            <div>
                <div v-if="selectedForm === 'oeuvre'">
                    <FormsOeuvre />
                    <h2 :class="sectionTitleClass">Vos œuvres</h2>
                    <div :class="gridWrapperClass">
                        <div
                            v-for="(image, index) in userOeuvres"
                            :key="image.id || index"
                            :class="imageCardClass"
                        >
                            <Image
                                :image="image"
                                :isEditable="true"
                                :ownerId="userId"
                            />
                            <h3
                                class="mt-2 text-center text-sm font-medium text-gray-700"
                            >
                                {{ image.title }}
                            </h3>
                        </div>
                    </div>
                </div>

                <div v-else-if="selectedForm === 'collection'">
                    <FormsCollection />
                    <h2 :class="sectionTitleClass">Vos collections</h2>
                    <div>
                        <div
                            v-for="collection in userCollections"
                            :key="collection.id"
                            :class="gridWrapperClass"
                        >
                            <h3
                                class="mb-4 text-center text-lg font-semibold text-gray-800"
                            >
                                {{ collection.nom }}
                            </h3>
                            <ImageGallery :images="userCollections" />
                        </div>
                    </div>
                </div>

                <p v-else :class="emptyStateClass">Choisissez quoi créer.</p>
            </div>
        </div>
    </Container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'

const { userId } = useAuth()

const selectedForm = ref('oeuvre')

const formList = [
    { id: 'oeuvre', label: 'Créer une œuvre' },
    { id: 'collection', label: 'Créer une collection' },
]

// Classes Tailwind
const containerClass = 'my-8'
const menuWrapperClass = 'flex justify-center gap-4 mb-6'
const emptyStateClass = 'text-center text-gray-500'
const sectionTitleClass = 'text-2xl font-semibold text-center mt-8 mb-4'
const gridWrapperClass =
    'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6'
const imageCardClass =
    'relative group w-full border rounded-xl p-4 shadow hover:shadow-lg transition'

// Données
const userOeuvres = ref([])
const userCollections = ref([])

const config = useRuntimeConfig()
const API_URL = config.public.API_BASE_URL

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

onMounted(async () => {
    userOeuvres.value = await fetchUserOeuvres(userId.value)
    userCollections.value = await fetchUserCollections(userId.value)
})
</script>
