<template>
    <nav v-if="paginationData?.length > 3">
        <ul class="pagination pagination-sm">
            <li
                v-for="(link, index) in paginationData"
                :key="index"
                :class="getPaginationClass(link)"
            >
                <button
                    class="page-link"
                    :disabled="!link.url"
                    @click="pageChanged(link.url)"
                    v-html="link.label"
                />
            </li>
        </ul>
    </nav>
</template>

<script setup>
const props = defineProps({
    paginationData: {
        type: Array,
        default: () => []
    }
})

const emit = defineEmits(['page-changed']);

const getPaginationClass = (link) => {
    let css = 'page-item ';

    if (!link.url) css += 'disabled ';
    if (link.active) css += 'active ';

    return css;
}

const pageChanged = (url) => {
    if (!url) return;

    const fullUrl = new URL(url, window.location.origin);
    const page = fullUrl.searchParams.get('page');

    emit('page-changed', page);
}
</script>
