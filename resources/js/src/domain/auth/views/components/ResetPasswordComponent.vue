<template>
    <div>
        <!-- Loading -->
        <ContentLoader v-if="loading" :loading="true" :fullscreen="true" />

        <!-- Token Error -->
        <div v-else-if="errors?.token" class="mt-5">
            <Message type="error" dismissible="false">
                {{ errors.token[0] }}
            </Message>
        </div>

        <!-- Success Message -->
        <div v-else-if="actionSuccessful" class="mt-5">
            <Message type="success" dismissible="false">
                {{ t('auth.success_' + type) }}<br>
                <RouterLink :to="route(routeNames.login)" class="alert-link">
                    {{ t('auth.you_can_login') }}
                </RouterLink>
            </Message>
        </div>

        <!-- Form -->
        <div v-else-if="tokenIsValid">
            <ContainerSmall>
                <CardWrapper :title="t('auth.title_' + type)">
                    <form @submit.prevent="handleSubmit" noValidate>
                        <InputText
                            v-model="formData.password"
                            id="password"
                            type="password"
                            name="password"
                            :label="t(type === 'password_create' ? 'auth.password' : 'auth.new_password')"
                            :errors="errors?.password"
                            :disabled="formLoading"
                            maxlength="250"
                        />

                        <InputText
                            v-model="formData.password_confirmation"
                            id="password_confirmation"
                            type="password"
                            name="password_confirmation"
                            :label="t('auth.confirm_password')"
                            :errors="errors?.password_confirmation"
                            :disabled="formLoading"
                            maxlength="250"
                        />

                        <div class="mt-3">
                            <ButtonAction type="submit" :loading="formLoading">
                                {{ t('auth.' + type) }}
                            </ButtonAction>
                        </div>
                    </form>
                </CardWrapper>
            </ContainerSmall>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useTranslation } from 'i18next-vue';
import { route } from "@/src/core/routing";
import { usePassword } from "@/src/core/composables/auth/usePassword.js";
import ContentLoader from "@/src/core/components/core/ContentLoader.vue";
import Message from "@/src/core/components/text/Message.vue";
import InputText from "@/src/core/components/form/inputs/InputText.vue";
import ButtonAction from "@/src/core/components/form/buttons/ButtonAction.vue";
import CardWrapper from "@/src/core/components/blocks/CardWrapper.vue";
import ContainerSmall from "@/src/core/components/blocks/ContainerSmall.vue";
import { routeNames } from "@/src/router/routeNames.js";
import {useAbortController} from "@/src/core/composables/useAbortController.js";

const props = defineProps({
    type: String
})

const { t } = useTranslation();
const { getSignal } = useAbortController();

const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('token');
const id = urlParams.get('id');

const {
    errors,
    loading,
    formLoading,
    tokenIsValid,
    actionSuccessful,
    validateToken,
    createPassword,
    resetPassword
} = usePassword()

const formData = ref({});

onMounted(() => {
    validateToken(props.type, token, id, { signal: getSignal()})
})

const handleSubmit = async () => {
    const preparedData = {
        ...formData.value,
        token,
        id
    }

    if (props.type === 'password_create') {
        await createPassword(preparedData);
    } else if (props.type === 'password_reset') {
        await resetPassword(preparedData);
    }
}
</script>
