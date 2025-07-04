<template>
    <div :class="wrapperClass">
        <div :class="sectionSpacing">
            <div :class="imageContainerClass">
                <div :class="relativeGroupClass">
                    <img
                        :src="oeuvre.image || placeholderImage"
                        :alt="oeuvre.title || 'Oeuvre image'"
                        :class="imageClass"
                    />
                    <div :class="titleCreatedByWrapperClass">
                        <span>{{ oeuvre.title }}</span>
                        <CreatedBy
                            :id="oeuvre.artiste.id"
                            :name="oeuvre.artiste.nom"
                        />
                    </div>

                    <div :class="mainImageButtonWrapperClass">
                        <button
                            :class="mainImageButtonClass"
                            @click.stop="onMainImageButtonClick"
                        >
                            <span :class="plusSignClass">+</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div :class="buttonGroupClass">
            <Button @click="createLike" :size="'md'">Liker</Button>
            <Button
                @click="goToSignalement"
                :size="'md'"
                :class="reportButtonClass"
            >
                Signaler
            </Button>
        </div>

        <div
            v-if="relatedCollections.length > 0"
            :class="sectionMarginTopClass"
        >
            <h2 :class="sectionTitleClass">Collections associées</h2>
            <ImageGallery :images="relatedCollections" />
        </div>
        <div v-if="relatedImages.length > 0" :class="sectionMarginTopClass">
            <h2 :class="sectionTitleClass">Œuvres similaires</h2>
            <div :class="galleryGridClass">
                <Image
                    v-for="(img, index) in relatedImages"
                    :key="img.id || index"
                    :image="img"
                    :isRemovable="false"
                />
            </div>
        </div>

        <Collectionpopup ref="collectionPopup" />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const { userId, logout } = useAuth()

const config = useRuntimeConfig()
const API_URL = config.public.API_BASE_URL

const router = useRouter()
const route = useRoute()
const collectionPopup = ref(null)

definePageMeta({
    layout: 'main',
})

const oeuvreId = route.params.id

const oeuvre = ref({
    title: '',
    image: '',
    artiste: {
        id: '',
        nom: '',
    },
})

const relatedImages = ref([])
const relatedCollections = ref([])

const placeholderImage = 'https://via.placeholder.com/500x500?text=No+Image'

async function fetchCollectionsByOeuvre(oeuvreId, page = 1, pageSize = 6) {
    const endpoint = `${API_URL}/collections/by-oeuvre/${oeuvreId}?page=${page}&pageSize=${pageSize}`

    try {
        const response = await fetch(endpoint)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()

        const formatted = data.collections.map((collection) => {
            return collection.image.map((url, index) => ({
                id: index === 0 ? collection.id_collection : undefined,
                src: url,
                alt: `Image ${index + 1}`,
            }))
        })

        return formatted
    } catch (error) {
        console.error('Failed to fetch or process images:', error)
        return []
    }
}

async function fetchSuggestionsForOeuvre(oeuvreId, limit = 10) {
    try {
        const response = await fetch(
            `${API_URL}/oeuvres/${oeuvreId}/suggestions?limit=${limit}`
        )

        if (!response.ok) {
            throw new Error(
                `Erreur ${response.status} : ${response.statusText}`
            )
        }

        const data = await response.json()
        console.log('data', data)

        return data
            .filter((item) => item.image)
            .map((item, index) => ({
                id: item.id_oeuvre || `suggestion-${index}`,
                src: item.image,
                alt: item.titre || `Œuvre ${index + 1}`,
            }))
    } catch (error) {
        console.error('Erreur lors du fetch des suggestions :', error)
        return []
    }
}
async function fetchOeuvre(id) {
    try {
        const response = await fetch(`${API_URL}/oeuvres/${id}`)
        if (!response.ok)
            throw new Error(`Failed to fetch oeuvre with id ${id}`)
        const data = await response.json()

        oeuvre.value.title = data.titre || 'Titre non disponible'
        oeuvre.value.image = data.image || ''
        oeuvre.value.artiste = {
            id: data.id_utilisateur,
            nom: data.artiste?.nom || 'Artiste inconnu',
        }
    } catch (error) {
        console.error('Error loading oeuvre:', error)
        oeuvre.value.title = 'Erreur lors du chargement'
        oeuvre.value.image = ''
        relatedImages.value = []
    }
}

onMounted(async () => {
    if (oeuvreId) {
        await fetchOeuvre(oeuvreId)
        relatedImages.value = await fetchSuggestionsForOeuvre(oeuvreId, 10)

        relatedCollections.value = await fetchCollectionsByOeuvre(
            oeuvreId,
            1,
            6
        )
    } else {
        console.warn('No oeuvre id found in route params')
    }
})

function onMainImageButtonClick() {
    collectionPopup.value?.show(oeuvreId)
}

function goToSignalement() {
    router.push({
        path: '/signalement',
        query: { oeuvreId: oeuvreId },
    })
}

async function createLike() {
    try {
        const response = await fetch(`${API_URL}/likes/new`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id_utilisateur: userId.value,
                id_oeuvre: Number(oeuvreId),
            }),
        })

        if (!response.ok) {
            const error = await response.text()
            throw new Error(`Failed to create like: ${error}`)
        }
        alert('👍 Like ajouté avec succès !')
        return await response.json()
    } catch (error) {
        console.error(error)
        alert("Erreur lors de l'ajout du like")
    }
}

// Classes Tailwind extraites en variables

const wrapperClass = 'p-6'
const sectionSpacing = 'mb-6'
const imageContainerClass = 'flex justify-center'
const relativeGroupClass = 'relative inline-block group'
const imageClass = 'block max-w-full max-h-[80vh] object-contain rounded-lg'
const titleCreatedByWrapperClass = 'flex flex-col items-center justify-center'
const mainImageButtonWrapperClass =
    'absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10'
const mainImageButtonClass =
    'bg-white/80 hover:bg-white rounded-full p-1 shadow transition cursor-pointer'
const plusSignClass = 'text-xl font-bold'
const buttonGroupClass = 'flex gap-4 mb-12'
const reportButtonClass =
    'bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition w-full sm:w-auto'
const sectionTitleClass = 'text-xl font-semibold mb-4'
const sectionMarginTopClass = 'mt-12'
const galleryGridClass = 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4'
</script>
