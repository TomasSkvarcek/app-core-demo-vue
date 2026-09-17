<template>
    <ContainerLarge>
        <PageTitle :text="t('menu.roles')" />

        <div class="row mt-3">
            <div class="col-3">
                <RelativeDiv>
                    <ContentLoader :loading="roleListLoading" />

                    <ButtonAction
                        @click="clearSelectedRole"
                        css-class="btn btn-primary w-100 mb-2"
                    >
                        {{ t('role.create') }}
                    </ButtonAction>

                    <ActionItemList
                        :items="roles"
                        :selected-id="selectedRoleID"
                        @select="selectRole"
                    />
                </RelativeDiv>
            </div>

            <div class="col-9">
                <CardWrapper>
                    <ContentLoader :loading="roleLoading" />

                    <form @submit.prevent="handleSubmit" noValidate>
                        <div v-if="!selectedRoleID" class="mb-3">
                            <h3>{{ t('role.create_role') }}</h3>
                        </div>

                        <div class="row mb-4">
                            <div class="col-auto">
                                <InputLabel id="role_name" :label="t('role.name')" css-class="col-form-label" />
                            </div>
                            <div class="col-auto">
                                <InputText
                                    v-model="roleData.name"
                                    id="role_name"
                                    name="role_name"
                                    :placeholder="t('role.name')"
                                    :errors="errors?.name"
                                    :disabled="formLoading"
                                    maxlength="50"
                                    :set-bottom-margin="false"
                                    size="normal"
                                />
                            </div>
                            <div class="col-auto">
                                <ButtonAction type="submit" variant="primary" :loading="formLoading">
                                    {{ selectedRoleID ? t('general.edit') : t('general.create') }}
                                </ButtonAction>
                            </div>

                            <div v-if="selectedRoleID" class="col-auto">
                                <ButtonAction
                                    variant="danger"
                                    @click="openDeleteModal"
                                    :disabled="formLoading"
                                >
                                    {{ t('general.delete') }}
                                </ButtonAction>
                            </div>
                        </div>

                        <GroupMultiSelectInline
                            v-model="roleData.privilege_ids"
                            id="privileges"
                            :group-settings="privilegeGroups"
                            :options="privileges"
                            option-value-key="id"
                            option-name-key="code"
                            :label="t('role.privileges')"
                            can-select-all
                        />
                    </form>
                </CardWrapper>
            </div>
        </div>

        <!-- Delete Confirmation Modal -->
        <ActionModal
            :show="getModalState(deleteRoleModal)"
            :title="t('role.prompt_delete')"
            :action-button-text="t('general.delete')"
            action-button-variant="danger"
            :loading="deleteLoading"
            @close="closeDeleteModal"
            @action="confirmDeleteRole"
        />
    </ContainerLarge>
</template>

<script setup>
import { computed } from 'vue'
import { useTranslation } from 'i18next-vue'

import { useRoleEditor } from "@/src/domain/access_control/composables/useRoleEditor";
import { useModal } from "@/src/core/composables/components/useModal"
import privilegeCodes from "@/src/config/constants/privileges.js";

import ContainerLarge from "@/src/core/components/blocks/ContainerLarge.vue";
import PageTitle from "@/src/core/components/text/PageTitle.vue";
import CardWrapper from "@/src/core/components/blocks/CardWrapper.vue";
import ContentLoader from "@/src/core/components/core/ContentLoader.vue";
import RelativeDiv from "@/src/core/components/blocks/RelativeDiv.vue";
import ButtonAction from "@/src/core/components/form/buttons/ButtonAction.vue";
import InputText from "@/src/core/components/form/inputs/InputText.vue";
import InputLabel from "@/src/core/components/form/inputs/InputLabel.vue";
import GroupMultiSelectInline from "@/src/core/components/form/inputs/GroupMultiSelectInline.vue";
import ActionItemList from "@/src/core/components/views/ActionItemList.vue";
import ActionModal from "@/src/core/components/modal/ActionModal.vue";

const { t } = useTranslation();

const {
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
    createRole,
    updateRole,
    deleteRole,
    clearSelectedRole
} = useRoleEditor()

const { openModal, closeModal, getModalState } = useModal();

const deleteRoleModal = 'delete-role';

const privilegeGroups = computed(() => [
    {
        name: t('access_control.user_privileges'),
        values: [
            { key: privilegeCodes.user_view, name: t('privileges.' + privilegeCodes.user_view) },
            { key: privilegeCodes.user_create, name: t('privileges.' + privilegeCodes.user_create) },
            { key: privilegeCodes.user_edit, name: t('privileges.' + privilegeCodes.user_edit) },
            { key: privilegeCodes.user_delete, name: t('privileges.' + privilegeCodes.user_delete) }
        ]
    },
    {
        name: t('access_control.role_privileges'),
        values: [
            { key: privilegeCodes.role_setup, name: t('privileges.' + privilegeCodes.role_setup) }
        ]
    }
])

const handleSubmit = async () => {
    if (selectedRoleID.value) {
        await updateRole(roleData.value);
    } else {
        await createRole(roleData.value);
    }
}

const openDeleteModal = () => openModal(deleteRoleModal);
const closeDeleteModal = () => closeModal(deleteRoleModal);

const confirmDeleteRole = async () => {
    await deleteRole(selectedRoleID.value);
    closeDeleteModal();
}
</script>
