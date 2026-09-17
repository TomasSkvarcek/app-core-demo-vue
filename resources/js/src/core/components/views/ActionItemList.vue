<template>
    <div class="list-group overflow-auto" :style="{ height: props.overflowHeight }">
        <ContentLoader :loading="loading" />

        <template
            v-for="item in items"
            :key="item.id"
        >
            <button
                type="button"
                class="list-group-item list-group-item-action"
                :class="{ active: String(selectedId) === String(item.id) }"
                @click="selectHandler(item.id)"
            >
                {{ item.name }}
            </button>
        </template>

    </div>
</template>

<script setup>
import ContentLoader from "@/src/core/components/core/ContentLoader.vue"

const props = defineProps({
    items: {
        type: Array,
        default: () => []
    },
    selectedId: [String, Number],
    loading: Boolean,
    overflowHeight: {
        type: String,
        default: '70vh'
    }
})

const emit = defineEmits(['select']);

const selectHandler = (id) => {
    emit('select', id);
}
</script>
