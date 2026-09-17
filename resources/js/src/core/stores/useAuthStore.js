import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import { route } from '@/src/core/routing'
import { after_login_redirect_route, after_logout_redirect_route } from '@/src/config/constants/routing'
import { API_BASE_URL } from '@/src/core/constants/api'
import {useRouter} from "vue-router";

export const useAuthStore = defineStore('auth', () => {
    const router = useRouter();
    const loggedInUser = useLocalStorage('loggedInUser', false);
    const loading = ref(false);
    const errors = ref({});

    const login = async (data) => {
        errors.value = {};
        loading.value = true;

        try {
            await axios.get('sanctum/csrf-cookie', { baseURL: API_BASE_URL });
            await axios.post('login', data, { baseURL: API_BASE_URL });

            loggedInUser.value = true;

            router.push(route(after_login_redirect_route));
        } catch (error) {
            if (error.response?.status === 422) {
                errors.value = error.response.data.errors;
            }
        } finally {
            loading.value = false;
        }
    }

    const logout = async (force = false) => {
        if (!force) {
            await axios.post('logout', null, { baseURL: API_BASE_URL });
        }

        loggedInUser.value = false;
        router.push(route(after_logout_redirect_route));
    }

    return {
        loggedInUser,
        loading,
        errors,
        login,
        logout
    }
})
