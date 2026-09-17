<template>
    <RouterLink
        :to="link"
        :class="cssClass"
        :end="true"
    >
        <slot />
    </RouterLink>
</template>

<script setup>
import { RouterLink } from 'vue-router';
import { computed } from 'vue';
import { route } from '@/src/core/routing';

const props = defineProps({
    link: {
        type: String,
        required: true
    },
    cssClass: String,
})

const link = computed(() => {
    return route(props.link);
})
</script>
