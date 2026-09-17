import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTranslation } from 'i18next-vue'
import { showSuccessMessage } from "@/src/core/helpers/alerts/successMessage"
import { route } from "@/src/core/routing"
import { routeNames } from "@/src/router/routeNames.js"
import {useAbortController} from "@/src/core/composables/useAbortController.js";

export function useUserEditor(id = null) {
    const { t } = useTranslation();
    const router = useRouter();
    const errors = ref({});
    const loading = ref(false);
    const formLoading = ref(false);
    const userData = ref({});
    const roles = ref([]);
    const { getSignal } = useAbortController();

    const loadData = async ({ signal } = {}) => {
        loading.value = true;
        errors.value = {};

        try {
            const rolesRes = await axios.get('roles', { signal });
            roles.value = rolesRes.data;

            if (id) {
                const userRes = await axios.get(`users/get/${id}`, { signal });
                prepareUserData(userRes.data);
            }
        } finally {
            loading.value = false;
        }
    }

    const prepareUserData = (user_api_data) => {
        const user_roles = user_api_data.roles?.map(role => role.id) || [];
        delete user_api_data.roles;
        user_api_data.role_ids = user_roles;

        userData.value = user_api_data;
    }

    const createUser = async (data) => {
        formLoading.value = true;
        errors.value = {};

        try {
            await axios.post('users/create', data);
            showSuccessMessage(t('user.created'));
            router.push(route(routeNames.users_view));
        } catch (error) {
            if (error.response?.status === 422) {
                errors.value = error.response.data.errors;
            }
        } finally {
            formLoading.value = false;
        }
    }

    const updateUser = async (data) => {
        formLoading.value = true;
        errors.value = {};

        try {
            const response = await axios.put(`users/update/${id}`, data);
            showSuccessMessage(t('user.updated'));
            prepareUserData(response.data);
        } catch (error) {
            if (error.response?.status === 422) {
                errors.value = error.response.data.errors;
            }
        } finally {
            formLoading.value = false;
        }
    }

    onMounted(() => {
        loadData({ signal: getSignal()});
    })

    return {
        userData,
        roles,
        createUser,
        updateUser,
        loading,
        formLoading,
        errors
    }
}
