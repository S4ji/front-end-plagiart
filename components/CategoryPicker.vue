<template>
    <div>
        <input
            v-model="newCategory"
            @keyup.enter.prevent="addCategory"
            type="text"
            placeholder="Ajouter une catégorie"
            class="border px-2 py-1 text-sm rounded w-full mb-2"
        />

        <Button type="button" @click="addCategory" :style="'primary'">
            Ajouter
        </Button>

        <div class="flex flex-wrap gap-2">
            <span
                v-for="(cat, i) in selectedCategories"
                :key="i"
                class="bg-gray-200 text-black-700 px-3 py-1 rounded flex items-center gap-2 text-xs"
            >
                {{ cat }}
                <button
                    type="button"
                    @click="removeCategory(cat)"
                    class="text-red-500 hover:text-red-700"
                >
                    &times;
                </button>
            </span>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
    modelValue: Array,
})
const emit = defineEmits(['update:modelValue'])

const newCategory = ref('')
const selectedCategories = ref([...(props.modelValue || [])])

watch(
    () => props.modelValue,
    (val) => {
        selectedCategories.value = [...val]
    }
)

function addCategory() {
    const trimmed = newCategory.value.trim()
    if (!trimmed) return

    if (!selectedCategories.value.includes(trimmed)) {
        selectedCategories.value.push(trimmed)
        emit('update:modelValue', [...selectedCategories.value])
    }
    newCategory.value = ''
}

function removeCategory(cat) {
    selectedCategories.value = selectedCategories.value.filter((c) => c !== cat)
    emit('update:modelValue', [...selectedCategories.value])
}
</script>

<style scoped>
/* styles optionnels */
</style>
