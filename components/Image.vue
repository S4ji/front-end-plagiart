<template>
    <div :class="wrapperClass">
        <router-link :to="`/oeuvre/${image.id}`" class="block w-full h-full">
            <img
                :src="image.src"
                :alt="image.alt || 'Gallery image'"
                :class="imageClass"
            />
        </router-link>

        <div :class="overlayClass">
            <!-- Bouton édition -->
            <button
                v-if="isEditable && isOwner"
                :class="iconButtonClass"
                @click.stop="handleEdit"
                title="Modifier l'œuvre"
            >
                ✏️
            </button>

            <!-- Bouton suppression -->
            <button
                v-else-if="isRemovable && isOwner"
                :class="iconButtonClass"
                @click.stop="handleRemove"
                title="Retirer de la collection"
            >
                <span class="text-xl font-bold">-</span>
            </button>

            <!-- Bouton ajout -->
            <button
                v-else-if="showAddButton"
                :class="iconButtonClass"
                @click.stop="handleAdd"
                title="Ajouter à la collection"
            >
                <span class="text-xl font-bold">+</span>
            </button>
        </div>

        <Collectionpopup ref="collectionPopup" />
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const { userId, logout } = useAuth()

const currentUserId = userId
const isOwner = computed(() => {
    return userId.value === props.ownerId
})
const props = defineProps({
    image: Object,
    isRemovable: Boolean,
    isEditable: Boolean,
    onRemove: Function,
    onEdit: Function,
    ownerId: String,
    showAddButton: {
        type: Boolean,
        default: true,
    },
})

const router = useRouter()
const collectionPopup = ref(null)

const wrapperClass = 'group relative w-full aspect-square'
const imageClass =
    'w-full h-full object-cover rounded transition group-hover:-translate-y-1 group-hover:shadow-xl'
const overlayClass =
    'absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10'
const iconButtonClass =
    'bg-white/80 hover:bg-white rounded-full p-1 shadow transition'

function handleRemove() {
    props.onRemove?.(props.image.id)
}

function handleEdit() {
    if (props.onEdit) {
        props.onEdit(props.image.id)
    } else {
        router.push(`/editoeuvre/${props.image.id}`)
    }
}

function handleAdd() {
    collectionPopup.value?.show(props.image.id)
}
</script>
