<template>
    <div class="btn-group">
        <!-- Dropdown Button -->
        <button
            ref="dropdownRef"
            :class="buttonClass"
            type="button"
            data-bs-toggle="dropdown"
            data-bs-auto-close="outside"
            aria-expanded="false"
        >
            {{ label }}
            <span v-if="modelValue?.length > 0">({{ modelValue.length }})</span>
        </button>

        <!-- Dropdown Menu -->
        <ul
            class="dropdown-menu dropdown-menu-select"
            :style="{ maxHeight: maxHeight, overflowY: 'auto' }"
        >
            <!-- Select All -->
            <li v-if="canSelectAll" class="form-check">
                <input
                    class="form-check-input"
                    type="checkbox"
                    :id="id + '-select-all'"
                    :checked="selectAll"
                    @change="handleSelectAll"
                />
                <label class="form-check-label" :for="id + '-select-all'">
                    {{ t('general.select_all') }}
                </label>
            </li>

            <!-- Options -->
            <template v-if="useGroupedOptions">
                <template v-for="option in options" :key="option.group_name || option[optionValueKey]">
                    <!-- Group Header -->
                    <li v-if="option.group_name && option.options" class="form-check">
                        <input
                            class="form-check-input"
                            type="checkbox"
                            :id="id + '-group-' + option.group_name"
                            :checked="selectedGroups.includes(option.group_name)"
                            @change="() => handleSelectGroup(option.group_name)"
                        />
                        <label class="form-check-label fw-bold" :for="id + '-group-' + option.group_name">
                            {{ option.group_name }}
                        </label>
                    </li>

                    <!-- Group Items -->
                    <li
                        v-for="subOption in (option.options || [option])"
                        v-if="option.group_name ? true : true"
                        :key="subOption[optionValueKey]"
                        class="form-check"
                    >
                        <input
                            class="form-check-input"
                            type="checkbox"
                            :id="id + '-' + subOption[optionValueKey]"
                            :value="subOption[optionValueKey]"
                            :checked="modelValue?.includes(subOption[optionValueKey])"
                            @change="() => handleChange(subOption[optionValueKey])"
                        />
                        <label class="form-check-label" :for="id + '-' + subOption[optionValueKey]">
                            {{ subOption[optionNameKey] }}
                        </label>
                    </li>
                </template>
            </template>

            <!-- Flat Options -->
            <template v-else>
                <li
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
                    />
                    <label class="form-check-label" :for="id + '-' + option[optionValueKey]">
                        {{ option[optionNameKey] }}
                    </label>
                </li>
            </template>
        </ul>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useTranslation } from 'i18next-vue';
const { t } = useTranslation();

const props = defineProps({
    id: String,
    options: { type: Array, default: () => [] },
    canSelectAll: Boolean,
    optionValueKey: { type: String, default: 'value' },
    optionNameKey: { type: String, default: 'name' },
    modelValue: { type: Array, default: () => [] },
    label: String,
    cssClass: String,
    addCssClass: String,
    size: { type: String, default: 'small' },
    setBottomMargin: { type: Boolean, default: true },
    useGroupedOptions: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue', 'change']);

const dropdownRef = ref(null);
const selectAll = ref(false);
const selectedGroups = ref([]);
const maxHeight = ref('auto');

// Button styling
const buttonClass = computed(() => {
    let styling = 'btn btn-dropdown-select dropdown-toggle ';
    if (props.size === 'small') styling += 'btn-sm ';
    if (props.setBottomMargin) styling += 'mb-1 ';
    if (props.addCssClass) styling += ' ' + props.addCssClass;
    if (props.cssClass) return props.cssClass;

    return styling;
})

// Dynamic dropdown height
const updateMaxHeight = () => {
    if (!dropdownRef.value) return;

    const rect = dropdownRef.value.getBoundingClientRect();
    const available = window.innerHeight - rect.bottom - 20;
    maxHeight.value = `${available}px`;
}

onMounted(() => {
    window.addEventListener('resize', updateMaxHeight);
    window.addEventListener('scroll', updateMaxHeight);
    updateMaxHeight();
})

onUnmounted(() => {
    window.removeEventListener('resize', updateMaxHeight);
    window.removeEventListener('scroll', updateMaxHeight);
})

// Watch modelValue to update selectAll & selectedGroups
watch(() => props.modelValue, (newValues) => {
    const allValues = [];

    props.options.forEach(option => {
        if (option.options) {
            option.options.forEach(sub => allValues.push(sub[props.optionValueKey]));
        } else {
            allValues.push(option[props.optionValueKey]);
        }
    })

    selectAll.value =
        newValues?.length > 0 &&
        newValues.length === allValues.length;

    // Update selected groups
    selectedGroups.value = props.options
        .filter(opt => opt.group_name && opt.options)
        .map(group => {
            const allSelected = group.options.every(sub =>
                newValues?.includes(sub[props.optionValueKey])
            )
            return allSelected ? group.group_name : null;
        })
        .filter(Boolean)
}, { immediate: true })

// Handlers
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

const handleSelectGroup = (groupName) => {
    const group = props.options.find(opt => opt.group_name === groupName);
    if (!group?.options) return;

    let newValues = [...(props.modelValue || [])];

    const allGroupValues = group.options.map(opt => opt[props.optionValueKey]);
    const allAlreadySelected = allGroupValues.every(v => newValues.includes(v));

    if (allAlreadySelected) {
        // Deselect group
        newValues = newValues.filter(v => !allGroupValues.includes(v));
    } else {
        // Select group
        allGroupValues.forEach(v => {
            if (!newValues.includes(v)) newValues.push(v);
        })
    }

    emit('update:modelValue', newValues);
    emit('change', newValues);
}

const handleSelectAll = () => {
    const newSelectAll = !selectAll.value;
    selectAll.value = newSelectAll;

    if (newSelectAll) {
        const allValues = [];
        const allGroups = [];

        props.options.forEach(option => {
            if (option.options && option.group_name) {
                allGroups.push(option.group_name);
                option.options.forEach(sub => allValues.push(sub[props.optionValueKey]));
            } else {
                allValues.push(option[props.optionValueKey]);
            }
        })

        selectedGroups.value = allGroups;
        emit('update:modelValue', allValues);
        emit('change', allValues);
    } else {
        selectedGroups.value = [];
        emit('update:modelValue', []);
        emit('change', []);
    }
}
</script>
