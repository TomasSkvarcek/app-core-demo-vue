<template>
    <ContainerSmall>
        <CardWrapper :title="t('auth.login')">
            <form @submit.prevent="handleSubmit" noValidate>
                <InputText
                    v-model="loginData.email"
                    id="email"
                    type="email"
                    name="email"
                    :label="t('auth.email')"
                    :errors="errors?.email"
                    :disabled="loading"
                    maxlength="250"
                />

                <InputText
                    v-model="loginData.password"
                    id="password"
                    type="password"
                    name="password"
                    :label="t('auth.password')"
                    :errors="errors?.password"
                    :disabled="loading"
                    maxlength="250"
                />

                <div class="mt-3">
                    <ButtonAction type="submit" :loading="loading">
                        {{ t('auth.login') }}
                    </ButtonAction>

                    <RouterLink :to="route(routeNames.forgot_password)" class="btn btn-link float-end">
                        {{ t('auth.forgot_password_link') }}
                    </RouterLink>
                </div>
            </form>
        </CardWrapper>
    </ContainerSmall>
</template>

<script setup>
import { ref } from 'vue';
import { useTranslation } from 'i18next-vue';
import { RouterLink } from 'vue-router';

import { useAuthStore } from "@/src/core/stores/useAuthStore.js";

import ContainerSmall from "@/src/core/components/blocks/ContainerSmall.vue";
import CardWrapper from "@/src/core/components/blocks/CardWrapper.vue";
import InputText from "@/src/core/components/form/inputs/InputText.vue";
import ButtonAction from "@/src/core/components/form/buttons/ButtonAction.vue";

import { routeNames } from "@/src/router/routeNames.js";
import { route } from "@/src/core/routing";
import {storeToRefs} from "pinia";

const { t } = useTranslation();

const auth = useAuthStore();
const { errors, loading } = storeToRefs(auth);

const loginData = ref({});

const handleSubmit = async () => {
    await auth.login(loginData.value);

    loginData.value.password = null;
}
</script>
