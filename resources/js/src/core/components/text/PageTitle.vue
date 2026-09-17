<template>
    <h2 :class="cssClass">
        {{ text }}
        <slot />
    </h2>
</template>

<script setup>
defineProps({
    text: String,
    cssClass: String
})
</script>
