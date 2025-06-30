<template>
    <div :class="wrapperClass">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div>
                <img
                    :src="piece.image"
                    :alt="piece.title"
                    :class="mainImageClass"
                />
                <h3 class="mt-4 text-center text-lg font-medium">
                    {{ piece.title }}
                </h3>
            </div>

            <div>
                <h2 :class="sectionTitleClass">Formulaire de signalement</h2>
                <ClientOnly
                    ><FormsSignalement :id-oeuvre="route.query.oeuvreId" />
                </ClientOnly>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const config = useRuntimeConfig()
const API_URL = config.public.API_BASE_URL
// Meta
definePageMeta({
    layout: 'main',
})

// Route
const route = useRoute()

// Placeholder data
const placeholderImage = 'https://via.placeholder.com/500x500?text=Aucune+image'

// Artwork data
const piece = ref({
    title: 'Chargement...',
    image: placeholderImage,
})

// Fetch function
async function fetchOeuvre(id) {
    try {
        const response = await fetch(`${API_URL}/oeuvres/${id}`)
        if (!response.ok) throw new Error('Erreur lors de la récupération')
        const data = await response.json()
        piece.value.title = data.titre || 'Titre non disponible'
        piece.value.image = data.image || placeholderImage
    } catch (error) {
        console.error('Erreur :', error)
        piece.value.title = 'Erreur de chargement'
        piece.value.image = placeholderImage
    }
}

// On mount, fetch based on query param
onMounted(() => {
    const id = route.query.oeuvreId
    if (id) {
        fetchOeuvre(id)
    } else {
        piece.value.title = 'Aucune œuvre spécifiée'
    }
})

// CSS classes
const wrapperClass = 'p-6 group'
const sectionTitleClass = 'text-xl text-center font-semibold mb-4'
const mainImageClass =
    'w-full h-full object-cover rounded transition group-hover:-translate-y-1 group-hover:shadow-xl'
</script>
