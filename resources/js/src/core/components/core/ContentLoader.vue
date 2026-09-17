<template>
    <div v-if="show" :class="fullscreen ? 'loading-overlay-fullscreen' : 'loading-overlay'">
        <div class="loading-indicator-wrapper">
            <div id="loading-indicator-part-1" class="loading-indicator"></div>
            <div id="loading-indicator-part-2" class="loading-indicator"></div>
            <div id="loading-indicator-part-3" class="loading-indicator"></div>
            <div id="loading-indicator-part-4" class="loading-indicator"></div>
            <div id="loading-indicator-part-5" class="loading-indicator"></div>
            <div id="loading-indicator-part-6" class="loading-indicator"></div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';

const props = defineProps({
    loading: Boolean,
    delay: {
        type: Number,
        default: 400
    },
    dontDelayOnFirstLoad: {
        type: Boolean,
        default: true
    },
    fullscreen: {
        type: Boolean,
        default: false
    }
})

const show = ref(false);
const firstRender = ref(props.dontDelayOnFirstLoad);

onMounted(() => {
    if (props.dontDelayOnFirstLoad && props.delay > 0) {
        setTimeout(() => {
            firstRender.value = false;
        }, props.delay)
    }
})

watch(() => props.loading, (newLoading, _oldLoading, onCleanup) => {
    if (props.delay > 0 && !firstRender.value) {
        // Delayed show/hide after first render
        const timer = setTimeout(() => {
            show.value = newLoading;
        }, props.delay)

        onCleanup(() => {
            clearTimeout(timer);
        })
    } else {
        // Immediate show on first load or when delay = 0
        show.value = newLoading;
    }
}, { immediate: true })
</script>
