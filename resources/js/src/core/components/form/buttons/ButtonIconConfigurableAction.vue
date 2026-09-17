<template>
    <ButtonAction
        :variant="variant"
        :size="size"
        :title="title"
        :disabled="disabled"
        :loading="loading"
        :css-class="cssClass"
        :add-css-class="addCssClass"
        @click="handleClick"
    >
        <i v-if="iconClass" :class="iconClass"></i>
    </ButtonAction>
</template>

<script setup>
import ButtonAction from "@/src/core/components/form/buttons/ButtonAction.vue"
import { getButtonIcon } from "@/src/core/components/form/buttons/helpers/iconHelper"

const props = defineProps({
    type: {                 // edit, detail, delete
        type: String,
        required: true
    },
    title: String,
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
    }
})

const emit = defineEmits(['click']);

const { variant, iconClass } = getButtonIcon(props.type);

const handleClick = (event) => {
    emit('click', event);
}
</script>
