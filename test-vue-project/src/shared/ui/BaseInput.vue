<template>
  <v-text-field
    :model-value="modelValue"
    :label="label"
    :type="type"
    :placeholder="placeholder"
    :disabled="disabled"
    :readonly="readonly"
    :error="!!error"
    :error-messages="error"
    :rules="rules"
    :prepend-icon="prependIcon"
    :append-icon="appendIcon"
    :variant="variant"
    :density="density"
    :hide-details="hideDetails"
    @update:model-value="handleInput"
    class="base-input"
  />
</template>

<script setup lang="ts">

interface Props {
  modelValue: string | number
  label?: string
  type?: string
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  error?: string
  rules?: Array<(value: string | number) => boolean | string>
  prependIcon?: string
  appendIcon?: string
  variant?: 'underlined' | 'outlined' | 'filled' | 'solo' | 'plain'
  density?: 'default' | 'comfortable' | 'compact'
  hideDetails?: boolean | 'auto'
}

withDefaults(defineProps<Props>(), {
  type: 'text',
  disabled: false,
  readonly: false,
  variant: 'outlined',
  density: 'default',
  hideDetails: 'auto',
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
}>()

const handleInput = (value: string | number) => {
  emit('update:modelValue', value)
}
</script>

<style scoped>
.base-input {
  width: 100%;
}
</style>
