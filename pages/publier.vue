<template>
    <Container>
        <h2 class="text-center">Créez quelque chose !</h2>
        <ClientOnly>
            <FormSwitcher />
        </ClientOnly>
    </Container>
</template>

<script setup>
definePageMeta({
    layout: 'main',
})
</script>
