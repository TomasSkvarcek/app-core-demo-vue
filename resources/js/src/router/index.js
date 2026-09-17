import { createRouter, createWebHistory } from 'vue-router';

// Layouts
import ProtectedLayout from '@/src/domain/shared/views/layouts/ProtectedLayout.vue';
import UnauthenticatedLayout from "@/src/domain/shared/views/layouts/UnauthenticatedLayout.vue";

// Views
const Dashboard = () => import('@/src/domain/shared/views/Dashboard.vue');
const ChangePassword = () => import('@/src/domain/auth/views/ChangePassword.vue');
const UserView = () => import('@/src/domain/user/views/UserView.vue');
const UserEditor = () => import('@/src/domain/user/views/UserEditor.vue');
const RoleEditor = () => import('@/src/domain/access_control/views/RoleEditor.vue');

const Login = () => import('@/src/domain/auth/views/Login.vue');
const CreatePassword = () => import('@/src/domain/auth/views/CreatePassword.vue');
const ResetPassword = () => import('@/src/domain/auth/views/ResetPassword.vue');
const ForgotPassword = () => import('@/src/domain/auth/views/ForgotPassword.vue');
const NotFound = () => import('@/src/domain/shared/views/NotFound.vue');

import { route } from '@/src/core/routing';
import { routeNames } from '@/src/router/routeNames';
import {protectedGuard} from "@/src/core/routing/guards/protectedGuard.js";
import {unauthenticatedGuard} from "@/src/core/routing/guards/unauthenticatedGuard.js";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: ProtectedLayout,
            beforeEnter: protectedGuard,
            children: [
                { path: route(routeNames.dashboard), component: Dashboard },
                { path: route(routeNames.password_change), component: ChangePassword },
                { path: route(routeNames.users_view), component: UserView },
                { path: route(routeNames.user_create), component: UserEditor },
                { path: route(routeNames.user_edit), component: UserEditor },
                { path: route(routeNames.role_editor), component: RoleEditor },
            ]
        },
        {
            path: '/',
            component: UnauthenticatedLayout,
            beforeEnter: unauthenticatedGuard,
            children: [
                { path: route(routeNames.login), component: Login },
                { path: route(routeNames.password_create), component: CreatePassword },
                { path: route(routeNames.password_reset), component: ResetPassword },
                { path: route(routeNames.forgot_password), component: ForgotPassword },
            ]
        },
        {
            path: '/:pathMatch(.*)*',
            component: NotFound
        }
    ]
})

export default router
