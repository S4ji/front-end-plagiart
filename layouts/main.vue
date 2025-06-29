<script setup>
import { useAuth } from '@/composables/useAuth'
const { isLoggedIn } = useAuth()
</script>

<template>
    <Navbarunlogged v-if="!isLoggedIn.value" />
    <Navbar v-else />
    <slot />
    <Footer />
</template>
