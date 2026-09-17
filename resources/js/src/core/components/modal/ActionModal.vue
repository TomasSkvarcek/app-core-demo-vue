<template>
    <div ref="modalRef" class="modal fade" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-mt">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">{{ title }}</h5>
                    <button
                        type="button"
                        class="btn-close"
                        @click="close"
                        :disabled="loading"
                    ></button>
                </div>

                <div v-if="text" class="modal-body">
                    <PreWrap>{{ text }}</PreWrap>
                </div>

                <div class="modal-footer">
                    <ButtonAction
                        variant="secondary"
                        :disabled="loading"
                        @click="close"
                    >
                        {{ closeButtonText ?? t('general.close') }}
                    </ButtonAction>

                    <ButtonAction
                        :variant="actionButtonVariant"
                        :loading="loading"
                        @click="confirmAction"
                    >
                        {{ actionButtonText ?? t('general.ok') }}
                    </ButtonAction>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useTranslation } from 'i18next-vue';
import ButtonAction from "@/src/core/components/form/buttons/ButtonAction.vue";
import PreWrap from "@/src/core/components/text/PreWrap.vue";
import { Modal } from 'bootstrap';

const props = defineProps({
    show: Boolean,
    title: String,
    text: String,
    loading: Boolean,
    closeButtonText: String,
    actionButtonText: String,
    actionButtonVariant: { type: String, default: 'primary' }
})

const emit = defineEmits(['close', 'action']);

const { t } = useTranslation();
const modalRef = ref(null);
let bootstrapModal = null;

onMounted(() => {
    bootstrapModal = new Modal(modalRef.value, {
        backdrop: 'static',
        keyboard: true
    })
})

onUnmounted(() => {
    if (bootstrapModal) {
        bootstrapModal.dispose();
    }
})

watch(() => props.show, (val) => {
    if (!bootstrapModal) return;

    if (val) {
        bootstrapModal.show();
    } else {
        bootstrapModal.hide();
    }
})

const close = () => {
    emit('close');
}

const confirmAction = () => {
    emit('action');
}
</script>
