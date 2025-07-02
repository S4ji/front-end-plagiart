<template>
    <footer class="my-20">
        <p class="text-center text-sm text-slate-500">
            Copyright © {{ new Date().getFullYear() }} Plagi'arism
        </p>

        <p v-if="isLoggedIn" class="text-gray-700">
            Bonjour, {{ userName || 'Utilisateur' }}
        </p>
    </footer>
</template>
<script setup>
import { useAuth } from '@/composables/useAuth'

const { userName, isLoggedIn } = useAuth()
</script>
