<template>
    <div>
        <form @submit.prevent="handleSubmit">
            <label>
                Nom:
                <input type="text" v-model="formData.nom" required />
            </label>
            <label>
                ID Parent:
                <input type="number" v-model="formData.idParent" />
            </label>
            <label>
                Path:
                <input type="text" v-model="formData.path" />
            </label>
            <Button type="submit" block styleName="primary">
                Créer la catégorie
            </Button>
        </form>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const formData = ref({
    nom: '',
    idParent: null,
    path: '',
})

const handleSubmit = () => {
    console.log(formData.value)
}
</script>

<style scoped></style>
