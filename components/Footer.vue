<template>
    <footer class="my-20">
        <p :class="footerTextClass">
            Copyright © {{ new Date().getFullYear() }} Plagi'arism
        </p>

        <p v-if="isLoggedIn" :class="footerTextClass">
            Bonjour, {{ userName || 'Utilisateur' }}
        </p>
    </footer>
</template>

<script setup>
import { useAuth } from '@/composables/useAuth'

const { userName, isLoggedIn } = useAuth()

const footerTextClass = 'text-center text-sm text-slate-500'
</script>
