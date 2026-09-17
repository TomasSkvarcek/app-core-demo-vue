<template>
    <div>
        <InputLabel
            v-if="label"
            :id="id"
            :label="label"
            :show-as-required="showAsRequired"
            :css-class="labelCssClass"
        />

        <select
            :id="id"
            :name="name"
            :value="modelValue ?? ''"
            @change="handleChange"
            :disabled="disabled"
            :required="required"
            :class="selectClass"
            :autocomplete="autoComplete ? 'on' : 'off'"
        >
            <option v-if="emptyOption" value="">
                {{ emptyOption }}
            </option>

            <option
                v-for="option in options"
                :key="option[optionValueKey]"
                :value="option[optionValueKey]"
            >
                {{ option[optionNameKey] }}
            </option>
        </select>

        <ValidationError
            v-if="errors?.length > 0"
            :errors="errors"
            :css-class="errorMessageCssClass"
        />
    </div>
</template>

<script setup>
import { computed } from 'vue';
import InputLabel from "@/src/core/components/form/inputs/InputLabel.vue";
import ValidationError from "@/src/core/components/form/ValidationError.vue";

const props = defineProps({
    id: String,
    options: {
        type: Array,
        default: () => []
    },
    emptyOption: String,
    optionValueKey: {
        type: String,
        default: 'value'
    },
    optionNameKey: {
        type: String,
        default: 'name'
    },
    name: String,
    modelValue: [String, Number],
    label: String,
    errors: Array,
    disabled: Boolean,
    cssClass: String,
    addCssClass: String,
    errorMessageCssClass: String,
    labelCssClass: String,
    required: Boolean,
    size: {
        type: String,
        default: 'small'
    },
    setBottomMargin: {
        type: Boolean,
        default: true
    },
    showAsRequired: {
        type: Boolean,
        default: false
    },
    autoComplete: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['update:modelValue', 'change']);

const selectClass = computed(() => {
    let styling = 'form-select ';
    let errorStyling = 'form-select is-invalid ';

    if (props.size === 'small') {
        styling += 'form-select-sm ';
        errorStyling += 'form-select-sm ';
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

const handleChange = (event) => {
    emit('update:modelValue', event.target.value);
    emit('change', event.target.value);
}
</script>
