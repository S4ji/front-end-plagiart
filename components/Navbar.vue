<template>
    <Container>
        <header :class="headerClass">
            <!-- Logo & Burger -->
            <div :class="logoWrapperClass">
                <a href="/" :class="logoLinkClass">
                    <span class="font-bold">Plag</span><span>'iar</span
                    ><span>ist</span>
                </a>
                <div :class="navToggleClass">
                    <button @click="open = !open" :class="burgerButtonClass">
                        ☰
                    </button>
                </div>
            </div>

            <!-- Barre de recherche -->
            <div class="flex justify-center items-center gap-5">
                <SearchBar v-model="searchTerm" :items="myArray" />
            </div>

            <!-- Navigation -->
            <nav :class="[open ? 'block' : 'hidden', navWrapperClass]">
                <ul :class="navListClass">
                    <li
                        v-for="item in menuitems"
                        :key="item.title"
                        class="relative"
                        @mouseenter="openDropdown = item.title"
                        @mouseleave="openDropdown = null"
                    >
                        <a :href="item.path" :class="navItemLinkClass">{{
                            item.title
                        }}</a>

                        <!-- Dropdown niveau 1 -->
                        <ul
                            v-if="item.children && openDropdown === item.title"
                            :class="dropdownClass"
                        >
                            <li
                                v-for="child in item.children"
                                :key="child.title"
                                class="relative"
                                @mouseenter="openSubDropdown = child.title"
                                @mouseleave="openSubDropdown = null"
                            >
                                <!-- "Is button" check: if child.title === 'Déconnexion' -->
                                <component
                                    :is="
                                        child.title === 'Déconnexion'
                                            ? 'button'
                                            : 'a'
                                    "
                                    :href="
                                        child.title !== 'Déconnexion'
                                            ? child.path
                                            : null
                                    "
                                    :class="dropdownLinkClass"
                                    @click="
                                        child.title === 'Déconnexion' &&
                                            handleAction(child)
                                    "
                                >
                                    {{ child.title }}
                                </component>

                                <!-- Dropdown niveau 2 -->
                                <ul
                                    v-if="
                                        child.children &&
                                        openSubDropdown === child.title
                                    "
                                    :class="subDropdownClass"
                                >
                                    <li
                                        v-for="subChild in child.children"
                                        :key="subChild.title"
                                    >
                                        <a
                                            :href="subChild.path"
                                            :class="subDropdownLinkClass"
                                        >
                                            {{ subChild.title }}
                                        </a>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </li>
                </ul>
            </nav>
        </header>
    </Container>
</template>
<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuth } from '@/composables/useAuth'

const { userId, logout } = useAuth()

// Champs de recherche
const searchTerm = ref('')

// Burger menu
const open = ref(false)

// Dropdowns
const openDropdown = ref(null)
const openSubDropdown = ref(null)

// ID utilisateur chargé côté client

onMounted(() => {})

// Menu dynamique avec lien profil utilisant userId
const menuitems = computed(() => [
    {
        title: 'Parcourir',
        path: '/searchpage',
    },
    {
        title: 'Publier',
        path: '/publier',
    },
    {
        title: 'Profil',
        path: '/userprofileedit',
        children: [
            ...(userId.value
                ? [
                      {
                          title: 'Mes Informations',
                          path: `/profile/${userId.value}`,
                      },
                  ]
                : []),
            { title: 'Déconnexion', path: '/' },
        ],
    },
])

// Données pour le champ de recherche
const myArray = ['chat', 'chien', 'ours', 'loup', 'renard', 'Malabar']

// Déconnexion
const handleAction = (item) => {
    if (item.title === 'Déconnexion') {
        localStorage.clear()
        window.location.href = '/'
    }
}

// 💡 Shared base classes
const textHoverBase = 'transition-colors duration-200 cursor-pointer'
const dropdownContainer = 'absolute bg-white border rounded shadow-md z-10'

// 📦 Final classes
const headerClass =
    'flex flex-col lg:flex-row justify-between items-center my-5'
const logoWrapperClass = 'flex w-full lg:w-auto items-center justify-between'
const logoLinkClass = 'text-lg cursor-pointer'
const navToggleClass = 'block lg:hidden'
const burgerButtonClass = 'cursor-pointer'

const navWrapperClass = 'w-full lg:w-auto mt-2 lg:flex lg:mt-0'
const navListClass = 'flex flex-col lg:flex-row lg:gap-3'
const navItemLinkClass = `flex lg:px-3 py-2 text-brown-600 hover:text-brown-900 hover:text-gray-300 rounded ${textHoverBase}`

const dropdownClass = `${dropdownContainer} left-0 top-full lg:min-w-[200px]`
const dropdownLinkClass = `block px-4 py-2 text-brown-600 hover:text-[#94775a] hover:bg-brown-600 ${textHoverBase}`

const subDropdownClass = `${dropdownContainer} left-full top-0 lg:min-w-[200px]`
const subDropdownLinkClass = `block px-4 py-2 text-brown-600 hover:text-white hover:bg-brown-600 ${textHoverBase}`
</script>
