<script setup lang="ts">
import { RouterView } from "vue-router";
import { ref, onMounted, computed } from "vue";
import { useTheme } from "vuetify";
import { useRoute } from "vue-router";

const drawer = ref(false);
const theme = useTheme();
const route = useRoute();

const THEME_STORAGE_KEY = "vue-test-theme";

// Определяем текущую тему из localStorage или системных предпочтений
const getInitialTheme = (): string => {
  // Проверяем сохранённую тему
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  if (savedTheme) {
    return savedTheme;
  }

  // Проверяем системные предпочтения
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }

  return 'light';
};

// Функция для обработки изменений системных предпочтений
const handleSystemThemeChange = (e: MediaQueryListEvent) => {
  // Меняем тему только если пользователь не выбрал тему вручную
  if (!localStorage.getItem(THEME_STORAGE_KEY)) {
    theme.global.name.value = e.matches ? 'dark' : 'light';
  }
};

// Инициализируем тему при загрузке
onMounted(() => {
  const initialTheme = getInitialTheme();
  theme.global.name.value = initialTheme;

  // Добавляем слушатель для системных предпочтений
  const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  darkModeMediaQuery.addEventListener('change', handleSystemThemeChange);

  // Очистка при размонтировании
  return () => {
    darkModeMediaQuery.removeEventListener('change', handleSystemThemeChange);
  };
});

const toggleTheme = () => {
  const newTheme = theme.global.current.value.dark ? "light" : "dark";
  theme.global.name.value = newTheme;
  // Сохраняем в localStorage
  localStorage.setItem(THEME_STORAGE_KEY, newTheme);
  // Показываем уведомление
  showThemeChangeNotification(newTheme);
};

const themeTooltip = computed(() => {
  return theme.global.current.value.dark ? "Переключить на светлую тему" : "Переключить на тёмную тему";
});

// Для отображения уведомления (опционально)
const showThemeNotification = ref(false);
const themeNotificationMessage = ref('');

const showThemeChangeNotification = (newTheme: string) => {
  themeNotificationMessage.value = newTheme === 'dark' ? 'Тёмная тема включена' : 'Светлая тема включена';
  showThemeNotification.value = true;

  setTimeout(() => {
    showThemeNotification.value = false;
  }, 2000);
};
</script>

<template>
  <v-app>
    <v-app-bar color="surface" elevation="2" class="px-4" height="70">
      <v-app-bar-nav-icon @click="drawer = !drawer" class="d-md-none">
        <v-icon>mdi-menu</v-icon>
      </v-app-bar-nav-icon>

      <v-app-bar-title class="d-flex align-center">
        <div class="d-flex align-center mr-4">
          <div class="logo-icon mr-2">
            <v-icon color="primary" size="32">mdi-vuejs</v-icon>
          </div>
          <router-link to="/" class="text-primary text-decoration-none text-h5 font-weight-bold">
            VueTest<span class="text-secondary">.dev</span>
          </router-link>
        </div>
        <div class="text-caption text-medium-emphasis ml-2 d-none d-md-block">
          Тестовый проект для разработчиков
        </div>
      </v-app-bar-title>

      <template #append>
        <div class="d-flex align-center gap-3">
          <v-btn
            to="/products"
            variant="text"
            class="text-on-surface font-weight-medium d-none d-md-flex"
            :class="{ 'text-primary': route.path === '/products' }"
          >
            <v-icon start icon="mdi-package-variant" />
            Продукты
          </v-btn>

          <v-btn
            variant="text"
            @click="toggleTheme"
            class="ml-2 theme-toggle-btn px-0"
            :title="themeTooltip"
            aria-label="Переключить тему"
            min-width="40"
            height="40"
          >
            <div class="theme-toggle-inner">
              <div class="theme-toggle-circle" :class="{ 'dark-theme': theme.global.current.value.dark }">
                <div class="theme-icon-wrapper">
                  <v-icon v-if="theme.global.current.value.dark" size="18" color="gray-darken-3" class="theme-icon">mdi-moon-waning-crescent</v-icon>
                  <v-icon v-else size="18" color="gray-darken-3" class="theme-icon">mdi-white-balance-sunny</v-icon>
                </div>
              </div>
            </div>
          </v-btn>
        </div>
      </template>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" temporary>
      <v-list>
        <v-list-item to="/users" prepend-icon="mdi-account-group" title="Пользователи" />
        <v-list-item to="/products" prepend-icon="mdi-package-variant" title="Продукты" />
      </v-list>
    </v-navigation-drawer>

    <v-main class="bg-background">
      <v-container fluid class="pa-0">
        <RouterView />
      </v-container>
    </v-main>

    <!-- Уведомление о смене темы -->
    <v-snackbar
      v-model="showThemeNotification"
      :timeout="2000"
      location="bottom right"
      color="primary"
    >
      {{ themeNotificationMessage }}
    </v-snackbar>
  </v-app>
</template>

<style scoped>
.text-decoration-none {
  text-decoration: none;
}

/* Стили для кастомной кнопки переключения темы */
.theme-toggle-inner {
  position: relative;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.theme-toggle-circle {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%); /* Светло-серый градиент для светлой темы */
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.theme-toggle-circle::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.theme-toggle-circle:hover::before {
  opacity: 1;
}

.theme-toggle-circle.dark-theme {
  background: linear-gradient(135deg, #ffffff 0%, #f3f4f6 100%); /* Белый градиент для тёмной темы */
  box-shadow: 0 3px 8px rgba(255, 255, 255, 0.2);
}

.theme-toggle-circle.dark-theme::before {
  background: rgba(255, 255, 255, 0.05);
}

.theme-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.theme-icon {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
}

.theme-toggle-circle:hover .theme-icon-wrapper {
  transform: scale(1.1) rotate(15deg);
}

.theme-toggle-circle.dark-theme:hover .theme-icon-wrapper {
  transform: scale(1.1) rotate(-15deg);
}

.theme-toggle-circle:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 16px rgba(251, 191, 36, 0.4);
}

.theme-toggle-circle.dark-theme:hover {
  box-shadow: 0 6px 20px rgba(15, 23, 42, 0.6);
}

/* Анимация переключения */
.theme-toggle-circle {
  animation: pulse-light 3s infinite;
}

@keyframes pulse-light {
  0%, 100% {
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
  }
  50% {
    box-shadow: 0 3px 12px rgba(0, 0, 0, 0.2);
  }
}

.theme-toggle-circle.dark-theme {
  animation: pulse-dark 3s infinite;
}

@keyframes pulse-dark {
  0%, 100% {
    box-shadow: 0 3px 8px rgba(255, 255, 255, 0.2);
  }
  50% {
    box-shadow: 0 3px 16px rgba(255, 255, 255, 0.3);
  }
}

/* Эффект нажатия */
.theme-toggle-circle:active {
  transform: scale(0.95);
}

.theme-toggle-circle:active .theme-icon-wrapper {
  transform: scale(0.9);
}
</style>
