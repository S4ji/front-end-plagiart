<template>
    <div :class="gridClass">
        <template v-for="(image, index) in images" :key="index">
            <Image v-if="isArtGallery" :image="image" />
            <div v-else :class="wrapperClass">
                <router-link
                    :to="`/collection/${image[0].id}`"
                    class="block w-full h-full"
                >
                    <!-- Big image on left -->
                    <img
                        :src="image[0].src"
                        :alt="image[0].alt || 'Image 1'"
                        :class="bigImageClass"
                    />

                    <!-- Smaller images stacked on the right -->
                    <div :class="smallImagesWrapperClass">
                        <img
                            v-if="image[1]"
                            :src="image[1].src"
                            :alt="image[1].alt || 'Image 2'"
                            :class="smallImageClass + ' rounded-tr-lg'"
                        />
                        <img
                            v-if="image[2]"
                            :src="image[2].src"
                            :alt="image[2].alt || 'Image 3'"
                            :class="smallImageClass + ' rounded-br-lg'"
                        />
                    </div>
                </router-link>
            </div>
        </template>
    </div>
</template>

<script setup>
import Image from './Image.vue'

const props = defineProps({
    images: {
        type: Array,
        required: true,
    },
    isArtGallery: {
        type: Boolean,
        default: false,
    },
})

// Tailwind classes in variables
const gridClass = 'grid md:grid-cols-4 gap-5 '
const wrapperClass = 'group relative w-full aspect-square'
const bigImageClass =
    'absolute top-0 left-0 w-2/3 h-full object-cover rounded-l-lg transition-transform group-hover:scale-105'
const smallImagesWrapperClass =
    'absolute top-0 right-0 w-1/3 h-full flex flex-col gap-2'
const smallImageClass =
    'flex-1 object-cover transition-transform group-hover:scale-105'
</script>
