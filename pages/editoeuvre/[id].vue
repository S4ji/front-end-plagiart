<template>
    <Container>
        <ClientOnly>
            <div :class="sectionSpacing">
                <div :class="gridWrapperClass">
                    <!-- Image à gauche -->
                    <div :class="imageContainerClass">
                        <Image
                            v-if="loaded && oeuvreData?.image"
                            :image="{
                                id: oeuvreData.id_oeuvre,
                                src: oeuvreData.image,
                                alt: oeuvreData.titre,
                            }"
                            :showAddButton="false"
                            :class="imageClass"
                        />
                    </div>

                    <!-- Formulaire à droite -->
                    <div :class="formContainerClass">
                        <div
                            v-if="loaded && oeuvreData"
                            :class="formWrapperClass"
                        >
                            <FormsOeuvre
                                :initialOeuvre="oeuvreData"
                                :isEditing="true"
                                @delete="handleDelete"
                            />
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
import Image from '~/components/Image.vue'

const config = useRuntimeConfig()
const API_URL = config.public.API_BASE_URL

definePageMeta({
    layout: 'main',
})

const route = useRoute()
const router = useRouter()

const oeuvreId = route.params.id
const oeuvreData = ref(null)
const loaded = ref(false)

async function fetchOeuvre(id) {
    try {
        const res = await fetch(`${API_URL}/oeuvres/${id}`)
        if (!res.ok) throw new Error('Erreur fetch oeuvre')
        const data = await res.json()

        oeuvreData.value = {
            id_oeuvre: data.id_oeuvre,
            titre: data.titre,
            description: data.description,
            image: data.image,
            ai_prompt: data.ai_prompt || '',
            categorie: data.categories
                ? data.categories.map((c) => c.categorie.nom)
                : [],
        }

        loaded.value = true
    } catch (e) {
        console.error('Erreur lors du chargement de l’œuvre :', e)
        oeuvreData.value = null
        loaded.value = true
    }
}

const handleDelete = async () => {
    if (!confirm('Voulez-vous vraiment supprimer cette œuvre ?')) return

    try {
        const res = await fetch(
            `${API_URL}/oeuvres/${oeuvreData.value.id_oeuvre}`,
            { method: 'DELETE' }
        )
        if (!res.ok) throw new Error('Erreur suppression œuvre')
        alert('Œuvre supprimée avec succès 🗑️')
        router.push('/publier')
    } catch (e) {
        console.error(e)
        alert('Erreur lors de la suppression.')
    }
}

onMounted(() => {
    if (oeuvreId) fetchOeuvre(oeuvreId)
})

// 💄 STYLES
const sectionSpacing = 'my-8 px-4'
const gridWrapperClass = 'grid grid-cols-1 md:grid-cols-2 gap-8 items-center'
const imageContainerClass = 'flex justify-center items-center h-full'
const imageClass = 'block max-w-full max-h-[80vh] object-contain rounded-lg'
const formContainerClass = 'relative'
const formWrapperClass = 'relative border p-4 rounded'
const titleClass = 'text-xl font-bold mb-6'
const deleteButtonClass =
    'absolute top-2 right-2 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700'
const loadingClass = 'text-center text-gray-500'
const errorClass = 'text-center text-red-500'
</script>
