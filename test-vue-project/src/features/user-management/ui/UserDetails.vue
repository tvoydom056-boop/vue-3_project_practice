<template>
  <v-card class="user-details">
    <v-card-title class="d-flex justify-space-between align-center">
      <span class="text-h5">Детали пользователя</span>
      <v-btn
        icon="mdi-close"
        variant="text"
        @click="$emit('close')"
      />
    </v-card-title>

    <v-card-text v-if="user">
      <v-row class="mb-4">
        <v-col cols="12" class="text-center">
          <v-avatar size="80" color="primary" class="mb-4">
            <span class="text-h4 text-white">{{ userInitials }}</span>
          </v-avatar>
          <h3 class="text-h6">{{ user.name }}</h3>
          <p class="text-body-2 text-medium-emphasis">{{ user.username }}</p>
        </v-col>
      </v-row>

      <v-divider class="my-4" />

      <v-row>
        <v-col cols="12" md="6">
          <v-list>
            <v-list-item>
              <template #prepend>
                <v-icon icon="mdi-email" />
              </template>
              <v-list-item-title>Email</v-list-item-title>
              <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle>
            </v-list-item>

            <v-list-item v-if="user.phone">
              <template #prepend>
                <v-icon icon="mdi-phone" />
              </template>
              <v-list-item-title>Телефон</v-list-item-title>
              <v-list-item-subtitle>{{ user.phone }}</v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-col>

        <v-col cols="12" md="6">
          <v-list v-if="user.address || user.company">
            <v-list-item v-if="user.address">
              <template #prepend>
                <v-icon icon="mdi-map-marker" />
              </template>
              <v-list-item-title>Адрес</v-list-item-title>
              <v-list-item-subtitle>
                {{ user.address.street }}, {{ user.address.city }} {{ user.address.zipcode }}
              </v-list-item-subtitle>
            </v-list-item>

            <v-list-item v-if="user.company">
              <template #prepend>
                <v-icon icon="mdi-office-building" />
              </template>
              <v-list-item-title>Компания</v-list-item-title>
              <v-list-item-subtitle>{{ user.company.name }}</v-list-item-subtitle>
            </v-list-item>
          </v-list>

          <v-alert
            v-else
            type="info"
            variant="tonal"
            class="mt-4"
          >
            <div class="d-flex align-center">
              <v-icon icon="mdi-information" class="mr-2" />
              <span>Дополнительная информация отсутствует</span>
            </div>
          </v-alert>
        </v-col>
      </v-row>
    </v-card-text>

    <v-card-actions>
      <v-spacer />
      <v-btn
        color="primary"
        variant="text"
        @click="$emit('close')"
      >
        Закрыть
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { User } from '@/entities/user'

const props = defineProps<{
  user: User | null
}>()

defineEmits<{
  close: []
}>()

const userInitials = computed(() => {
  const user = props.user
  if (!user?.name) return '?'
  return user.name
    .split(' ')
    .map((word: string) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})
</script>

<style scoped>
.user-details {
  max-width: 600px;
  margin: 0 auto;
}
</style>
