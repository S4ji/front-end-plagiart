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
                            v-for="signalement in signalements"
                            :key="signalement.id_signalement"
                            class="flex items-center justify-between bg-gray-100 p-3 rounded"
                        >
                            <span>
                                Signalé par utilisateur ID:
                                {{ signalement.id_utilisateur }} pour l'œuvre
                                ID: {{ signalement.id_oeuvre }}<br />
                                Raison: {{ signalement.raison }}<br />
                                Statut:
                                <select
                                    v-model="signalement.statut"
                                    class="p-2 rounded border"
                                    @change="
                                        updateSignalementStatus(
                                            signalement.id_signalement,
                                            signalement.statut
                                        )
                                    "
                                >
                                    <option value="EN_ATTENTE">
                                        En Attente
                                    </option>
                                    <option value="TRAITE">Traité</option>
                                    <option value="EN_TRAITEMENT">
                                        En Traitement
                                    </option>
                                </select>
                                <br />
                                Date:
                                {{
                                    new Date(
                                        signalement.date_signalement
                                    ).toLocaleString()
                                }}
                            </span>
                            <div class="flex gap-2">
                                <Button
                                    styleName="primary"
                                    size="md"
                                    @click="
                                        editItem(
                                            'signalement',
                                            signalement.id_signalement
                                        )
                                    "
                                >
                                    Modifier
                                </Button>
                                <Button
                                    styleName="report"
                                    size="md"
                                    @click="
                                        deleteItem(
                                            'signalement',
                                            signalement.id_signalement
                                        )
                                    "
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
                            :key="user.id_utilisateur"
                            class="flex items-center justify-between bg-gray-100 p-3 rounded"
                        >
                            <span>{{ user.nom }} ({{ user.email }})</span>
                            <div class="flex gap-2">
                                <Button
                                    styleName="report"
                                    size="md"
                                    @click="
                                        deleteItem(
                                            'utilisateur',
                                            user.id_utilisateur
                                        )
                                    "
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
                            :key="oeuvre.id_oeuvre"
                            class="flex items-center justify-between bg-gray-100 p-3 rounded min-h-24"
                        >
                            <div
                                class="w-24 h-24 shrink-0 overflow-hidden rounded"
                            >
                                <Image
                                    v-if="oeuvre.image"
                                    :image="{
                                        id: oeuvre.id_oeuvre,
                                        src: oeuvre.image,
                                        alt: oeuvre.titre,
                                    }"
                                    :isRemovable="false"
                                    :isEditable="false"
                                    :ownerId="null"
                                    :showAddButton="false"
                                />
                            </div>
                            <span
                                >{{ oeuvre.titre }} -
                                {{ oeuvre.description }}</span
                            >
                            <div class="flex gap-2">
                                <Button
                                    styleName="report"
                                    size="md"
                                    @click="
                                        deleteItem('oeuvre', oeuvre.id_oeuvre)
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
import { ref, onMounted } from 'vue'

const config = useRuntimeConfig()
const API_URL = config.public.API_BASE_URL

definePageMeta({
    layout: 'main',
})

const selectedSection = ref('utilisateurs')

const sectionList = [
    { id: 'signalements', label: 'Signalements' },
    { id: 'utilisateurs', label: 'Utilisateurs' },
    { id: 'oeuvres', label: 'Oeuvres' },
]

const utilisateurs = ref([])
const oeuvres = ref([])
const signalements = ref([])

const containerClass = 'my-8'
const menuWrapperClass = 'flex justify-center gap-4 mb-6'
const emptyStateClass = 'text-center text-gray-500'

const fetchUtilisateurs = async () => {
    try {
        const response = await fetch(`${API_URL}/utilisateurs`)
        if (!response.ok) throw new Error('Erreur de réseau')
        const data = await response.json()
        utilisateurs.value = data
    } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs:', error)
    }
}

const fetchOeuvres = async () => {
    try {
        const response = await fetch(`${API_URL}/oeuvres/all`)
        if (!response.ok) throw new Error('Erreur de réseau')
        const data = await response.json()
        oeuvres.value = data
    } catch (error) {
        console.error('Erreur lors de la récupération des œuvres:', error)
    }
}

const fetchSignalements = async () => {
    try {
        const response = await fetch(`${API_URL}/signalements`)
        if (!response.ok) throw new Error('Erreur de réseau')
        const data = await response.json()
        signalements.value = data
    } catch (error) {
        console.error('Erreur lors de la récupération des signalements:', error)
    }
}

onMounted(() => {
    fetchUtilisateurs()
    fetchOeuvres()
    fetchSignalements()
})

const updateSignalementStatus = async (id, statut) => {
    try {
        const response = await fetch(`${API_URL}/signalements/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ statut }),
        })
        if (!response.ok) throw new Error('Erreur de mise à jour')
        console.log('Statut mis à jour pour le signalement', id)
    } catch (error) {
        console.error('Erreur lors de la mise à jour du statut:', error)
    }
}

// Suppression d’un signalement
const deleteSignalement = async (id) => {
    try {
        const response = await fetch(`${API_URL}/signalements/${id}`, {
            method: 'DELETE',
        })
        if (!response.ok)
            throw new Error('Échec de la suppression du signalement')
        signalements.value = signalements.value.filter(
            (s) => s.id_signalement !== id
        )
        console.log(`Signalement ${id} supprimé avec succès`)
    } catch (error) {
        console.error('Erreur lors de la suppression du signalement:', error)
    }
}

// Suppression d’un utilisateur
const deleteUtilisateur = async (id) => {
    try {
        const response = await fetch(`${API_URL}/utilisateurs/${id}`, {
            method: 'DELETE',
        })
        if (!response.ok)
            throw new Error('Échec de la suppression de l’utilisateur')
        utilisateurs.value = utilisateurs.value.filter(
            (u) => u.id_utilisateur !== id
        )
        console.log(`Utilisateur ${id} supprimé avec succès`)
    } catch (error) {
        console.error('Erreur lors de la suppression de l’utilisateur:', error)
    }
}

// Suppression d’une œuvre
const deleteOeuvre = async (id) => {
    try {
        const response = await fetch(`${API_URL}/oeuvres/${id}`, {
            method: 'DELETE',
        })
        if (!response.ok) throw new Error('Échec de la suppression de l’œuvre')
        oeuvres.value = oeuvres.value.filter((o) => o.id_oeuvre !== id)
        console.log(`Œuvre ${id} supprimée avec succès`)
    } catch (error) {
        console.error('Erreur lors de la suppression de l’œuvre:', error)
    }
}

// Centralisation de l’action de suppression
const deleteItem = (type, id) => {
    const confirmed = window.confirm(
        `Êtes-vous sûr de vouloir supprimer ce ${type} ?`
    )
    if (!confirmed) return

    console.log(`Suppression confirmée de ${type} avec l'ID: ${id}`)

    if (type === 'signalement') {
        deleteSignalement(id)
    } else if (type === 'utilisateur') {
        deleteUtilisateur(id)
    } else if (type === 'oeuvre') {
        deleteOeuvre(id)
    }
}
</script>
