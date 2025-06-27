<template>
    <div :class="['mt-16', align === 'left' && 'text-center']">
        <h2 class="text-4xl lg:text-5xl font-bold lg:tracking-tight">
            <slot name="title">Title</slot>
        </h2>
    </div>
</template>

<script setup>
defineProps({
    align: {
        default: 'center',
    },
})
</script>
