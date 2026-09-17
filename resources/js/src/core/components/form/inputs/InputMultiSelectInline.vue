<template>
    <div>
        <h4 v-if="label">{{ label }}</h4>

        <!-- Errors -->
        <Message v-if="errors?.length > 0" type="error">
            <div v-for="(error, index) in errors" :key="index">
                {{ error }}
            </div>
        </Message>

        <!-- Select All -->
        <div v-if="canSelectAll" class="form-check">
            <input
                class="form-check-input"
                type="checkbox"
                :id="id + '-select-all'"
                :checked="selectAll"
                @change="handleSelectAll"
                :disabled="disabled"
            />
            <label class="form-check-label" :for="id + '-select-all'">
                {{ t('general.select_all') }}
            </label>
        </div>

        <!-- Options -->
        <div
            v-for="option in options"
            :key="option[optionValueKey]"
            class="form-check"
        >
            <input
                class="form-check-input"
                type="checkbox"
                :id="id + '-' + option[optionValueKey]"
                :value="option[optionValueKey]"
                :checked="modelValue?.includes(option[optionValueKey])"
                @change="() => handleChange(option[optionValueKey])"
                :disabled="disabled"
            />
            <label class="form-check-label" :for="id + '-' + option[optionValueKey]">
                {{ option[optionNameKey] }}
            </label>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useTranslation } from 'i18next-vue';
import Message from "@/src/core/components/text/Message.vue";

const { t } = useTranslation();

const props = defineProps({
    id: String,
    options: {
        type: Array,
        default: () => []
    },
    canSelectAll: Boolean,
    optionValueKey: {
        type: String,
        default: 'value'
    },
    optionNameKey: {
        type: String,
        default: 'name'
    },
    modelValue: {
        type: Array,
        default: () => []
    },
    label: String,
    errors: Array,
    disabled: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['update:modelValue', 'change']);

const selectAll = ref(false);

// Sync selectAll state
watch(
    () => [props.modelValue, props.options],
    () => {
        const allValues = props.options.map(opt => opt[props.optionValueKey]);
        selectAll.value = props.modelValue?.length === allValues.length && allValues.length > 0;
    },
    { immediate: true }
)

const handleChange = (value) => {
    let newValues = [...(props.modelValue || [])];
    const index = newValues.indexOf(value);

    if (index >= 0) {
        newValues.splice(index, 1);
    } else {
        newValues.push(value);
    }

    emit('update:modelValue', newValues);
    emit('change', newValues);
}

const handleSelectAll = () => {
    const newSelectAll = !selectAll.value;
    selectAll.value = newSelectAll;

    if (newSelectAll) {
        const allValues = props.options.map(opt => opt[props.optionValueKey]);
        emit('update:modelValue', allValues);
        emit('change', allValues);
    } else {
        emit('update:modelValue', []);
        emit('change', []);
    }
}
</script>
