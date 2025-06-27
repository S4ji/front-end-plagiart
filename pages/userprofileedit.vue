<template>
    <Container>
        <h2 class="text-center">Back Office</h2>
        <ClientOnly>
            <FormsUtilisateurUpdateForm />
        </ClientOnly>
    </Container>
</template>

<script setup>
definePageMeta({
    layout: 'main',
})
</script>
