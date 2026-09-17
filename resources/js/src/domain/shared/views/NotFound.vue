<template>
    <div class="container">
        <div class="row" style="height: 100vh">
            <div class="col-12 text-center" style="margin-top: 44vh">
                <PageTitle :text="t('general.page_not_found')" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { useTranslation } from 'i18next-vue';
import PageTitle from "@/src/core/components/text/PageTitle.vue";

const { t } = useTranslation();
</script>
