import { useAuthStore } from '@/src/core/stores/useAuthStore';
import { route } from '@/src/core/routing';
import { unauthorized_redirect_route } from '@/src/config/constants/routing';

export function protectedGuard(to, from) {
    const auth = useAuthStore();

    if (!auth.loggedInUser) {
        return route(unauthorized_redirect_route);
    }
}
