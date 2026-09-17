<template>
    <ContainerSmall>
        <CardWrapper :title="t('auth.password_change')">
            <form @submit.prevent="handleSubmit" noValidate>
                <InputText
                    v-model="formData.old_password"
                    id="old_password"
                    type="password"
                    name="old_password"
                    :label="t('auth.old_password')"
                    :errors="errors?.old_password"
                    :disabled="formLoading"
                    maxlength="250"
                />

                <div class="fw-bold mb-3 mt-3">
                    {{ t('auth.password_policy') }}
                </div>

                <InputText
                    v-model="formData.new_password"
                    id="new_password"
                    type="password"
                    name="new_password"
                    :label="t('auth.new_password')"
                    :errors="errors?.new_password"
                    :disabled="formLoading"
                    maxlength="250"
                />

                <InputText
                    v-model="formData.new_password_confirmation"
                    id="new_password_confirmation"
                    type="password"
                    name="new_password_confirmation"
                    :label="t('auth.confirm_password')"
                    :errors="errors?.new_password_confirmation"
                    :disabled="formLoading"
                    maxlength="250"
                />

                <div class="mt-3">
                    <ButtonAction type="submit" :loading="formLoading">
                        {{ t('auth.change_password') }}
                    </ButtonAction>
                </div>
            </form>
        </CardWrapper>
    </ContainerSmall>
</template>

<script setup>
import { ref } from 'vue';
import { useTranslation } from 'i18next-vue';
import { usePassword } from "@/src/core/composables/auth/usePassword.js";
import ContainerSmall from "@/src/core/components/blocks/ContainerSmall.vue";
import CardWrapper from "@/src/core/components/blocks/CardWrapper.vue";
import InputText from "@/src/core/components/form/inputs/InputText.vue";
import ButtonAction from "@/src/core/components/form/buttons/ButtonAction.vue";

const { t } = useTranslation();

const {
    errors,
    formLoading,
    changePassword
} = usePassword();

const formData = ref({});

const handleSubmit = async () => {
    await changePassword(formData.value);
}
</script>
