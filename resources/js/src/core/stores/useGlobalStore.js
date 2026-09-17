import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { getGlobalContextDataRequests } from '@/src/config/requests/globalContexDataRequests.js'
import {useAuthStore} from "@/src/core/stores/useAuthStore.js";
import {useAbortController} from "@/src/core/composables/useAbortController.js";

export const useGlobalStore = defineStore('global', () => {
    const data = ref({});
    const loading = ref(false);

    const auth = useAuthStore();
    const { getSignal } = useAbortController();

    const loadGlobalData = async (signal) => {
        loading.value = true;
        const loadedData = {
            loggedInUserData: {}
        }

        try {
            await Promise.all(getGlobalContextDataRequests(loadedData, signal));
            data.value = loadedData;
        } finally {
            loading.value = false;
        }
    }

    watch(
        () => auth.loggedInUser,
        async (isLoggedIn) => {
            if (isLoggedIn) {
                await loadGlobalData(getSignal());
            } else {
                data.value = {};
            }
        },
        { immediate: true }
    )

    return {
        data,
        loading,
        loadGlobalData,
    }
})
