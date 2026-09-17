<template>
    <div>
        <InputLabel
            v-if="label"
            :id="id"
            :label="label"
            :show-as-required="showAsRequired"
            :css-class="labelCssClass"
        />

        <div :class="{ 'is-invalid': errors?.length > 0 }">
            <VueDatePicker
                v-model="internalValue"
                :placeholder="placeholder"
                :formats="datePickerFormats"
                :disabled="disabled"
                :ui="uiConfig"
                :input-attrs="inputAttrs"
                :min-date="minDate"
                :max-date="maxDate"
                :disabled-dates="disabledDates"
                :disabled-times="disabledTimes"
                :time-config="timeConfig"
                :start-date="openToDate"
                :aria-labels="ariaLabels"
                :auto-apply="!showTimeSelect"
                @update:model-value="handleChange"
            />
        </div>

        <ValidationError
            v-if="errors?.length > 0"
            :errors="errors"
            :css-class="errorMessageCssClass"
        />
    </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useTranslation } from 'i18next-vue';
import { VueDatePicker } from '@vuepic/vue-datepicker';
import ValidationError from "@/src/core/components/form/ValidationError.vue";
import InputLabel from "@/src/core/components/form/inputs/InputLabel.vue";

import { date_picker_date_format, date_picker_datetime_format, time_format } from "@/src/config/constants/date.js";
import { formatDateTimeInput } from "@/src/core/helpers/dateHelper.js";

const { t } = useTranslation();

const props = defineProps({
    id: String,
    modelValue: [String, Date],
    label: String,
    errors: Array,
    disabled: Boolean,
    cssClass: String,
    addCssClass: String,
    errorMessageCssClass: String,
    labelCssClass: String,
    placeholder: String,
    size: { type: String, default: 'small' },
    setBottomMargin: { type: Boolean, default: true },
    showAsRequired: { type: Boolean, default: false },
    returnDateString: { type: Boolean, default: true },
    showTimeSelect: { type: Boolean, default: false },
    timeFormat: { type: String, default: time_format },
    timeIntervals: { type: Number, default: 30 },
    minDate: [String, Date],
    maxDate: [String, Date],
    filterDate: Function,
    filterTime: Function,
    openToDate: [String, Date]
})

const emit = defineEmits(['update:modelValue', 'change']);

const internalValue = ref(props.modelValue ? new Date(props.modelValue) : null);

const dateFormat = computed(() => {
    return props.showTimeSelect ? date_picker_datetime_format : date_picker_date_format;
})

const datePickerFormats = computed(() => ({
    input: dateFormat.value,
    preview: dateFormat.value,
}))

const timeConfig = computed(() => ({
    enableTimePicker: props.showTimeSelect,
    minutesIncrement: props.timeIntervals,
    is24: props.timeFormat.includes('HH'),
}))

const inputAttrs = computed(() => ({
    id: props.id,
    autocomplete: 'off',
    clearable: true,
    hideInputIcon: true,
}))

const uiConfig = computed(() => ({
    input: inputClass.value,
}))

const ariaLabels = computed(() => ({
    timePicker: t('general.time_picker_caption'),
}))

const disabledDates = computed(() => {
    return props.filterDate ? (date) => !props.filterDate(date) : undefined;
})

const disabledTimes = computed(() => {
    return props.filterTime ? (time) => !props.filterTime(time) : undefined;
})

const inputClass = computed(() => {
    let styling = 'form-control ';
    let errorStyling = 'form-control is-invalid ';

    if (props.size === 'small') {
        styling += 'form-control-sm ';
        errorStyling += 'form-control-sm ';
    }
    if (props.setBottomMargin) {
        styling += 'mb-1 ';
        errorStyling += 'mb-1 ';
    }
    if (props.addCssClass) {
        styling += ' ' + props.addCssClass;
        errorStyling += ' ' + props.addCssClass;
    }

    if (props.cssClass) return props.cssClass;
    return props.errors?.length > 0 ? errorStyling : styling;
})

const handleChange = (date) => {
    let valueToEmit = date;

    if (date && props.returnDateString) {
        valueToEmit = formatDateTimeInput(date);
    }

    emit('update:modelValue', valueToEmit);
    emit('change', valueToEmit);
}

// Sync external modelValue changes
watch(() => props.modelValue, (newVal) => {
    internalValue.value = newVal ? new Date(newVal) : null;
})
</script>
