import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useTranslation } from 'i18next-vue'
import { showInfoAlert } from "@/src/core/helpers/alerts/infoAlert.js"
import { route } from "@/src/core/routing"
import { after_login_redirect_route } from "@/src/config/constants/routing.js"

export function usePassword() {
    const { t } = useTranslation();
    const router = useRouter();

    const errors = ref({});
    const loading = ref(false);
    const formLoading = ref(false);
    const tokenIsValid = ref(false);
    const actionSuccessful = ref(false);

    const validateToken = async (token_type, token, id, { signal } = {}) => {
        if (!token || !id) {
            errors.value = { token: [t('auth.invalid_password_reset_token')] };
            return;
        }

        loading.value = true;
        errors.value = {};

        try {
            await axios.post('auth/validate_token', {
                token_type,
                token,
                id
            }, { signal })
            tokenIsValid.value = true;
        } catch (error) {
            if (error.response?.status === 422) {
                errors.value = error.response.data.errors;
            } else {
                errors.value = { token: [t('general.error') + ' ' + t('general.try_again')] };
            }
        } finally {
            loading.value = false;
        }
    }

    const createPassword = async (data) => {
        formLoading.value = true;
        errors.value = {};

        try {
            await axios.post("auth/create_password", data);
            actionSuccessful.value = true;
        } catch (error) {
            if (error.response?.status === 422) {
                errors.value = error.response.data.errors;
            }
        } finally {
            formLoading.value = false;
        }
    }

    const resetPassword = async (data) => {
        formLoading.value = true;
        errors.value = {};

        try {
            await axios.post("auth/reset_password", data);
            actionSuccessful.value = true;
        } catch (error) {
            if (error.response?.status === 422) {
                errors.value = error.response.data.errors;
            }
        } finally {
            formLoading.value = false;
        }
    }

    const changePassword = async (data) => {
        formLoading.value = true;
        errors.value = {};

        try {
            await axios.post("auth/change_password", data);
            showInfoAlert(t('auth.password_changed'));
            router.push(route(after_login_redirect_route));
        } catch (error) {
            if (error.response?.status === 422) {
                errors.value = error.response.data.errors;
            }
        } finally {
            formLoading.value = false;
        }
    }

    const handleForgotPassword = async (data) => {
        formLoading.value = true;
        errors.value = {};

        try {
            await axios.post("auth/forgot_password", data);
            actionSuccessful.value = true;
        } catch (error) {
            if (error.response?.status === 422) {
                errors.value = error.response.data.errors;
            }
        } finally {
            formLoading.value = false;
        }
    }

    return {
        errors,
        loading,
        formLoading,
        tokenIsValid,
        actionSuccessful,
        validateToken,
        createPassword,
        resetPassword,
        changePassword,
        handleForgotPassword
    }
}
