<template>
    <PageTitle :text="t('general.app_name')" />
</template>

<script setup>
import { useTranslation } from 'i18next-vue';
import PageTitle from "@/src/core/components/text/PageTitle.vue";

const { t } = useTranslation();
</script>
