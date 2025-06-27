<template>
    <Container>
        <Searchsection>
            <template v-slot:title>Découvrez</template>
        </Searchsection>
        <ImageGallery
            :images="randomOeuvres"
            :isArtGallery="true"
        ></ImageGallery>
        <Searchsection>
            <template v-slot:title>Collections coup de coeur</template>
        </Searchsection>
        <ImageGallery :images="randomCollections"></ImageGallery>
    </Container>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const config = useRuntimeConfig()
const API_URL = config.public.API_BASE_URL

definePageMeta({
    layout: 'main',
})

const test = [
    {
        src: 'http://localhost:3300/image/view/oeuvreImage/A_black_image-1747639573677-347392599.avif',
        width: 500,
        height: 500,
    },
    {
        src: 'https://www.w3schools.com/w3images/newyork.jpg',
        width: 500,
        height: 500,
    },
    {
        src: 'https://www.w3schools.com/w3images/mountains.jpg',
        width: 500,
        height: 500,
    },
    {
        src: 'https://www.w3schools.com/w3images/snow.jpg',
        width: 500,
        height: 500,
    },
]

const randomOeuvres = ref([])
const randomCollections = ref([])

const fetchRandomOeuvres = async () => {
    try {
        const response = await fetch(`${API_URL}/oeuvres/random`)
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`)
        }
        const data = await response.json()
        console.log('data', data)
        return data
            .filter((item) => item.image !== null && item.image !== undefined)
            .map(({ id_oeuvre, image }) => ({
                id: id_oeuvre,
                src: image,
            }))
    } catch (error) {
        console.error('Error fetching oeuvres:', error)
        return []
    }
}

const fetchRandomCollections = async () => {
    try {
        const response = await fetch(`${API_URL}/collections/random`)
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`)
        }
        const data = await response.json()
        console.log('collections data', data)

        return data
            .filter(
                (item) =>
                    item.image &&
                    Array.isArray(item.image) &&
                    item.image.length > 0
            )
            .map((item) =>
                item.image.map((src, index) => ({
                    id: `${item.id_collection}`, // unique id for each image in the collection
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
    randomOeuvres.value = await fetchRandomOeuvres()
    randomCollections.value = await fetchRandomCollections()
})
</script>

<style></style>
