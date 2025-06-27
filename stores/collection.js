import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRuntimeConfig } from '#imports'

export const useCollectionStore = defineStore('collection', () => {
    const config = useRuntimeConfig()
    const API_URL = config.public.API_BASE_URL
    // Current viewed collection (detailed)
    const currentCollection = ref({
        id: null,
        nom: 'Chargement...',
        description: '',
        images: [],
        suggestions: [],
        relatedCollections: [],
    })

    // User's collection list (for popup)
    const collections = ref([])

    // Flag to trigger refresh in components
    const refreshFlag = ref(0)

    function setCollection(data) {
        currentCollection.value = {
            id: data.id_collection,
            nom: data.nom,
            description: data.description,
            images: data.images,
            suggestions: data.suggestions,
            relatedCollections: data.relatedCollections,
            userId: data.id_utilisateur, // ← ICI
        }
    }

    function setCollections(data) {
        collections.value = data
    }

    function clearCollections() {
        collections.value = []
    }

    function clearCollection() {
        currentCollection.value = {
            id: null,
            nom: 'Chargement...',
            description: '',
            images: [],
            suggestions: [],
            relatedCollections: [],
            userId: null, // ← ICI aussi
        }
    }

    // Increment this to notify watchers to refresh
    function notifyRefresh() {
        refreshFlag.value++
    }

    async function removeImageFromCurrentCollection(imageId) {
        const currentUserId = localStorage.getItem('id')

        if (currentCollection.value.userId !== currentUserId) {
            console.warn(
                'Vous ne pouvez pas modifier une collection qui ne vous appartient pas.'
            )
            return
        }

        currentCollection.value.images = currentCollection.value.images.filter(
            (img) => img.id !== imageId
        )

        try {
            const response = await fetch(
                `${API_URL}/oeuvres/${imageId}/collections/${currentCollection.value.id}`,
                {
                    method: 'DELETE',
                }
            )

            if (!response.ok) {
                throw new Error('Failed to remove image from server')
            }

            notifyRefresh()
        } catch (error) {
            console.error('Erreur lors de la suppression de l’image :', error)
        }
    }

    return {
        currentCollection,
        collections,
        refreshFlag,
        setCollection,
        setCollections,
        clearCollections,
        clearCollection,
        notifyRefresh,
        removeImageFromCurrentCollection,
    }
})
