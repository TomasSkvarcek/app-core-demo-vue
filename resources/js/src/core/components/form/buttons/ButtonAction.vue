<template>
    <button
        :type="type"
        :class="buttonClass"
        :disabled="disabled || loading"
        :title="title"
        @click="handleClick"
    >
        <IconSpinner v-if="loading" />
        <slot />
    </button>
</template>

<script setup>
import { computed } from 'vue';
import IconSpinner from "@/src/core/components/core/IconSpinner.vue";

const props = defineProps({
    type: {
        type: String,
        default: 'button'
    },
    variant: {
        type: String,
        default: 'primary'
    },
    disabled: {
        type: Boolean,
        default: false
    },
    loading: {
        type: Boolean,
        default: false
    },
    cssClass: String,
    addCssClass: String,
    size: {
        type: String,
        default: 'normal'
    },
    title: String
})

const emit = defineEmits(['click']);

const buttonClass = computed(() => {
    let base = 'btn '

    switch (props.variant) {
        case 'secondary':
            base += 'btn-secondary ';
            break;
        case 'danger':
            base += 'btn-danger ';
            break;
        case 'success':
            base += 'btn-success ';
            break;
        default:
            base += 'btn-primary ';
    }

    if (props.size === 'small') {
        base += 'btn-sm ';
    }

    if (props.addCssClass) {
        base += props.addCssClass + ' ';
    }

    return props.cssClass ?? base.trim();
})

const handleClick = (event) => {
    emit('click', event);
}
</script>
