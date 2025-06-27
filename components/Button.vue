<template>
    <button
        :class="[
            'rounded text-center transition focus-visible:ring-2 ring-offset-2 ring-gray-200',
            block && 'w-full',
            sizes[size],
            styles[styleName],
            className,
        ]"
    >
        <slot />
    </button>
</template>

<script setup lang="ts">
interface Props {
    size?: 'md' | 'lg'
    block?: boolean
    styleName?: 'outline' | 'primary' | 'inverted' | 'like' | 'report'
    className?: string
    [x: string]: any
}

withDefaults(defineProps<Props>(), {
    size: 'md',
    styleName: 'primary',
})

const sizes = {
    md: 'px-5 py-2.5',
    lg: 'px-6 py-3',
}

const styles = {
    outline: 'border-2 border-black text-black hover:bg-black hover:text-white',
    discord:
        'bg-indigo-600 text-white hover:bg-indigo-700 border-2 border-indigo-600',
    primary:
        'bg-black text-amber-50 hover:bg-slate-900 border-2 border-transparent',
    like: 'bg-blue-500 text-white hover:bg-blue-600 border-2 border-blue-500',
    report: 'bg-red-500 text-white hover:bg-red-600 border-2 border-red-500',
}
</script>
