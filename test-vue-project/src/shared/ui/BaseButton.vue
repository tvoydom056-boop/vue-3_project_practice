<template>
  <v-btn
    :color="color"
    :variant="variant"
    :size="size"
    :disabled="disabled"
    :loading="loading"
    :prepend-icon="prependIcon"
    :append-icon="appendIcon"
    @click="handleClick"
    class="base-button"
  >
    <slot>{{ label }}</slot>
  </v-btn>
</template>

<script setup lang="ts">

interface Props {
  color?: string
  variant?: 'flat' | 'text' | 'elevated' | 'tonal' | 'outlined' | 'plain'
  size?: 'x-small' | 'small' | 'default' | 'large' | 'x-large'
  disabled?: boolean
  loading?: boolean
  prependIcon?: string
  appendIcon?: string
  label?: string
}

const props = withDefaults(defineProps<Props>(), {
  color: 'primary',
  variant: 'elevated',
  size: 'default',
  disabled: false,
  loading: false,
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>

<style scoped>
.base-button {
  text-transform: none;
  letter-spacing: normal;
}
</style>
