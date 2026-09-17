<template>
    <div>
        <InputLabel
            v-if="label"
            :id="id"
            :label="label"
            :show-as-required="showAsRequired"
            :css-class="labelCssClass"
        />

        <input
            :type="type"
            :id="id"
            :name="name"
            :value="modelValue ?? ''"
            @input="handleInput"
            @blur="handleBlur"
            :disabled="disabled"
            :readonly="readonly"
            :required="required"
            :class="inputClass"
            :placeholder="placeholder"
            :maxlength="maxlength"
            :autocomplete="autoComplete ? 'on' : 'off'"
        />

        <ValidationError
            v-if="errors?.length > 0"
            :errors="errors"
            :css-class="errorMessageCssClass"
        />
    </div>
</template>

<script setup>
import { computed } from 'vue';
import ValidationError from "@/src/core/components/form/ValidationError.vue";
import InputLabel from "@/src/core/components/form/inputs/InputLabel.vue";

const props = defineProps({
    id: String,
    type: { type: String, default: 'text' },
    name: String,
    modelValue: [String, Number],
    label: String,
    errors: Array,
    disabled: Boolean,
    cssClass: String,
    addCssClass: String,
    errorMessageCssClass: String,
    labelCssClass: String,
    placeholder: String,
    maxlength: [String, Number],
    readonly: Boolean,
    required: Boolean,
    size: { type: String, default: 'small' },
    setBottomMargin: { type: Boolean, default: true },
    showAsRequired: { type: Boolean, default: false },
    autoComplete: { type: Boolean, default: true }
})

const emit = defineEmits(['update:modelValue', 'blur', 'input']);

const inputClass = computed(() => {
    let base = 'form-control ';
    if (props.size === 'small') base += 'form-control-sm ';
    if (props.setBottomMargin) base += 'mb-1 ';
    if (props.addCssClass) base += ' ' + props.addCssClass;

    if (props.cssClass) return props.cssClass;
    return props.errors?.length > 0 ? base + 'is-invalid' : base;
})

const handleInput = (event) => {
    emit('update:modelValue', event.target.value);
    emit('input', event.target.value);
}

const handleBlur = (event) => {
    emit('blur', event.target.value);
}
</script>
