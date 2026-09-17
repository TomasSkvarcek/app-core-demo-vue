<template>
    <tr>
        <td :colspan="colSpan">
            <h4 class="text-center mt-1">
                {{ t('general.no_data') }}
            </h4>
        </td>
    </tr>
</template>

<script setup>
import { useTranslation } from 'i18next-vue';

const { t } = useTranslation();

const props = defineProps({
    colSpan: {
        type: [String, Number],
        required: true
    }
})
</script>
