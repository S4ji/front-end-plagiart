<template>
    <div v-if="isVisible" :class="overlayClass" @click.self="hide">
        <div :class="popupClass">
            <h3 :class="titleClass">Your Collections</h3>

            <ul :class="listClass">
                <li
                    v-for="collection in collections"
                    :key="collection.id_collection"
                    :class="
                        listItemClass +
                        ' cursor-pointer hover:text-blue-600 transition'
                    "
                    @click="onCollectionClick(collection)"
                >
                    {{ collection.nom }}
                </li>
            </ul>

            <div :class="formGroupClass">
                <input
                    v-model="newCollection"
                    type="text"
                    placeholder="New collection"
                    :class="inputClass"
                    @keyup.enter="addCollection"
                />
                <button @click="addCollection" :class="buttonClass">Add</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useCollectionStore } from '@/stores/collection'
import { useAuth } from '@/composables/useAuth'

const { userId, logout } = useAuth()
const isVisible = ref(false)
const newCollection = ref('')
const currentOeuvreId = ref(null)

const collectionStore = useCollectionStore()

// Computed to unwrap the reactive collections ref from store
const collections = computed(() => collectionStore.collections)

const config = useRuntimeConfig()
const API_URL = config.public.API_BASE_URL

// Fetch collections from API and update store
async function fetchCollectionsByUser() {
    if (!userId) {
        console.error('User ID not found in localStorage')
        return
    }

    try {
        const res = await fetch(`${API_URL}/collections/user/${userId}`)
        if (!res.ok) throw new Error('Failed to fetch collections')
        const data = await res.json()
        collectionStore.setCollections(data) // update store here!
    } catch (err) {
        console.error('Error fetching collections by user:', err)
    }
}

function show(oeuvreId) {
    currentOeuvreId.value = oeuvreId
    isVisible.value = true
    fetchCollectionsByUser()
}

function hide() {
    isVisible.value = false
    currentOeuvreId.value = null
    newCollection.value = ''
    collectionStore.clearCollections() // clear collections from store on hide
}

async function addCollection() {
    const trimmed = newCollection.value.trim()
    if (!trimmed) return

    if (!userId) {
        console.error('User ID not found in localStorage')
        return
    }

    const payload = {
        nom: trimmed,
        description: '', // ou tu peux permettre une saisie de description
        id_utilisateur: userId,
    }

    try {
        const res = await fetch(`${API_URL}/collections/new`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error('Failed to create collection')

        await fetchCollectionsByUser()
        newCollection.value = ''
    } catch (err) {
        console.error('Error adding collection:', err)
    }
}

async function onCollectionClick(collection) {
    if (!currentOeuvreId.value) {
        console.error('No oeuvre ID available!')
        return
    }

    try {
        const res = await fetch(`${API_URL}/collections/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id_oeuvre: currentOeuvreId.value,
                id_collection: collection.id_collection,
            }),
        })
        if (!res.ok) throw new Error('Failed to add to collection')

        // Notify to refresh collection data elsewhere
        collectionStore.notifyRefresh()

        console.log('Oeuvre added to collection:', collection.nom)
        hide()
    } catch (error) {
        console.error('Error adding to collection:', error)
    }
}

defineExpose({ show })

// Tailwind classes
const overlayClass =
    'fixed inset-0 bg-black/40 flex items-center justify-center z-50'
const popupClass = 'bg-white w-full max-w-sm p-4 rounded-xl shadow-xl'
const titleClass = 'text-lg font-semibold mb-4'
const listClass = 'space-y-1 text-sm mb-4 max-h-48 overflow-y-auto'
const listItemClass = 'border-b pb-1'
const formGroupClass = 'flex gap-2'
const inputClass = 'border px-2 py-1 text-sm rounded w-full'
const buttonClass =
    'bg-blue-600 text-white px-3 py-1 rounded text-sm cursor-pointer'
</script>
