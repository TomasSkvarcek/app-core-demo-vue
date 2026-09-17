<template>
    <th v-if="th" class="nowrap-table-col">
        <slot />
    </th>
    <td v-else class="nowrap-table-col">
        <slot />
    </td>
</template>

<script setup>
defineProps({
    th: {
        type: Boolean,
        default: false
    }
})
</script>
