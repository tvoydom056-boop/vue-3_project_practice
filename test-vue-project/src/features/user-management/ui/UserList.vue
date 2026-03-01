<template>
  <div class="user-list">
    <div class="d-flex justify-space-between align-center mb-6">
      <h2 class="text-h5">Список пользователей</h2>
      <v-btn
        color="primary"
        prepend-icon="mdi-plus"
        @click="$emit('create')"
      >
        Добавить пользователя
      </v-btn>
    </div>

    <v-alert
      v-if="users.length === 0 && !loading"
      type="info"
      variant="tonal"
      class="mb-6"
    >
      <div class="d-flex align-center">
        <v-icon icon="mdi-information" class="mr-2" />
        <span>Пользователи не найдены. Начните с добавления первого пользователя.</span>
      </div>
    </v-alert>

    <v-progress-linear
      v-if="loading"
      indeterminate
      color="primary"
      class="mb-6"
    />

    <v-data-table
      v-if="users.length > 0"
      :headers="headers"
      :items="users"
      :items-per-page="10"
      class="elevation-1 rounded-lg"
    >
      <!-- eslint-disable-next-line vue/valid-v-slot -->
      <template #item.actions="{ item }">
        <div class="d-flex gap-2">
          <v-btn
            size="small"
            variant="text"
            color="info"
            icon="mdi-eye"
            @click="$emit('view', item)"
            title="Просмотреть"
          />
          <v-btn
            size="small"
            variant="text"
            color="warning"
            icon="mdi-pencil"
            @click="$emit('edit', item)"
            title="Редактировать"
          />
          <v-btn
            size="small"
            variant="text"
            color="error"
            icon="mdi-delete"
            @click="$emit('delete', item.id)"
            title="Удалить"
          />
        </div>
      </template>

      <template #no-data>
        <div class="text-center py-8">
          <v-icon size="48" color="grey-lighten-1" class="mb-4">mdi-account-off</v-icon>
          <p class="text-body-1 text-grey">Нет данных для отображения</p>
        </div>
      </template>
    </v-data-table>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { User } from '@/entities/user'

defineProps<{
  users: User[]
  loading: boolean
}>()

defineEmits<{
  create: []
  view: [user: User]
  edit: [user: User]
  delete: [id: number]
}>()

const headers = ref([
  { title: 'ID', key: 'id', width: '80px' },
  { title: 'Имя', key: 'name' },
  { title: 'Email', key: 'email' },
  { title: 'Телефон', key: 'phone' },
  { title: 'Имя пользователя', key: 'username' },
  { title: 'Действия', key: 'actions', sortable: false, width: '150px' }
])
</script>

<style scoped>
.user-list {
  width: 100%;
}
</style>
