<template>
    <label :for="id" :class="cssClass ?? 'form-label'">
        {{ label }}{{ showAsRequired ? '*' : '' }}
    </label>
</template>

<script setup>
defineProps({
    id: String,
    label: String,
    showAsRequired: { type: Boolean, default: false },
    cssClass: String
})
</script>
