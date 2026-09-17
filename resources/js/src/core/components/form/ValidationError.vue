<template>
    <div v-if="errors?.length" :class="cssClass ?? 'invalid-feedback'">
        <ul>
            <li v-for="(error, index) in errors"
                :key="index">
                {{ error }}
            </li>
        </ul>
    </div>
</template>

<script setup>
defineProps({
    errors: Array,
    cssClass: String
})
</script>
