<script setup lang="ts">
import { RouterView } from "vue-router";
import { ref } from "vue";
import { useTheme } from "vuetify";
import { useRoute } from "vue-router";

const drawer = ref(false);
const theme = useTheme();
const route = useRoute();

const toggleTheme = () => {
  theme.global.name.value = theme.global.current.value.dark ? "light" : "dark";
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
        <div class="d-none d-md-flex align-center gap-3">
          <v-btn
            to="/products"
            variant="text"
            class="text-on-surface font-weight-medium"
            :class="{ 'text-primary': route.path === '/products' }"
          >
            <v-icon start icon="mdi-package-variant" />
            Продукты
          </v-btn>

          <v-btn icon="mdi-theme-light-dark" variant="text" @click="toggleTheme" class="ml-2" />
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
  </v-app>
</template>

<style scoped>
.text-decoration-none {
  text-decoration: none;
}
</style>
