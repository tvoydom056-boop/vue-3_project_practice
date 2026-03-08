<script setup lang="ts">
import { ref } from 'vue'
import TheWelcome from '../components/TheWelcome.vue'

// Флаг для отображения стандартного компонента Vue
const showVueWelcome = ref(false)

// Переключить отображение стандартного компонента
const toggleVueWelcome = () => {
  showVueWelcome.value = !showVueWelcome.value
}
</script>

<template>
  <main>
    <!-- Скрытая кнопка для разработчиков -->
    <button
      @click="toggleVueWelcome"
      style="position: fixed; top: 10px; right: 10px; z-index: 1000; padding: 5px 10px; background: #f0f0f0; border: 1px solid #ccc; border-radius: 4px; cursor: pointer; font-size: 12px;"
      title="Показать/скрыть стандартный компонент Vue"
    >
      {{ showVueWelcome ? 'Скрыть Vue' : 'Показать Vue' }}
    </button>

    <!-- Условное отображение компонентов -->
    <TheWelcome v-if="showVueWelcome" />

    <div v-else>
      <h1>Добро пожаловать в ФГИС МДМ</h1>
      <p>Система управления пользователями и продуктами</p>

      <div style="margin-top: 20px;">
        <h3>Быстрые ссылки:</h3>
        <ul>
          <li><router-link to="/users">Управление пользователями</router-link></li>
          <li><router-link to="/products">Каталог продуктов</router-link></li>
        </ul>
      </div>

      <div style="margin-top: 30px; padding: 20px; background: #f5f5f5; border-radius: 8px;">
        <h4>Технологический стек:</h4>
        <p>Vue 3 • TypeScript • Pinia • Vue Query • Vuetify</p>
      </div>
    </div>
  </main>
</template>

<style scoped>
h1 {
  color: #1976d2;
  margin-bottom: 16px;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  margin: 8px 0;
}

li a {
  text-decoration: none;
  color: #1976d2;
  font-weight: 500;
}

li a:hover {
  text-decoration: underline;
}
</style>
