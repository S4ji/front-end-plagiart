<template>
    <div :class="'text-center'" @click="goToPage">
        Créer par <span :class="createdByClass">{{ name }}</span>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
    id: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
})

const router = useRouter()

// CSS classes via variables (Tailwind)
const createdByClass = `
  font-bold
  cursor-pointer 
  transition-colors 
  duration-200 
  text-amber-50 bg-black px-3 py-1 rounded hover:bg-slate-900
`

const goToPage = () => {
    // Naviguer vers la page avec l'id dans l'URL
    router.push({ name: 'profile-id', params: { id: props.id } })
}
</script>
