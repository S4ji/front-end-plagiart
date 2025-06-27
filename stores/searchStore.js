import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSearchStore = defineStore('search', () => {
    const query = ref('')

    function setQuery(newQuery) {
        query.value = newQuery
    }

    function initQuery() {
        if (!query.value.trim()) {
            query.value = ' '
        }
    }

    return {
        query,
        setQuery,
        initQuery,
    }
})
