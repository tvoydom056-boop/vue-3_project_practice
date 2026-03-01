<template>
  <v-card class="user-form">
    <v-card-title class="d-flex justify-space-between align-center">
      <span class="text-h5">{{ title }}</span>
      <v-btn
        icon="mdi-close"
        variant="text"
        @click="$emit('cancel')"
      />
    </v-card-title>

    <v-card-text>
      <v-form @submit.prevent="handleSubmit">
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="formData.name"
              label="Имя *"
              :rules="[requiredRule]"
              required
              outlined
              dense
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model="formData.email"
              label="Email *"
              :rules="[requiredRule, emailRule]"
              type="email"
              required
              outlined
              dense
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model="formData.username"
              label="Имя пользователя *"
              :rules="[requiredRule]"
              required
              outlined
              dense
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model="formData.phone"
              label="Телефон"
              outlined
              dense
            />
          </v-col>
        </v-row>

        <v-alert
          v-if="error"
          type="error"
          variant="tonal"
          class="mb-4"
        >
          {{ error }}
        </v-alert>

        <v-card-actions class="pa-0 pt-4">
          <v-spacer />
          <v-btn
            variant="text"
            @click="$emit('cancel')"
            :disabled="loading"
          >
            Отмена
          </v-btn>
          <v-btn
            color="primary"
            type="submit"
            :loading="loading"
            :disabled="!isFormValid"
          >
            {{ mode === 'create' ? 'Создать' : 'Сохранить' }}
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { User, UserFormData } from '@/entities/user'

const props = defineProps<{
  mode: 'create' | 'edit'
  user?: User | null
  loading: boolean
  error?: string
}>()

const emit = defineEmits<{
  submit: [data: UserFormData]
  cancel: []
}>()

const formData = ref<UserFormData>({
  name: '',
  email: '',
  phone: '',
  username: ''
})

const title = computed(() => {
  return props.mode === 'create' ? 'Добавить пользователя' : 'Редактировать пользователя'
})

const requiredRule = (value: string) => !!value || 'Обязательное поле'
const emailRule = (value: string) => {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return pattern.test(value) || 'Введите корректный email'
}

const isFormValid = computed(() => {
  return formData.value.name &&
         formData.value.email &&
         formData.value.username &&
         emailRule(formData.value.email) === true
})

const handleSubmit = () => {
  if (isFormValid.value) {
    emit('submit', formData.value)
  }
}

// Инициализация формы при получении данных пользователя
watch(() => props.user, (user) => {
  if (user) {
    formData.value = {
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      username: user.username,
      street: user.address?.street,
      city: user.address?.city,
      zipcode: user.address?.zipcode,
      companyName: user.company?.name
    }
  } else {
    formData.value = {
      name: '',
      email: '',
      phone: '',
      username: ''
    }
  }
}, { immediate: true })
</script>

<style scoped>
.user-form {
  max-width: 800px;
  margin: 0 auto;
}
</style>
