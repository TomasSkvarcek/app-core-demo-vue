import { computed } from 'vue'
import { useGlobalStore } from '@/src/core/stores/useGlobalStore'
import { useCustomAuthorization } from "@/src/config/authorization/useCustomAuthorization.js"
import { isObjectEmpty } from "@/src/core/helpers/objectHelper.js"
import {storeToRefs} from "pinia";

export function useAuthorization() {
    const globalStore = useGlobalStore();
    const { data: globalStoreData} = storeToRefs(globalStore);
    const {
        useBackendPrivileges,
        allowCustomAuthorization,
        runCustomAuthorization
    } = useCustomAuthorization();

    const user = computed(() => globalStoreData.value?.loggedInUserData?.user);
    const user_privileges = computed(() => globalStoreData.value?.loggedInUserData?.privileges);

    function can(privilege, context = null) {
        if (useBackendPrivileges) {
            if (isObjectEmpty(user_privileges.value) || !user_privileges.value.hasOwnProperty(privilege)) {
                return false;
            }
        }

        if (allowCustomAuthorization) {
            const result = runCustomAuthorization(privilege, context)
            if (result !== 0) {
                return result;
            }
        }

        if (useBackendPrivileges) {
            if (user_privileges.value?.[privilege]) {
                return checkContextConditions(privilege, context);
            }
        }

        return true;
    }

    function canAny(privileges) {
        for (const item of privileges) {
            if (can(item.privilege, item.context)) {
                return true;
            }
        }
        return false;
    }

    function canAll(privileges) {
        for (const item of privileges) {
            if (!can(item.privilege, item.context)) {
                return false;
            }
        }
        return true;
    }

    function checkContextConditions(privilege, context = null) {
        if (isObjectEmpty(context)) {
            return false;
        }

        const rules = user_privileges.value[privilege];
        const group_condition_results = {};

        Object.entries(rules).forEach(([key, group_rules]) => {
            group_condition_results[key] = true;

            for (const condition of group_rules) {
                if (user.value?.[condition.authenticable_field] !== context?.[condition.context_field]) {
                    group_condition_results[key] = false;
                    break;
                }
            }
        })

        return Object.values(group_condition_results).includes(true);
    }

    return {
        can,
        canAny,
        canAll
    }
}
