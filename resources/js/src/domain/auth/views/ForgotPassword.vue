<template>
    <div>
        <div v-if="actionSuccessful" class="mt-5">
            <Message type="success" dismissible="false">
                {{ t('auth.success_forgot_password_mail_send') }}
            </Message>
        </div>

        <div v-else>
            <ContainerSmall>
                <CardWrapper :title="t('auth.forgot_password')">
                    <form @submit.prevent="handleSubmit" noValidate>
                        <InputText
                            v-model="formData.email"
                            id="email"
                            type="email"
                            name="email"
                            :label="t('auth.forgot_password_email')"
                            :errors="errors?.email"
                            :disabled="formLoading"
                            maxlength="100"
                        />

                        <div class="mt-3">
                            <ButtonAction type="submit" :loading="formLoading">
                                {{ t('general.send') }}
                            </ButtonAction>

                            <RouterLink :to="route(routeNames.login)" class="btn btn-link float-end">
                                {{ t('auth.back_login') }}
                            </RouterLink>
                        </div>
                    </form>
                </CardWrapper>
            </ContainerSmall>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useTranslation } from 'i18next-vue';
import { RouterLink } from 'vue-router';
import { usePassword } from "@/src/core/composables/auth/usePassword.js";
import ContainerSmall from "@/src/core/components/blocks/ContainerSmall.vue";
import CardWrapper from "@/src/core/components/blocks/CardWrapper.vue";
import InputText from "@/src/core/components/form/inputs/InputText.vue";
import ButtonAction from "@/src/core/components/form/buttons/ButtonAction.vue";
import Message from "@/src/core/components/text/Message.vue";
import { routeNames } from "@/src/router/routeNames.js";
import { route } from "@/src/core/routing";

const { t } = useTranslation();

const {
    errors,
    formLoading,
    handleForgotPassword,
    actionSuccessful
} = usePassword();

const formData = ref({});

const handleSubmit = async () => {
    await handleForgotPassword(formData.value);
}
</script>
