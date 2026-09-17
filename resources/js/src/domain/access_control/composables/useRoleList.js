import { ref, onMounted } from 'vue'
import {useAbortController} from "@/src/core/composables/useAbortController.js";

export function useRoleList() {
    const roles = ref([]);
    const loading = ref(false);
    const { getSignal } = useAbortController();

    const getRoles = async ({ signal } = {}) => {
        loading.value = true;

        try {
            const response = await axios.get('roles/view', { signal });
            roles.value = response.data;
        } finally {
            loading.value = false;
        }
    }

    onMounted(() => {
        getRoles({ signal: getSignal()});
    })

    return {
        roles,
        getRoles,
        loading
    }
}
