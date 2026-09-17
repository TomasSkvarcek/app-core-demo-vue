import { useAuthStore } from '@/src/core/stores/useAuthStore';
import { route } from '@/src/core/routing';
import {after_login_redirect_route} from '@/src/config/constants/routing';

export function unauthenticatedGuard(to, from) {
    const auth = useAuthStore();

    if (auth.loggedInUser) {
        return route(after_login_redirect_route);
    }
}
