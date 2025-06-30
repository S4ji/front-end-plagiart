<template>
    <Container>
        <h2 class="text-center pb-8">Explorez</h2>

        <div v-if="isLoading" class="text-center text-gray-500 mt-8">
            Chargement des résultats...
        </div>
        <ImageGallery v-else :images="oeuvres" :isArtGallery="true" />
        <div
            v-if="hasMore && !isLoading"
            v-intersect="onIntersect"
            class="h-4"
        ></div>
    </Container>
</template>

<script setup>
definePageMeta({
    layout: 'main',
})
import { ref, watch, getCurrentInstance } from 'vue'
import { useSearchStore } from '@/stores/searchStore.js'

const config = useRuntimeConfig()
const API_URL = config.public.API_BASE_URL

const store = useSearchStore()
const oeuvres = ref([])
const isLoading = ref(false)
const page = ref(1)
const hasMore = ref(true)
const pageSize = 20

const fetchOeuvres = async (pageNum) => {
    if (!store.query) return []

    const res = await fetch(`${API_URL}/oeuvres/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            q: store.query,
            page: pageNum,
            limit: pageSize,
        }),
    })
    if (!res.ok) {
        console.error('HTTP error', res.status)
        return []
    }
    const data = await res.json()
    console.log(
        `Requête envoyée à l’API — Page: ${pageNum}, Query: ${store.query}`
    )

    return data
        .filter((item) => item.image)
        .map(({ id_oeuvre, image }) => ({
            id: id_oeuvre,
            src: image,
        }))
}

const loadMore = async () => {
    if (isLoading.value || !store.query || !hasMore.value) return
    isLoading.value = true

    try {
        const newResults = await fetchOeuvres(page.value)
        if (newResults.length < pageSize) {
            hasMore.value = false
        }
        oeuvres.value.push(...newResults)
        page.value++
    } catch (err) {
        console.error('Load error:', err)
        hasMore.value = false
    } finally {
        isLoading.value = false
    }
}

const onIntersect = ([entry]) => {
    if (entry.isIntersecting) {
        loadMore()
    }
}

store.initQuery()

watch(
    () => store.query,
    async () => {
        oeuvres.value = []
        page.value = 1
        hasMore.value = true
        await loadMore()
    },
    { immediate: true }
)

const instance = getCurrentInstance()

instance.appContext.app.directive('intersect', {
    mounted(el, binding) {
        const observer = new IntersectionObserver(binding.value, {
            rootMargin: '200px',
        })
        observer.observe(el)

        el._observer = observer
    },
    unmounted(el) {
        if (el._observer) {
            el._observer.disconnect()
            delete el._observer
        }
    },
})
</script>
