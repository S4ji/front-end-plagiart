<template>
    <div class="relative w-full md:w-[600px]" ref="dropdownRef">
        <div class="flex gap-2">
            <input
                class="flex-grow border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                @focus="showOptions = true"
                type="text"
                v-model="filterText"
            />
            <Button @click="onSearch">Recherche</Button>
        </div>

        <div v-if="isLoading" class="mt-2 text-sm text-gray-500">
            Chargement...
        </div>

        <ul
            v-if="showOptions"
            class="absolute w-full bg-white border border-gray-300 z-10 max-h-[150px] overflow-y-auto shadow"
        >
            <li
                v-for="(item, index) in filteredItems"
                :key="index"
                class="p-2 cursor-pointer hover:bg-gray-100"
                @click="selectItem(item)"
            >
                {{ item }}
            </li>
        </ul>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSearchStore } from '@/stores/searchStore.js'

const props = defineProps({
    items: Array,
    modelValue: String,
    isLoading: Boolean,
})

// Initialise l'input avec la valeur de placeholder.
// Cela ne se met pas à jour automatiquement avec props.modelValue après initialisation.
const filterText = ref(props.modelValue)
const showOptions = ref(false)
const dropdownRef = ref(null)
const store = useSearchStore()
const router = useRouter()

// Permet à Vue de savoir qu'on veut update la valeur d'un v-model
// emit('update:modelValue', ...) permet de notifier tout changement du v-model
const emit = defineEmits(['update:modelValue'])

// Au clic, on attribue la valeur sélectionnée à filterText
// Et on notifie le parent via emit car v-model ne peut pas être directement assigné
const selectItem = (item) => {
    filterText.value = item
    emit('update:modelValue', item)
    showOptions.value = false
}

// Filtrage dynamique avec une RegExp insensible à la casse
const filteredItems = computed(() => {
    const regex = new RegExp(filterText.value, 'i')
    return props.items.filter((item) => item.match(regex))
})

// Ferme la dropdown si on clique en dehors
const handleClickOutside = (event) => {
    if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
        showOptions.value = false
    }
}

const onSearch = async () => {
    const q = filterText.value.trim()

    if (!q) {
        alert('Veuillez entrer un mot-clé.')
        return
    }

    store.setQuery(q) // Save query to store

    alert(`Recherche en cours pour : "${store.query}"`) // Uses store.query

    await router.push('/searchpage')
}

onMounted(() => {
    document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
})
</script>
