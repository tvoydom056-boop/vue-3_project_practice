<template>
  <div class="home-page">
    <!-- Features Section -->
    <section class="features-section py-12">
      <v-container>
        <v-row class="justify-center mb-8">
          <v-col cols="12" class="text-center">
            <h2 class="text-h4 text-h3-md font-weight-bold mb-4">Что проверяет проект</h2>
          </v-col>
        </v-row>

        <v-row class="justify-center">
          <v-col cols="12" md="6" lg="4" v-for="feature in features" :key="feature.title">
            <v-card
              class="feature-card pa-6 h-100"
              hover
              elevation="2"
            >
              <div class="feature-icon mb-4">
                <v-avatar :color="feature.color" size="60" class="elevation-2">
                  <v-icon size="32" color="white">{{ feature.icon }}</v-icon>
                </v-avatar>
              </div>

              <h3 class="text-h6 font-weight-bold mb-3">
                {{ feature.title }}
              </h3>

              <p class="text-body-2 text-medium-emphasis mb-4">
                {{ feature.description }}
              </p>

              <v-chip-group class="mt-auto">
                <v-chip
                  v-for="tag in feature.tags"
                  :key="tag"
                  size="small"
                  variant="outlined"
                >
                  {{ tag }}
                </v-chip>
              </v-chip-group>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>
  </div>
</template>

<script setup lang="ts">
const features = [
  {
    title: 'Vue 3 + Composition API',
    description: 'Современный подход к разработке компонентов с Composition API и TypeScript',
    icon: 'mdi-vuejs',
    color: 'primary',
    tags: ['Composition API', 'TypeScript', 'Reactivity'],
  },
  {
    title: 'Архитектура FSD',
    description: 'Feature-Sliced Design для масштабируемой и поддерживаемой архитектуры',
    icon: 'mdi-layers',
    color: 'secondary',
    tags: ['FSD', 'Масштабируемость', 'Поддерживаемость'],
  },
  {
    title: 'Состояние (Pinia)',
    description: 'Управление состоянием приложения с помощью современного Pinia store',
    icon: 'mdi-database',
    color: 'success',
    tags: ['Pinia', 'Store', 'Actions'],
  },
  {
    title: 'UI/UX с Vuetify 3',
    description: 'Современный UI с использованием компонентов Vuetify 3 и адаптивным дизайном',
    icon: 'mdi-palette',
    color: 'info',
    tags: ['Vuetify 3', 'Адаптивность', 'UI/UX'],
  },
  {
    title: 'Работа с API',
    description: 'Интеграция с REST API, обработка ошибок и мокирование данных',
    icon: 'mdi-api',
    color: 'warning',
    tags: ['REST API', 'Axios', 'Моки'],
  },
  {
    title: 'Маршрутизация',
    description: 'Навигация между страницами с Vue Router и lazy loading',
    icon: 'mdi-routes',
    color: 'error',
    tags: ['Vue Router', 'Lazy Loading', 'Навигация'],
  },
]

</script>

<style scoped>
.home-page {
  padding: 0;
}

.hero-section {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
}

.max-width-600 {
  max-width: 600px;
}

.max-width-800 {
  max-width: 800px;
}

.feature-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border-radius: 16px;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
}

.tech-card {
  transition: transform 0.3s ease, border-color 0.3s ease;
  border-radius: 12px;
}

.tech-card:hover {
  transform: translateY(-2px);
  border-color: var(--v-primary-base);
}

@media (min-width: 960px) {
  .text-h2-md {
    font-size: 2.5rem;
  }

  .text-h1-lg {
    font-size: 3rem;
  }
}
</style>
