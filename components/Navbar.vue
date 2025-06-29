<template>
    <Container>
        <header
            class="flex flex-col lg:flex-row justify-between items-center my-5"
        >
            <!-- Logo -->
            <div class="flex w-full lg:w-auto items-center justify-between">
                <NuxtLink to="/" class="text-lg cursor-pointer">
                    <span class="font-bold">Plag</span><span>'iar</span
                    ><span>ist</span>
                </NuxtLink>
                <div class="block lg:hidden">
                    <button @click="open = !open" class="cursor-pointer">
                        ☰
                    </button>
                </div>
            </div>

            <!-- Barre de recherche -->
            <div class="flex justify-center items-center gap-5">
                <SearchBar v-model="searchTerm" :items="myArray" />
            </div>

            <!-- Navigation -->
            <nav
                :class="{ block: open, hidden: !open }"
                class="w-full lg:w-auto mt-2 lg:flex lg:mt-0"
            >
                <ul class="flex flex-col lg:flex-row lg:gap-3">
                    <li v-for="item in menuitems" :key="item.title">
                        <NuxtLink
                            v-if="!item.action"
                            :to="item.path"
                            class="flex lg:px-3 py-2 text-brown-600 hover:text-[#94775a] transition-colors duration-200"
                        >
                            {{ item.title }}
                        </NuxtLink>
                        <button
                            v-else
                            @click="handleClick(item)"
                            class="flex lg:px-3 py-2 text-brown-600 hover:text-[#94775a] transition-colors duration-200"
                        >
                            {{ item.title }}
                        </button>
                    </li>
                </ul>
            </nav>
        </header>
    </Container>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { userId, isLoggedIn, logout } = useAuth()

const open = ref(false)
const searchTerm = ref('')
const myArray = ['chat', 'chien', 'ours', 'loup', 'renard', 'Malabar']

const menuitems = computed(() => {
    const base = [{ title: 'Parcourir', path: '/parcourir' }]

    if (isLoggedIn.value) {
        base.push({ title: 'Publier', path: '/publier' })
        base.push({
            title: 'Profil',
            path: `/profile/${userId.value}`,
        })
        base.push({ title: 'Déconnexion', action: 'logout' })
    } else {
        base.push({ title: 'Inscription', path: '/inscription' })
        base.push({ title: 'Connexion', path: '/login' })
    }

    return base
})

function handleClick(item) {
    if (item.action === 'logout') {
        logout()
        router.push('/')
    }
}
</script>
