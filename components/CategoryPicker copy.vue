<template>
    <div>
        <!-- Trigger Box -->
        <div @click="show" :class="triggerClass">
            <span v-if="selectedCategories.length === 0" class="text-gray-400">
                Choisir des catégories...
            </span>
            <div class="flex flex-wrap gap-1">
                <span
                    v-for="(cat, i) in selectedCategories"
                    :key="i"
                    class="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs flex items-center gap-1"
                >
                    {{ cat.nom }}
                    <button
                        @click.stop="removeCategory(cat)"
                        class="text-red-500 hover:text-red-700"
                    >
                        &times;
                    </button>
                </span>
            </div>
        </div>

        <!-- Modal -->
        <div v-if="isVisible" :class="overlayClass" @click.self="hide">
            <div :class="popupClass">
                <h3 :class="titleClass">Catégories</h3>

                <input
                    v-model="filterText"
                    type="text"
                    placeholder="Ajouter une catégorie"
                    :class="inputClass"
                    @keyup.enter="handleEnter"
                    autofocus
                />

                <ul :class="listClass">
                    <li
                        v-for="(c, i) in filteredCategories"
                        :key="i"
                        :class="[
                            listItemClass,
                            selectedCategories.some(
                                (sc) => sc.id_categorie === c.id_categorie
                            )
                                ? 'text-blue-600 font-semibold'
                                : '',
                        ]"
                        @click="toggleCategory(c)"
                    >
                        {{ c.nom }}
                    </li>

                    <li
                        v-if="
                            filteredCategories.length === 0 &&
                            filterText.trim() !== ''
                        "
                        class="p-2 text-gray-500 italic cursor-pointer hover:bg-gray-100"
                        @click="addCategory"
                    >
                        Aucun résultat. Cliquer pour créer :
                        <strong>{{ filterText }}</strong>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, watch, computed, onMounted } from 'vue'

const props = defineProps({
    modelValue: Array,
})
const emit = defineEmits(['update:modelValue'])

const config = useRuntimeConfig()
const API_URL = config.public.API_BASE_URL

const isVisible = ref(false)
const filterText = ref('')
const allCategories = ref([]) // Fetched categories
const selectedCategories = ref([])

// Fetch categories from API on mount
onMounted(async () => {
    try {
        const res = await fetch(`${API_URL}/categories/all`)
        const data = await res.json()
        allCategories.value = data
        syncSelectedFromModelValue()
    } catch (err) {
        console.error('Error fetching categories:', err)
    }
})

watch(
    () => props.modelValue,
    () => syncSelectedFromModelValue()
)

function syncSelectedFromModelValue() {
    if (!Array.isArray(props.modelValue)) return
    selectedCategories.value = allCategories.value.filter((cat) =>
        props.modelValue.includes(cat.id_categorie)
    )
}

const filteredCategories = computed(() => {
    const term = filterText.value.trim().toLowerCase()
    if (!term) return allCategories.value
    return allCategories.value.filter((cat) =>
        cat.nom.toLowerCase().includes(term)
    )
})

function show() {
    isVisible.value = true
    filterText.value = ''
}
function hide() {
    isVisible.value = false
    filterText.value = ''
}

function toggleCategory(cat) {
    const exists = selectedCategories.value.some(
        (c) => c.id_categorie === cat.id_categorie
    )
    if (exists) {
        selectedCategories.value = selectedCategories.value.filter(
            (c) => c.id_categorie !== cat.id_categorie
        )
    } else {
        selectedCategories.value.push(cat)
    }
    emit(
        'update:modelValue',
        selectedCategories.value.map((c) => c.id_categorie)
    )
}

function removeCategory(cat) {
    selectedCategories.value = selectedCategories.value.filter(
        (c) => c.id_categorie !== cat.id_categorie
    )
    emit(
        'update:modelValue',
        selectedCategories.value.map((c) => c.id_categorie)
    )
}

function handleEnter() {
    if (
        filteredCategories.value.length === 0 &&
        filterText.value.trim() !== ''
    ) {
        addCategory()
    }
}

async function addCategory() {
    const trimmed = filterText.value.trim()
    if (!trimmed) return

    const exists = allCategories.value.some(
        (cat) => cat.nom.toLowerCase() === trimmed.toLowerCase()
    )
    if (exists) {
        alert('Cette catégorie existe déjà.')
        return
    }

    // Post new category to the backend
    try {
        const res = await fetch(`${API_URL}/categories/new`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nom: trimmed }),
        })

        if (!res.ok)
            throw new Error('Erreur lors de la création de la catégorie.')

        const newCategory = await res.json()
        allCategories.value.push(newCategory)
        selectedCategories.value.push(newCategory)
        emit(
            'update:modelValue',
            selectedCategories.value.map((c) => c.id_categorie)
        )
        filterText.value = ''
    } catch (error) {
        console.error(error)
        alert('Erreur réseau.')
    }
}
</script>

<style scoped>
/* same styles as before */
</style>
