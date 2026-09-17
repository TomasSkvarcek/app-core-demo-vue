<template>
    <div
        :class="['alert', 'fade', 'show', 'text-center', alertClass]"
        role="alert"
    >
        <slot />
    </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    type: {
        type: String,
        default: 'success'
    }
})

const alertClass = computed(() => {
    switch (props.type) {
        case 'error':
            return 'alert-danger';
        case 'info':
            return 'alert-primary';
        case 'warning':
            return 'alert-warning';
        default:
            return 'alert-success';
    }
})
</script>
