<template>
    <RouterLink
        :to="link"
        :class="buttonClass"
        :title="title"
    >
        <slot />
    </RouterLink>
</template>

<script setup>
import { computed } from 'vue';
import { RouterLink } from 'vue-router';

const props = defineProps({
    variant: {
        type: String,
        default: 'primary'
    },
    link: {
        type: [String, Object],
        required: true
    },
    cssClass: String,
    addCssClass: String,
    size: {
        type: String,
        default: 'normal'
    },
    title: String
})

const buttonClass = computed(() => {
    let base = 'btn '

    switch (props.variant) {
        case 'secondary':
            base += 'btn-secondary '
            break
        case 'danger':
            base += 'btn-danger '
            break
        case 'success':
            base += 'btn-success '
            break
        default:
            base += 'btn-primary '
    }

    if (props.size === 'small') {
        base += 'btn-sm ';
    }

    if (props.addCssClass) {
        base += props.addCssClass + ' ';
    }

    return props.cssClass ?? base.trim();
})
</script>
