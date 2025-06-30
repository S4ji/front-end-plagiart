<template>
    <Container>
        <div class="my-8">
            <div class="flex justify-center gap-4 mb-6">
                <Button
                    v-for="option in resultTypes"
                    :key="option.id"
                    @click="selectedType = option.id"
                    :size="'md'"
                    :styleName="
                        selectedType === option.id ? 'primary' : 'outline'
                    "
                >
                    {{ option.label }}
                </Button>
            </div>

            <div v-if="selectedType === 'oeuvre'">
                <Searchsection v-if="oeuvres.length">
                    <template #title>Œuvres</template>
                    <ImageGallery :images="oeuvres" :isArtGallery="true" />
                </Searchsection>
                <p v-else class="text-center text-gray-500">
                    Aucune œuvre trouvée.
                </p>
            </div>

            <div v-if="selectedType === 'collection'">
                <Searchsection v-if="collections.length">
                    <template #title>Collections</template>
                    <ImageGallery :images="collections" />
                </Searchsection>
                <p v-else class="text-center text-gray-500">
                    Aucune collection trouvée.
                </p>
            </div>
        </div>
    </Container>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
    oeuvres: { type: Array, default: () => [] },
    collections: { type: Array, default: () => [] },
})

const selectedType = ref('oeuvre')
const resultTypes = [
    { id: 'oeuvre', label: 'Œuvres' },
    { id: 'collection', label: 'Collections' },
]
</script>
