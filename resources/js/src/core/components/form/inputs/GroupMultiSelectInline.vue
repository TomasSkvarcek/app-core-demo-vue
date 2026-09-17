<template>
    <div>
        <h3 v-if="label">{{ label }}</h3>

        <!-- Errors -->
        <Message v-if="errors?.length > 0" type="error">
            <div v-for="(error, index) in errors" :key="index">
                {{ error }}
            </div>
        </Message>

        <!-- Select All -->
        <div v-if="canSelectAll" class="form-check mb-3">
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

        <!-- Grouped Options -->
        <div class="row row-cols-auto mt-4">
            <div
                v-for="(group, index) in groupSettings"
                :key="index"
                class="col"
            >
                <h4>{{ group.name }}</h4>

                <div
                    v-for="value in group.values"
                    :key="value[groupSettingKey]"
                    class="form-check"
                >
                    <input
                        class="form-check-input"
                        type="checkbox"
                        :id="id + '-' + getOptionValue(value)"
                        :checked="modelValue?.includes(getOptionValue(value))"
                        @change="() => handleChange(getOptionValue(value))"
                        :disabled="disabled"
                    />
                    <label class="form-check-label" :for="id + '-' + getOptionValue(value)">
                        {{ value[groupSettingNameKey] }}
                    </label>
                </div>
            </div>
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
    options: { type: Array, default: () => [] },
    groupSettings: { type: Array, default: () => [] },
    canSelectAll: Boolean,
    optionValueKey: { type: String, default: 'value' },
    optionNameKey: { type: String, default: 'name' },
    groupSettingKey: { type: String, default: 'key' },
    groupSettingNameKey: { type: String, default: 'name' },
    modelValue: { type: Array, default: () => [] },
    label: String,
    errors: Array,
    disabled: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue', 'change']);

const selectAll = ref(false);

// Update "Select All" state
watch(
    () => [props.modelValue, props.options],
    () => {
        const allValues = props.options.map(opt => opt[props.optionValueKey]);
        selectAll.value = props.modelValue?.length === allValues.length && allValues.length > 0;
    },
    { immediate: true }
)

const getOptionValue = (valueItem) => {
    const option = props.options.find(opt =>
        opt[props.optionNameKey] === valueItem[props.groupSettingKey]
    );
    return option ? option[props.optionValueKey] : null;
}

const handleChange = (value) => {
    if (!value) return;

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
