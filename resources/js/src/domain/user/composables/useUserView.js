import { ref, onMounted, watch } from 'vue'
import { useTranslation } from 'i18next-vue'
import { showSuccessMessage } from "@/src/core/helpers/alerts/successMessage"
import { useSearch } from "@/src/core/composables/useSearch"
import {useAbortController} from "@/src/core/composables/useAbortController.js";
import {useDebounceFn} from "@vueuse/core";
import {clonePlainObject} from "@/src/core/helpers/objectHelper.js";

export function useUserView() {
    const { t } = useTranslation();
    const { getSignal } = useAbortController();

    const users = ref([]);
    const roles = ref([]);
    const usersLoading = ref(false);
    const rolesLoading = ref(false);
    const formLoading = ref(false);

    const {
        searchData,
        clearSearch,
        pageChanged,
    } = useSearch();

    const getRoles = async ({ signal } = {}) => {
        rolesLoading.value = true;

        try {
            const res = await axios.get('roles', { signal });
            roles.value = res.data;
        } finally {
            rolesLoading.value = false
        }
    }

    const getUsers = async (data = null, { signal } = {}) => {
        usersLoading.value = true;

        try {
            const res = await axios.post('users/view', data, { signal });
            users.value = res.data;
        } finally {
            usersLoading.value = false;
        }
    }

    const deleteUser = async (user_id) => {
        formLoading.value = true;

        try {
            await axios.delete(`users/delete/${user_id}`);
            showSuccessMessage(t('user.deleted'));
            getUsers();
            clearSearch();
        } finally {
            formLoading.value = false;
        }
    }

    const getUsersDebounced = useDebounceFn((newSearch) => {
        getUsers(newSearch)
    }, 500)

    watch(searchData, (newSearch) => {
        getUsersDebounced(clonePlainObject(newSearch));
    }, { deep: true })

    onMounted(() => {
        const abortSignal = getSignal();
        getRoles({ signal: abortSignal });
        getUsers(null, { signal: abortSignal });
    })

    return {
        users,
        roles,
        rolesLoading,
        usersLoading,
        formLoading,
        getUsers,
        deleteUser,
        searchData,
        clearSearch,
        pageChanged,
    }
}
