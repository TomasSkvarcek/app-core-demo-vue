<template>
    <nav class="navbar navbar-expand-lg bg-primary navbar-dark fixed-top">
        <div class="container-fluid">
            <!-- Authenticated Menu -->
            <div v-if="loggedInUser" class="d-flex w-100 align-items-center">
                <NamedLink :link="routeNames.dashboard" css-class="navbar-brand">
                    {{ t('general.app_name') }}
                </NamedLink>

                <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                        data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                        aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>

                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                        <li v-if="can(privileges.user_view)" class="nav-item">
                            <NamedLink
                                :link="routeNames.users_view"
                                :css-class="isAnyRouteActive(routeGroups.user) ? 'nav-link active' : 'nav-link'">
                                {{ t('menu.users') }}
                            </NamedLink>
                        </li>

                        <li v-if="can(privileges.role_setup)" class="nav-item">
                            <NamedLink
                                :link="routeNames.role_editor"
                                :css-class="isRouteActive(routeNames.role_editor) ? 'nav-link active' : 'nav-link'">
                                {{ t('menu.roles') }}
                            </NamedLink>
                        </li>
                    </ul>

                    <!-- Profile Dropdown -->
                    <ul class="navbar-nav dropdown-menu-end mb-2 mb-lg-0">
                        <li class="nav-item dropdown">
                          <span class="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown"
                                aria-expanded="false" :title="loggedInUserData?.user?.email">
                            <span class="fa-solid fa-user"></span> {{ t('menu.profile') }}
                          </span>
                            <ul class="dropdown-menu dropdown-menu-end">
                                <li>
                                    <span class="dropdown-item disabled">{{ loggedInUserData?.user?.email }}</span>
                                </li>
                                <li><hr class="dropdown-divider"></li>
                                <li>
                                    <NamedLink
                                        :link="routeNames.password_change"
                                        :css-class="isRouteActive(routeNames.password_change) ? 'dropdown-item active' : 'dropdown-item'">
                                        {{ t('menu.password_change') }}
                                    </NamedLink>
                                </li>
                                <li>
                                    <a class="dropdown-item" href="#" @click.prevent="auth.logout(false)">
                                        {{ t('auth.logout') }}
                                    </a>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>

            <!-- Guest Menu -->
            <div v-else class="d-flex w-100 align-items-center">
                <NamedLink :link="routeNames.dashboard" css-class="navbar-brand">
                    {{ t('general.app_name') }}
                </NamedLink>

                <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                        data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                        aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>

                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0"></ul>
                    <ul class="navbar-nav dropdown-menu-end mb-2 mb-lg-0">
                        <li class="nav-item">
                            <NamedLink
                                :link="routeNames.login"
                                :css-class="isRouteActive(routeNames.login) ? 'nav-link active' : 'nav-link'">
                                {{ t('auth.login') }}
                            </NamedLink>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </nav>
</template>

<script setup>
import { computed } from 'vue';
import { useTranslation } from 'i18next-vue';

import { useAuthStore } from "@/src/core/stores/useAuthStore.js";
import { useGlobalStore } from "@/src/core/stores/useGlobalStore.js";
import { useAuthorization } from "@/src/core/composables/useAuthorization.js";
import { useRoute } from "@/src/core/composables/useRoute.js";

import NamedLink from "@/src/core/components/core/NamedLink.vue";
import privileges from "@/src/config/constants/privileges.js";
import { routeNames } from "@/src/router/routeNames.js";
import {storeToRefs} from "pinia";

const { t } = useTranslation();

const auth = useAuthStore();
const globalStore = useGlobalStore();
const { data: globalStoreData} = storeToRefs(globalStore);
const { can } = useAuthorization();
const { isRouteActive, isAnyRouteActive } = useRoute();

const loggedInUser = computed(() => auth.loggedInUser);
const loggedInUserData = computed(() => globalStoreData.value?.loggedInUserData);

const routeGroups = {
    user: [routeNames.users_view, routeNames.user_create, routeNames.user_edit]
}
</script>
