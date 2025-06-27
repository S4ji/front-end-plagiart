<template>
    <Container>
        <div :class="containerClass">
            <!-- Menu de navigation du backoffice -->
            <div :class="menuWrapperClass">
                <Button
                    v-for="section in sectionList"
                    :key="section.id"
                    @click="selectedSection = section.id"
                    :size="'md'"
                    :styleName="
                        selectedSection === section.id ? 'primary' : 'outline'
                    "
                >
                    {{ section.label }}
                </Button>
            </div>

            <div>
                <!-- Signalements -->
                <div v-if="selectedSection === 'signalements'">
                    <h2>Signalements</h2>
                    <ul class="space-y-2">
                        <li
                            v-for="item in signalements"
                            :key="item.id"
                            class="flex items-center justify-between bg-gray-100 p-3 rounded"
                        >
                            <span>{{ item.message }} - {{ item.date }}</span>
                            <div class="flex gap-2">
                                <Button
                                    styleName="primary"
                                    size="md"
                                    @click="editItem('signalement', item.id)"
                                >
                                    Modifier
                                </Button>
                                <Button
                                    styleName="report"
                                    size="md"
                                    @click="deleteItem('signalement', item.id)"
                                >
                                    Supprimer
                                </Button>
                            </div>
                        </li>
                    </ul>
                </div>

                <!-- Utilisateurs -->
                <div v-else-if="selectedSection === 'utilisateurs'">
                    <h2>Utilisateurs</h2>
                    <ul class="space-y-2">
                        <li
                            v-for="user in utilisateurs"
                            :key="user.id"
                            class="flex items-center justify-between bg-gray-100 p-3 rounded"
                        >
                            <span>{{ user.name }} ({{ user.email }})</span>
                            <div class="flex gap-2">
                                <Button
                                    styleName="primary"
                                    size="md"
                                    @click="editItem('utilisateur', user.id)"
                                >
                                    Modifier
                                </Button>
                                <Button
                                    styleName="report"
                                    size="md"
                                    @click="deleteItem('utilisateur', user.id)"
                                >
                                    Supprimer
                                </Button>
                            </div>
                        </li>
                    </ul>
                </div>

                <!-- Oeuvres -->
                <div v-else-if="selectedSection === 'oeuvres'">
                    <h2>Oeuvres</h2>
                    <ul class="space-y-2">
                        <li
                            v-for="oeuvre in oeuvres"
                            :key="oeuvre.id"
                            class="flex items-center justify-between bg-gray-100 p-3 rounded"
                        >
                            <span
                                >{{ oeuvre.nom }} -
                                {{ oeuvre.nationalite }}</span
                            >
                            <div class="flex gap-2">
                                <Button
                                    styleName="primary"
                                    size="md"
                                    @click="editItem('oeuvre', oeuvre.id)"
                                >
                                    Modifier
                                </Button>
                                <Button
                                    styleName="report"
                                    size="md"
                                    @click="deleteItem('oeuvre', oeuvre.id)"
                                >
                                    Supprimer
                                </Button>
                            </div>
                        </li>
                    </ul>
                </div>

                <!-- Collections -->
                <div v-else-if="selectedSection === 'collections'">
                    <h2>Collections</h2>
                    <ul class="space-y-2">
                        <li
                            v-for="collection in collections"
                            :key="collection.id"
                            class="flex items-center justify-between bg-gray-100 p-3 rounded"
                        >
                            <span
                                >{{ collection.nom }} ({{
                                    collection.annee
                                }})</span
                            >
                            <div class="flex gap-2">
                                <Button
                                    styleName="primary"
                                    size="md"
                                    @click="
                                        editItem('collection', collection.id)
                                    "
                                >
                                    Modifier
                                </Button>
                                <Button
                                    styleName="report"
                                    size="md"
                                    @click="
                                        deleteItem('collection', collection.id)
                                    "
                                >
                                    Supprimer
                                </Button>
                            </div>
                        </li>
                    </ul>
                </div>

                <!-- État vide -->
                <p v-else :class="emptyStateClass">
                    Choisissez une section à afficher.
                </p>
            </div>
        </div>
    </Container>
</template>

<script setup>
import { ref } from 'vue'
import Button from '@/components/Button.vue'

const selectedSection = ref(null)

const sectionList = [
    { id: 'signalements', label: 'Signalements' },
    { id: 'utilisateurs', label: 'Utilisateurs' },
    { id: 'oeuvres', label: 'Oeuvres' },
    { id: 'collections', label: 'Collections' },
]

// Données fictives
const signalements = ref([
    { id: 1, message: 'Contenu inapproprié', date: '2025-05-10' },
    { id: 2, message: 'Spam détecté', date: '2025-05-12' },
])

const utilisateurs = ref([
    { id: 1, name: 'Jean Dupont', email: 'jean@example.com' },
    { id: 2, name: 'Marie Curie', email: 'marie@example.com' },
])

const oeuvres = ref([
    { id: 1, nom: 'Claude Monet', nationalite: 'Française' },
    { id: 2, nom: 'Frida Kahlo', nationalite: 'Mexicaine' },
])

const collections = ref([
    { id: 1, nom: 'Impressionnisme', annee: 1874 },
    { id: 2, nom: 'Surréalisme', annee: 1924 },
])

const containerClass = 'my-8'
const menuWrapperClass = 'flex justify-center gap-4 mb-6'
const emptyStateClass = 'text-center text-gray-500'

// Gestion des événements pour Modifier et Supprimer
const editItem = (type, id) => {
    console.log(`Modifier ${type} avec l'ID: ${id}`)
    // Ajoutez la logique de modification ici (ex. rediriger vers un formulaire d'édition)
}

const deleteItem = (type, id) => {
    console.log(`Supprimer ${type} avec l'ID: ${id}`)
    // Ajoutez la logique de suppression ici (ex. appeler une API pour supprimer l'élément)
}
</script>
