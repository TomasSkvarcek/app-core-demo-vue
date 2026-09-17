<template>
    <div>
        <PageTitle :text="t('user.view')" />

        <div v-if="can(privileges.user_create)" class="mb-3">
            <ButtonLink :link="route(routeNames.user_create)">
                {{ t('user.add') }}
            </ButtonLink>
        </div>

        <DataViewTable>
            <DataViewTableHeader>
                <!-- Search Row -->
                <tr>
                    <th>
                        <InputText
                            v-model="searchData.search.email"
                            id="search.email"
                            type="text"
                            :placeholder="t('user.email')"
                        />
                    </th>
                    <th>
                        <InputText
                            v-model="searchData.search.first_name"
                            id="search.first_name"
                            type="text"
                            :placeholder="t('user.first_name')"
                        />
                    </th>
                    <th>
                        <InputText
                            v-model="searchData.search.last_name"
                            id="search.last_name"
                            type="text"
                            :placeholder="t('user.last_name')"
                        />
                    </th>
                    <th>
                        <InputMultiSelect
                            v-model="searchData.search.role_ids"
                            id="search.roles"
                            :options="roles"
                            option-value-key="id"
                            option-name-key="name"
                            :label="t('user.roles')"
                            can-select-all
                        />
                    </th>
                    <th>
                        <InputDate
                            v-model="searchData.search.created_at"
                            id="search.created_at"
                            :placeholder="t('user.created_at')"
                        />
                    </th>
                    <th>
                        <InputSelect
                            v-model="searchData.search.active"
                            id="search.active"
                            :options="activeSelectOptions"
                            empty-option="All"
                        />
                    </th>
                    <th class="text-end">
                        <ButtonAction
                            variant="secondary"
                            size="small"
                            :disabled="usersLoading || rolesLoading"
                            @click="clearSearch"
                        >
                            {{ t('general.clear_filter') }}
                        </ButtonAction>
                    </th>
                </tr>

                <!-- Table Headers -->
                <tr>
                    <HeaderTh width="15%">{{ t('user.email') }}</HeaderTh>
                    <HeaderTh width="12%">{{ t('user.first_name') }}</HeaderTh>
                    <HeaderTh width="12%">{{ t('user.last_name') }}</HeaderTh>
                    <HeaderTh width="26%">{{ t('user.roles') }}</HeaderTh>
                    <HeaderTh width="15%">{{ t('user.created_at') }}</HeaderTh>
                    <HeaderTh width="10%">{{ t('user.active') }}</HeaderTh>
                    <HeaderTh width="10%">{{ t('general.action') }}</HeaderTh>
                </tr>
            </DataViewTableHeader>

            <DataViewTableBody>
                <ContentLoader :loading="usersLoading || rolesLoading" />

                <tr v-for="user in users?.data" :key="user.id">
                    <td>{{ user.email }}</td>
                    <td>{{ user.first_name }}</td>
                    <td>{{ user.last_name }}</td>
                    <td>{{ user.roles?.map(r => r.name).join(' | ') || '-' }}</td>
                    <td>{{ formatDateTimeOutput(user.created_at) }}</td>
                    <td>{{ user.active === 't' ? t('general.yes') : t('general.no') }}</td>
                    <NoWrapTableCol>
                        <ButtonIconConfigurableLink
                            v-if="can(privileges.user_edit)"
                            type="edit"
                            :link="route(routeNames.user_edit, { id: user.id })"
                            size="small"
                            :title="t('general.edit')"
                            add-css-class="me-2"
                        />
                        <ButtonIconConfigurableAction
                            v-if="user.id !== loggedInUserData?.user?.id && can(privileges.user_delete)"
                            type="delete"
                            @click="openDeleteModal(user.id)"
                            size="small"
                            :title="t('general.delete')"
                        />
                    </NoWrapTableCol>
                </tr>

                <DataViewTableNoData v-if="!users?.data?.length" :col-span="7" />
            </DataViewTableBody>
        </DataViewTable>

        <Pagination
            v-if="users?.data?.length > 0"
            :pagination-data="users.links"
            @page-changed="pageChanged"
        />

        <!-- Delete Confirmation Modal -->
        <ActionModal
            :show="getModalState(deleteUserModal)"
            :title="t('user.prompt_delete')"
            :action-button-text="t('general.delete')"
            action-button-variant="danger"
            :loading="formLoading"
            @close="closeDeleteModal"
            @action="confirmDeleteUser"
        />
    </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useTranslation } from 'i18next-vue';
import { useUserView } from "@/src/domain/user/composables/useUserView";
import { useAuthorization } from "@/src/core/composables/useAuthorization";
import { useModal } from "@/src/core/composables/components/useModal";
import { getBoolSelectOptions } from "@/src/core/helpers/inputHelper";
import { formatDateTimeOutput } from "@/src/core/helpers/dateHelper";
import PageTitle from "@/src/core/components/text/PageTitle.vue";
import DataViewTable from "@/src/core/components/blocks/DataViewTable.vue";
import DataViewTableHeader from "@/src/core/components/blocks/DataViewTableHeader.vue";
import DataViewTableBody from "@/src/core/components/blocks/DataViewTableBody.vue";
import HeaderTh from "@/src/core/components/blocks/HeaderTh.vue";
import NoWrapTableCol from "@/src/core/components/blocks/NoWrapTableCol.vue";
import DataViewTableNoData from "@/src/core/components/blocks/DataViewTableNoData.vue";
import ContentLoader from "@/src/core/components/core/ContentLoader.vue";
import ButtonAction from "@/src/core/components/form/buttons/ButtonAction.vue";
import ButtonLink from "@/src/core/components/form/buttons/ButtonLink.vue";
import ButtonIconConfigurableLink from "@/src/core/components/form/buttons/ButtonIconConfigurableLink.vue";
import ButtonIconConfigurableAction from "@/src/core/components/form/buttons/ButtonIconConfigurableAction.vue";
import InputText from "@/src/core/components/form/inputs/InputText.vue";
import InputSelect from "@/src/core/components/form/inputs/InputSelect.vue";
import InputMultiSelect from "@/src/core/components/form/inputs/InputMultiSelect.vue";
import InputDate from "@/src/core/components/form/inputs/InputDate.vue";
import Pagination from "@/src/core/components/views/Pagination.vue";
import ActionModal from "@/src/core/components/modal/ActionModal.vue";
import privileges from "@/src/config/constants/privileges.js";
import { routeNames } from "@/src/router/routeNames.js";
import { route } from "@/src/core/routing";
import {useGlobalStore} from "@/src/core/stores/useGlobalStore.js";
import {storeToRefs} from "pinia";

const { t } = useTranslation();

const {
    users,
    roles,
    rolesLoading,
    usersLoading,
    formLoading,
    deleteUser,
    searchData,
    clearSearch,
    pageChanged,
} = useUserView();

const { can } = useAuthorization();
const { openModal, closeModal, getModalState } = useModal();

const deleteUserModal = 'delete-user';
const activeSelectOptions = getBoolSelectOptions();

const globalStore = useGlobalStore();
const { data: globalStoreData } = storeToRefs(globalStore);
const loggedInUserData = computed(() => globalStoreData.value?.loggedInUserData);

const selectedDeleteUserId = ref(null);

const openDeleteModal = (user_id) => {
    selectedDeleteUserId.value = user_id;
    openModal(deleteUserModal);
}

const closeDeleteModal = () => {
    selectedDeleteUserId.value = null;
    closeModal(deleteUserModal);
}

const confirmDeleteUser = async () => {
    if (selectedDeleteUserId.value) {
        await deleteUser(selectedDeleteUserId.value);
    }
    closeDeleteModal();
}
</script>
