<template>
    <div class="card">
        <div v-if="title" class="card-header">
            {{ title }}
        </div>
        <div class="card-body">
            <slot />
        </div>
    </div>
</template>

<script setup>
defineProps({
    title: String
})
</script>
