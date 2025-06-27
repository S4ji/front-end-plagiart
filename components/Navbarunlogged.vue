<script setup>
import { ref } from 'vue'

const open = ref(false)
const openDropdown = ref(null)
const openSubDropdown = ref(null)

const menuitems = [
    {
        title: 'Parcourir',
        path: '/parcourir',
    },
    {
        title: 'Inscription',
        path: '/inscription',
    },
    {
        title: 'Connexion',
        path: '/login',
    },
]

const myArray = ['chat', 'chien', 'ours', 'loup', 'renard', 'Malabar']
</script>

<template>
    <Container>
        <header
            class="flex flex-col lg:flex-row justify-between items-center my-5"
        >
            <!-- Logo & Burger -->
            <div class="flex w-full lg:w-auto items-center justify-between">
                <a href="/" class="text-lg cursor-pointer">
                    <span class="font-bold">Plag</span>
                    <span class="">'iar</span>
                    <span class="">ist</span>
                </a>
                <div class="block lg:hidden">
                    <button @click="open = !open" class="cursor-pointer">
                        ☰
                    </button>
                </div>
            </div>

            <!-- Navigation -->
            <div class="flex justify-center items-center gap-5">
                <SearchBar v-model="searchTerm" :items="myArray" />
            </div>

            <nav
                :class="{ block: open, hidden: !open }"
                class="w-full lg:w-auto mt-2 lg:flex lg:mt-0"
            >
                <ul class="flex flex-col lg:flex-row lg:gap-3">
                    <li
                        v-for="item in menuitems"
                        :key="item.title"
                        class="relative"
                        @mouseenter="openDropdown = item.title"
                        @mouseleave="openDropdown = null"
                    >
                        <a
                            :href="item.path"
                            class="flex lg:px-3 py-2 text-brown-600 hover:text-brown-900 hover:text-[#94775a] rounded cursor-pointer transition-colors duration-200"
                        >
                            {{ item.title }}
                        </a>

                        <!-- First-Level Dropdown -->
                        <ul
                            v-if="item.children && openDropdown === item.title"
                            class="absolute left-0 top-full bg-white border rounded shadow-md z-10 lg:min-w-[200px]"
                        >
                            <li
                                v-for="child in item.children"
                                :key="child.title"
                                class="relative"
                                @mouseenter="openSubDropdown = child.title"
                                @mouseleave="openSubDropdown = null"
                            >
                                <a
                                    :href="child.path"
                                    class="block px-4 py-2 text-brown-600 hover:text-[#94775a] hover:bg-brown-600 cursor-pointer transition-colors duration-200"
                                >
                                    {{ child.title }}
                                </a>

                                <!-- Second-Level Dropdown -->
                                <ul
                                    v-if="
                                        child.children &&
                                        openSubDropdown === child.title
                                    "
                                    class="absolute left-full top-0 bg-white border rounded shadow-md z-10 lg:min-w-[200px]"
                                >
                                    <li
                                        v-for="subChild in child.children"
                                        :key="subChild.title"
                                    >
                                        <a
                                            :href="subChild.path"
                                            class="block px-4 py-2 text-brown-600 hover:text-white hover:bg-brown-600 cursor-pointer transition-colors duration-200"
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
