import { useRoute as useVueRoute } from 'vue-router'
import { route } from '@/src/core/routing'

export function useRoute() {
    const currentRoute = useVueRoute();

    const isRouteActive = (route_path) => {
        const targetPath = route(route_path, { id: currentRoute.params.id });
        return targetPath === currentRoute.path;
    }

    const isAnyRouteActive = (route_list) => {
        return route_list.some(route_path => {
            const targetPath = route(route_path, { id: currentRoute.params.id });
            return targetPath === currentRoute.path;
        })
    }

    return {
        isRouteActive,
        isAnyRouteActive
    }
}
