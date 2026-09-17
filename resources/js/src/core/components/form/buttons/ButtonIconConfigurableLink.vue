<template>
    <ButtonLink
        :variant="variant"
        :link="link"
        :size="size"
        :title="title"
        :css-class="cssClass"
        :add-css-class="addCssClass"
    >
        <i v-if="iconClass" :class="iconClass"></i>
    </ButtonLink>
</template>

<script setup>
import ButtonLink from "@/src/core/components/form/buttons/ButtonLink.vue";
import { getButtonIcon } from "@/src/core/components/form/buttons/helpers/iconHelper";

const props = defineProps({
    type: {                    // edit, detail, delete
        type: String,
        required: true
    },
    link: {
        type: [String, Object],
        required: true
    },
    title: String,
    cssClass: String,
    addCssClass: String,
    size: {
        type: String,
        default: 'normal'
    }
})

const { variant, iconClass } = getButtonIcon(props.type);
</script>
