<template>
    <Container>
        <ClientOnly>
            <div :class="sectionSpacing">
                <div :class="gridWrapperClass">
                    <div :class="formContainerClass">
                        <div
                            v-if="loaded && collectionData"
                            :class="formWrapperClass"
                        >
                            <FormsCollection
                                :initialCollection="collectionData"
                                :isEditing="true"
                                @updated="handleUpdated"
                            />
                            <!-- Affichage des images de la collection -->
                            <div
                                class="mt-12"
                                v-if="collectionData?.images?.length"
                            >
                                <div class="mt-12" v-if="mappedImages.length">
                                    <h2 :class="sectionTitle">
                                        Images de la collection
                                    </h2>
                                    <ImageGallery
                                        :images="mappedImages"
                                        :isArtGallery="true"
                                    />
                                </div>
                            </div>
                        </div>

                        <p v-else-if="!loaded" :class="loadingClass">
                            Chargement en cours...
                        </p>
                        <p v-else :class="errorClass">
                            Erreur lors du chargement
                        </p>
                    </div>
                </div>
            </div>
        </ClientOnly>
    </Container>
</template>

<script setup>
import { ClientOnly } from '#components'
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const config = useRuntimeConfig()
const API_URL = config.public.API_BASE_URL

const route = useRoute()
const router = useRouter()

const collectionId = route.params.id
const collectionData = ref(null)
const loaded = ref(false)

const mappedImages = computed(() => {
    return (
        collectionData.value?.images?.map((img) => ({
            src: img.src || img.image,
            alt: img.alt || img.titre || 'Œuvre',
            id: img.id || img.id_oeuvre,
        })) || []
    )
})

async function fetchCollection(id) {
    try {
        const res = await fetch(`${API_URL}/collections/${id}`)
        if (!res.ok) throw new Error('Erreur fetch collection')
        const data = await res.json()

        collectionData.value = {
            id_collection: data.id_collection,
            nom: data.nom,
            description: data.description || '',
            userId: data.id_utilisateur,
            images: data.images || [], // 👈 ajoute cette ligne
        }

        loaded.value = true
    } catch (e) {
        console.error('Erreur lors du chargement de la collection :', e)
        collectionData.value = null
        loaded.value = true
    }
}

const handleDelete = async () => {
    if (!confirm('Voulez-vous vraiment supprimer cette collection ?')) return

    try {
        const res = await fetch(
            `${API_URL}/collections/${collectionData.value.id_collection}`,
            {
                method: 'DELETE',
            }
        )
        if (!res.ok) throw new Error('Erreur suppression collection')
        alert('Collection supprimée avec succès 🗑️')
        router.push('/mes-collections')
    } catch (e) {
        console.error(e)
        alert('Erreur lors de la suppression.')
    }
}

onMounted(() => {
    if (collectionId) fetchCollection(collectionId)
})

// Styles
const sectionSpacing = 'my-8 px-4'
const gridWrapperClass = 'grid grid-cols-1 gap-8 items-start'
const formContainerClass = 'relative'
const formWrapperClass = 'relative border p-4 rounded'
const loadingClass = 'text-center text-gray-500'
const errorClass = 'text-center text-red-500'
</script>
