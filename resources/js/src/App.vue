<template>
    <ContentLoader :loading="globalStore.loading" :fullscreen="true" :delay="0" />
    <router-view />
</template>

<script setup>
import ContentLoader from "@/src/core/components/core/ContentLoader.vue";
import { setupAxiosInterceptors } from '@/src/core/functions/axiosSetup';
import {useAuthStore} from "@/src/core/stores/useAuthStore.js";
import {useGlobalStore} from "@/src/core/stores/useGlobalStore.js";

const authStore = useAuthStore();
setupAxiosInterceptors(authStore.logout);

const globalStore = useGlobalStore();
</script>
