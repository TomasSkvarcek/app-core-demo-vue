<template>
    <ContainerMiddle>
        <PageTitle :text="user_id ? t('user.edit') : t('user.create')">
            <PageTitleBackButton
                @click="goBack"
                :disabled="formLoading"
            />
        </PageTitle>

        <CardWrapper>
            <ContentLoader :loading="loading" />

            <form @submit.prevent="handleSubmit" noValidate>
                <InputText
                    v-model="userData.email"
                    id="email"
                    type="email"
                    :label="t('user.email')"
                    :errors="errors?.email"
                    :disabled="formLoading"
                    maxlength="100"
                    show-as-required
                />

                <InputText
                    v-model="userData.first_name"
                    id="first_name"
                    :label="t('user.first_name')"
                    :errors="errors?.first_name"
                    :disabled="formLoading"
                    maxlength="100"
                    show-as-required
                />

                <InputText
                    v-model="userData.last_name"
                    id="last_name"
                    :label="t('user.last_name')"
                    :errors="errors?.last_name"
                    :disabled="formLoading"
                    maxlength="100"
                    show-as-required
                />

                <InputSelect
                    v-if="user_id"
                    v-model="userData.active"
                    id="active"
                    :label="t('user.active')"
                    :options="activeSelectOptions"
                    :errors="errors?.active"
                    :disabled="formLoading || (userData.id === loggedInUserData?.user?.id)"
                />

                <InputMultiSelectInline
                    v-model="userData.role_ids"
                    id="roles"
                    :options="roles"
                    option-value-key="id"
                    option-name-key="name"
                    :label="t('user.roles')"
                    can-select-all
                />

                <div class="mt-3">
                    <ButtonAction
                        type="submit"
                        variant="primary"
                        :loading="formLoading"
                        add-css-class="me-2"
                    >
                        {{ user_id ? t('general.edit') : t('general.create') }}
                    </ButtonAction>

                    <ButtonAction
                        variant="secondary"
                        @click="goBack"
                        :disabled="formLoading"
                    >
                        {{ t('general.back') }}
                    </ButtonAction>
                </div>
            </form>
        </CardWrapper>
    </ContainerMiddle>
</template>

<script setup>
import { computed } from 'vue';
import { useTranslation } from 'i18next-vue';
import { useRouter, useRoute } from 'vue-router';

import { useUserEditor } from '@/src/domain/user/composables/useUserEditor.js';
import { getBoolSelectOptions } from "@/src/core/helpers/inputHelper";

import ContentLoader from "@/src/core/components/core/ContentLoader.vue";
import PageTitle from "@/src/core/components/text/PageTitle.vue";
import PageTitleBackButton from "@/src/core/components/form/buttons/PageTitleBackButton.vue";
import ContainerMiddle from "@/src/core/components/blocks/ContainerMiddle.vue";
import CardWrapper from "@/src/core/components/blocks/CardWrapper.vue";
import InputText from "@/src/core/components/form/inputs/InputText.vue";
import InputSelect from "@/src/core/components/form/inputs/InputSelect.vue";
import InputMultiSelectInline from "@/src/core/components/form/inputs/InputMultiSelectInline.vue";
import ButtonAction from "@/src/core/components/form/buttons/ButtonAction.vue";
import {routeNames} from "@/src/router/routeNames.js";
import {route} from "@/src/core/routing";
import {useGlobalStore} from "@/src/core/stores/useGlobalStore.js";
import {storeToRefs} from "pinia";

const { t } = useTranslation();
const router = useRouter();
const vueRoute = useRoute();

const user_id = vueRoute.params.id ?? null;

const {
    userData,
    roles,
    loading,
    formLoading,
    errors,
    createUser,
    updateUser
} = useUserEditor(user_id)

const activeSelectOptions = getBoolSelectOptions();

const globalStore = useGlobalStore();
const { data: globalStoreData} = storeToRefs(globalStore);
const loggedInUserData = computed(() => globalStoreData.value?.loggedInUserData);

const handleSubmit = async () => {
    if (user_id) {
        await updateUser(userData.value);
    } else {
        await createUser(userData.value);
    }
}

const goBack = () => {
    router.push(route(routeNames.users_view));
}
</script>
