import { ref, onMounted } from 'vue'
import { useTranslation } from 'i18next-vue'
import { showSuccessMessage } from "@/src/core/helpers/alerts/successMessage"
import { useRoleList } from "@/src/domain/access_control/composables/useRoleList"
import {useAbortController} from "@/src/core/composables/useAbortController.js";

export function useRoleEditor() {
    const { t } = useTranslation();

    const errors = ref({});
    const roleLoading = ref(false);
    const formLoading = ref(false);
    const deleteLoading = ref(false);
    const roleData = ref({});
    const privileges = ref([]);
    const selectedRoleID = ref(null);

    const { roles, getRoles, loading: roleListLoading } = useRoleList();
    const { getSignal } = useAbortController();

    const prepareRoleData = (role_api_data) => {
        const privilege_ids = role_api_data.privileges?.map(p => p.id) || [];
        delete role_api_data.privileges;
        role_api_data.privilege_ids = privilege_ids;
        roleData.value = role_api_data;
    }

    const getPrivileges = async ({ signal } = {}) => {
        roleLoading.value = true;
        try {
            const res = await axios.get('privileges', { signal });
            privileges.value = res.data;
        } finally {
            roleLoading.value = false;
        }
    }

    const getRole = async (role_id) => {
        roleLoading.value = true;
        errors.value = {};

        try {
            const res = await axios.get(`roles/get/${role_id}`);
            prepareRoleData(res.data);
            selectedRoleID.value = res.data.id;
        } finally {
            roleLoading.value = false;
        }
    }

    const selectRole = async (role_id) => {
        await getRole(role_id);
    }

    const clearSelectedRole = () => {
        roleData.value = {};
        selectedRoleID.value = null;
        errors.value = {};
    }

    const createRole = async (data) => {
        formLoading.value = true;
        errors.value = {};

        try {
            await axios.post('roles/create', data);
            showSuccessMessage(t('role.created'));
            clearSelectedRole();
            getRoles();
        } catch (error) {
            if (error.response?.status === 422) {
                errors.value = error.response.data.errors;
            }
        } finally {
            formLoading.value = false;
        }
    }

    const updateRole = async (data) => {
        formLoading.value = true;
        errors.value = {};

        try {
            const res = await axios.put(`roles/update/${selectedRoleID.value}`, data);
            showSuccessMessage(t('role.updated'));
            prepareRoleData(res.data);
            getRoles();
        } catch (error) {
            if (error.response?.status === 422) {
                errors.value = error.response.data.errors;
            }
        } finally {
            formLoading.value = false;
        }
    }

    const deleteRole = async (role_id) => {
        deleteLoading.value = true;

        try {
            await axios.delete(`roles/delete/${role_id}`);
            showSuccessMessage(t('role.deleted'));
            clearSelectedRole();
            getRoles();
        } finally {
            deleteLoading.value = false;
        }
    }

    onMounted(() => {
        getPrivileges({ signal: getSignal() });
    })

    return {
        roleData,
        privileges,
        roles,
        selectedRoleID,
        roleLoading,
        formLoading,
        deleteLoading,
        roleListLoading,
        errors,
        selectRole,
        clearSelectedRole,
        createRole,
        updateRole,
        deleteRole,
        getRole
    }
}
