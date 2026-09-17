<template>
  <span class="float-end">
    <ButtonAction
        variant="secondary"
        :disabled="disabled"
        :title="t('general.back')"
        @click="handleClick"
    >
      <i class="fa fa-arrow-left" aria-hidden="true"></i>
    </ButtonAction>
  </span>
</template>

<script setup>
import { useTranslation } from 'i18next-vue'
import ButtonAction from "@/src/core/components/form/buttons/ButtonAction.vue"

const props = defineProps({
    disabled: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['click']);

const { t } = useTranslation();

const handleClick = (event) => {
    emit('click', event);
}
</script>
