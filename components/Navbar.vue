<script setup>
import { ref, computed, watchEffect } from 'vue'
import { useAuth } from '@/composables/useAuth'

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
        window.location.href = '/'
    }
}
</script>

<template>
    <Container>
        <header
            class="flex flex-col lg:flex-row justify-between items-center my-5"
        >
            <div class="flex w-full lg:w-auto items-center justify-between">
                <a href="/" class="text-lg cursor-pointer">
                    <span class="font-bold">Plag</span><span>'iar</span
                    ><span>ist</span>
                </a>
                <div class="block lg:hidden">
                    <button @click="open = !open" class="cursor-pointer">
                        ☰
                    </button>
                </div>
            </div>

            <div class="flex justify-center items-center gap-5">
                <SearchBar v-model="searchTerm" :items="myArray" />
            </div>

            <nav
                :class="{ block: open, hidden: !open }"
                class="w-full lg:w-auto mt-2 lg:flex lg:mt-0"
            >
                <ul class="flex flex-col lg:flex-row lg:gap-3">
                    <li v-for="item in menuitems" :key="item.title">
                        <component
                            :is="item.action ? 'button' : 'a'"
                            :href="item.path"
                            @click="handleClick(item)"
                            class="flex lg:px-3 py-2 text-brown-600 hover:text-[#94775a] transition-colors duration-200"
                        >
                            {{ item.title }}
                        </component>
                    </li>
                </ul>
            </nav>
        </header>
    </Container>
</template>
