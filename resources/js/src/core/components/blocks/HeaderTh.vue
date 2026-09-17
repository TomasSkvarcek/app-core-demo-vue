<template>
    <th scope="col" :style="widthStyle">
        <slot />
    </th>
</template>

<script setup>
import {computed} from "vue";

const props = defineProps({
    width: {
        type: [String, Number],
        default: null
    }
})

const widthStyle = computed(() => {
    if (props.width == null) return {}
    return { width: props.width }
})

</script>
