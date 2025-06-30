<template>
    <Container>
        <header :class="headerClass">
            <!-- Logo -->
            <div :class="logoContainerClass">
                <NuxtLink to="/" :class="logoClass">
                    <span class="font-bold">Plag</span><span>'iar</span
                    ><span>ist</span>
                </NuxtLink>
                <div :class="burgerVisibleClass">
                    <button @click="open = !open" :class="burgerButtonClass">
                        ☰
                    </button>
                </div>
            </div>

            <!-- Barre de recherche -->
            <div :class="searchContainerClass">
                <SearchBar v-model="searchTerm" :items="myArray" />
            </div>

            <!-- Navigation -->
            <nav :class="[navClass, { block: open, hidden: !open }]">
                <ul :class="navListClass">
                    <li v-for="item in menuitems" :key="item.title">
                        <NuxtLink
                            v-if="!item.action"
                            :to="item.path"
                            :class="navLinkClass"
                        >
                            {{ item.title }}
                        </NuxtLink>
                        <button
                            v-else
                            @click="handleClick(item)"
                            :class="navLinkClass"
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

// CSS classes centralisées
const headerClass =
    'flex flex-col lg:flex-row justify-between items-center my-5'
const logoContainerClass = 'flex w-full lg:w-auto items-center justify-between'
const logoClass = 'text-lg cursor-pointer'
const burgerVisibleClass = 'block lg:hidden'
const burgerButtonClass = 'cursor-pointer'
const searchContainerClass = 'flex justify-center items-center gap-5'
const navClass = 'w-full lg:w-auto mt-2 lg:flex lg:mt-0'
const navListClass = 'flex flex-col lg:flex-row lg:gap-3'
const navLinkClass =
    'flex lg:px-3 py-2 text-brown-600 hover:text-slate-300 transition-colors duration-200'

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
