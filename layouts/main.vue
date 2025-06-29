<script setup>
import { useAuth } from '@/composables/useAuth'

// Importation du composable d’authentification
const { isLoggedIn } = useAuth()
</script>

<template>
    <Navbarunlogged v-if="!isLoggedIn.value" />
    <Navbar v-else />

    <slot />

    <Footer />
</template>
