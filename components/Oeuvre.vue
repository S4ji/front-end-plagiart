<template>
    <div :class="wrapperClass">
        <!-- Full-width main image -->
        <div :class="sectionSpacing">
            <img
                :src="piece.image"
                :alt="piece.title"
                :class="mainImageClass"
            />
        </div>

        <!-- Buttons (Like + Signaler) side by side -->
        <div :class="buttonGroupClass">
            <Button :size="'md'" :class="likeButtonClass">Liker</Button>
            <Button :size="'md'" :class="reportButtonClass">Signaler</Button>
            <Button :size="'md'" :styleName="'primary'"
                >Ajouter à une collection
            </Button>
        </div>

        <!-- Related images gallery -->
        <div :class="sectionSpacing">
            <h2 :class="sectionTitleClass">Images associées</h2>
            <div :class="galleryGridClass">
                <div
                    v-for="(img, index) in relatedImages"
                    :key="index"
                    :class="galleryItemClass"
                >
                    <img
                        :src="img"
                        alt="Related piece"
                        :class="galleryImageClass"
                    />
                </div>
            </div>
        </div>

        <!-- Related collection section -->
        <div class="mt-12">
            <h2 :class="sectionTitleClass">Collections associées</h2>
            <!-- Replace this with your actual component -->
            <div :class="placeholderComponentClass">
                [ Galerie de collections associées ]
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

definePageMeta({
    layout: 'main',
})

// Data
const piece = ref({
    title: 'Titre de l’œuvre',
    image: 'https://www.w3schools.com/w3images/fjords.jpg',
})

const relatedImages = ref([
    'https://www.w3schools.com/w3images/fjords.jpg',
    'https://www.w3schools.com/w3images/fjords.jpg',
    'https://www.w3schools.com/w3images/fjords.jpg',
    'https://www.w3schools.com/w3images/fjords.jpg',
    'https://www.w3schools.com/w3images/fjords.jpg',
    'https://www.w3schools.com/w3images/fjords.jpg',
])

// Classes
const wrapperClass = 'p-6'
const sectionSpacing = 'mb-6'
const sectionTitleClass = 'text-xl font-semibold mb-4'
const mainImageClass = 'w-full h-[80vh] object-cover rounded-lg shadow-lg'
const buttonGroupClass = 'flex gap-4 mb-12'
const likeButtonClass =
    'bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition w-full sm:w-auto'
const reportButtonClass =
    'bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition w-full sm:w-auto'
const galleryGridClass = 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4'
const galleryItemClass =
    'border rounded-lg overflow-hidden shadow hover:shadow-md transition'
const galleryImageClass = 'w-full h-auto object-cover'
const placeholderComponentClass =
    'border border-dashed border-gray-300 p-6 rounded-lg text-gray-500 text-center'
</script>
