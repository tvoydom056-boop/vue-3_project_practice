<template>
  <div class="product-list-container">
    <!-- Header -->
    <div class="product-list-header mb-8">
      <div
        class="d-flex flex-column flex-md-row justify-space-between align-start align-md-center gap-4"
      ></div>
    </div>

    <!-- Filters -->
    <v-card class="filters-card mb-6" elevation="2" rounded="lg">
      <v-card-text class="pa-6">
        <div class="d-flex flex-column flex-md-row gap-4 align-start align-md-center">
          <v-text-field
            v-model="search"
            label="Поиск продуктов"
            prepend-icon="mdi-magnify"
            variant="outlined"
            hide-details
            class="flex-grow-1"
            style="min-width: 300px"
            density="comfortable"
          />

          <v-select
            v-model="selectedCategory"
            :items="categories"
            label="Категория"
            variant="outlined"
            hide-details
            style="min-width: 200px"
            density="comfortable"
          />

          <v-select
            v-model="itemsPerPage"
            :items="itemsPerPageOptions"
            label="Товаров на странице"
            variant="outlined"
            hide-details
            style="min-width: 180px"
            density="comfortable"
          />

          <div class="d-flex gap-2 align-center" style="min-width: 300px">
            <v-text-field
              v-model="minPrice"
              label="Цена от"
              variant="outlined"
              hide-details
              type="number"
              min="0"
              style="max-width: 120px"
              density="comfortable"
              @keyup.enter="applyPriceFilter"
            >
              <template #append>
                <span class="text-caption">₽</span>
              </template>
            </v-text-field>

            <span class="text-medium-emphasis">—</span>

            <v-text-field
              v-model="maxPrice"
              label="Цена до"
              variant="outlined"
              hide-details
              type="number"
              min="0"
              style="max-width: 120px"
              density="comfortable"
              @keyup.enter="applyPriceFilter"
            >
            </v-text-field>
            <v-btn
              v-if="hasPriceFilter"
              icon="mdi-close"
              variant="text"
              size="small"
              @click="clearPriceFilter"
              title="Очистить фильтр по цене"
            />
          </div>
        </div>
      </v-card-text>
    </v-card>

    <!-- Products Table -->
    <v-card class="products-table-card" elevation="1" rounded="lg">
      <v-data-table
        :headers="headers"
        :items="paginatedProducts"
        :search="search"
        :loading="loading"
        :items-per-page="itemsPerPage"
        class="elevation-0"
        hide-default-footer
        :hide-default-header="false"
      >
        <!-- Custom rows -->
        <!-- eslint-disable-next-line vue/valid-v-slot -->
        <template #item.title="{ item }">
          <div class="d-flex align-center gap-3">
            <v-avatar size="48" rounded="md" class="elevation-1">
              <v-img :src="item.thumbnail || 'https://via.placeholder.com/48'" :alt="item.title" />
            </v-avatar>
            <div class="product-info">
              <div class="font-weight-medium product-title mb-1 px-2">{{ item.title }}</div>
              <div
                class="text-caption text-medium-emphasis product-description text-truncate px-2"
                style="max-width: 200px; padding: 2px 0"
              >
                {{ item.description }}
              </div>
            </div>
          </div>
        </template>

        <!-- eslint-disable-next-line vue/valid-v-slot -->
        <template #item.price="{ item }">
          <div>
            <div class="font-weight-bold text-primary">
              {{ item.price.toLocaleString("ru-RU") }} ₽
            </div>
            <div v-if="(item.discountPercentage || 0) > 0" class="text-caption text-success">
              -{{ item.discountPercentage }}%
            </div>
          </div>
        </template>

        <!-- eslint-disable-next-line vue/valid-v-slot -->
        <template #item.stock="{ item }">
          <div class="d-flex align-center gap-2">
            <v-progress-circular
              :model-value="(item.stock / 50) * 100"
              :color="getStockColor(item.stock)"
              :size="36"
              :width="4"
              class="mr-2"
            >
              <span class="text-caption font-weight-bold">{{ item.stock }}</span>
            </v-progress-circular>
            <div class="text-caption">
              {{ getStockStatus(item.stock) }}
            </div>
          </div>
        </template>

        <!-- eslint-disable-next-line vue/valid-v-slot -->
        <template #item.rating="{ item }">
          <div class="d-flex align-center gap-1">
            <v-rating
              :model-value="item.rating || 0"
              size="small"
              readonly
              half-increments
              color="warning"
              density="compact"
            />
            <span class="text-caption text-medium-emphasis ml-1">
              {{ item.rating?.toFixed(1) || "0.0" }}
            </span>
          </div>
        </template>

        <template #no-data>
          <div class="text-center py-12">
            <v-icon size="64" color="grey-lighten-1" class="mb-4"> mdi-magnify-close </v-icon>
            <h3 class="text-h6 font-weight-medium mb-2">Продукты не найдены</h3>
            <p class="text-body-2 text-medium-emphasis mb-6">
              Попробуйте изменить параметры поиска или фильтрации
            </p>
            <v-btn color="primary" variant="outlined" @click="resetFilters" rounded="lg">
              Сбросить фильтры
            </v-btn>
          </div>
        </template>

        <template #loading>
          <div class="text-center py-12">
            <v-progress-circular indeterminate color="primary" size="48" class="mb-4" />
            <h3 class="text-h6 font-weight-medium">Загрузка продуктов...</h3>
            <p class="text-body-2 text-medium-emphasis mt-2">Получаем актуальную информацию</p>
          </div>
        </template>

        <template #bottom>
          <div class="custom-pagination pa-4 border-t">
            <div class="d-flex justify-space-between align-center mb-2">
              <div class="text-caption text-medium-emphasis">
                Показано {{ (currentPage - 1) * itemsPerPage + 1 }}-{{
                  Math.min(currentPage * itemsPerPage, filteredProducts.length)
                }}
                из {{ filteredProducts.length }} продуктов
              </div>
              <div class="text-caption text-medium-emphasis">
                Страница {{ currentPage }} из {{ totalPages }}
              </div>
            </div>

            <div class="d-flex justify-center align-center gap-2">
              <!-- Кнопка назад -->
              <v-btn
                icon="mdi-chevron-left"
                variant="text"
                size="small"
                :disabled="currentPage === 1"
                @click="prevPage"
                class="pagination-button"
              />

              <!-- Номера страниц -->
              <div class="d-flex gap-1">
                <v-btn
                  v-for="page in pageNumbers"
                  :key="page"
                  :variant="currentPage === page ? 'flat' : 'text'"
                  :color="currentPage === page ? 'primary' : ''"
                  size="small"
                  @click="goToPage(page)"
                  class="pagination-page"
                  :class="{ active: currentPage === page }"
                >
                  {{ page }}
                </v-btn>
              </div>

              <!-- Кнопка вперед -->
              <v-btn
                icon="mdi-chevron-right"
                variant="text"
                size="small"
                :disabled="currentPage === totalPages"
                @click="nextPage"
                class="pagination-button"
              />
            </div>
          </div>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import type { Product } from "@/entities/product";

interface Props {
  products: Product[];
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
});



const search = ref("");
const selectedCategory = ref("все");

const minPrice = ref<number | null>(null);
const maxPrice = ref<number | null>(null);
const itemsPerPage = ref(5);
const itemsPerPageOptions = [
  { title: "5 товаров", value: 5 },
  { title: "10 товаров", value: 10 },
  { title: "15 товаров", value: 15 },
];

const headers = [
  { title: "Название", key: "title", sortable: true, width: "300px" },
  { title: "Категория", key: "category", sortable: true, width: "150px" },
  { title: "Цена", key: "price", sortable: true, width: "150px" },
  { title: "Остаток", key: "stock", sortable: true, width: "180px" },
  { title: "Рейтинг", key: "rating", sortable: true, width: "150px" },
  { title: "Бренд", key: "brand", sortable: true, width: "120px" },
];

const categories = computed(() => {
  const uniqueCategories = Array.from(new Set(props.products.map((p) => p.category)));
  const cats = ["все", ...uniqueCategories];
  return cats.map((cat) => ({
    title: cat === "все" ? "Все категории" : cat,
    value: cat,
  }));
});



// Пагинация
const currentPage = ref(1);

// Вычисляемые свойства для пагинации
const totalPages = computed(() => {
  if (filteredProducts.value.length === 0) return 1;
  return Math.ceil(filteredProducts.value.length / itemsPerPage.value);
});

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredProducts.value.slice(start, end);
});

const pageNumbers = computed(() => {
  const pages = [];
  const maxVisiblePages = 5;
  let startPage = Math.max(1, currentPage.value - Math.floor(maxVisiblePages / 2));
  const endPage = Math.min(totalPages.value, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }
  return pages;
});

// Методы пагинации
const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const filteredProducts = computed(() => {
  let filtered = props.products;

  if (search.value) {
    const searchLower = search.value.toLowerCase();
    filtered = filtered.filter(
      (product) =>
        product.title.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower) ||
        product.brand?.toLowerCase().includes(searchLower)
    );
  }

  if (selectedCategory.value !== "все") {
    filtered = filtered.filter((product) => product.category === selectedCategory.value);
  }



  // Фильтр по цене
  if (minPrice.value !== null && minPrice.value > 0) {
    filtered = filtered.filter((product) => product.price >= minPrice.value!);
  }

  if (maxPrice.value !== null && maxPrice.value > 0) {
    filtered = filtered.filter((product) => product.price <= maxPrice.value!);
  }

  return filtered;
});

const getStockColor = (stock: number) => {
  if (stock > 20) return "success";
  if (stock > 5) return "warning";
  return "error";
};

const getStockStatus = (stock: number) => {
  if (stock > 20) return "Много";
  if (stock > 10) return "Достаточно";
  if (stock > 5) return "Мало";
  if (stock > 0) return "Заканчивается";
  return "Нет в наличии";
};

// Вычисляемое свойство для проверки активного фильтра по цене
const hasPriceFilter = computed(() => {
  return (
    (minPrice.value !== null && minPrice.value > 0) ||
    (maxPrice.value !== null && maxPrice.value > 0)
  );
});

// Метод для применения фильтра по цене
const applyPriceFilter = () => {
  // Просто обновляем computed свойство - фильтр автоматически применится
  currentPage.value = 1;
};

// Метод для очистки фильтра по цене
const clearPriceFilter = () => {
  minPrice.value = null;
  maxPrice.value = null;
  currentPage.value = 1;
};

const resetFilters = () => {
  search.value = "";
  selectedCategory.value = "все";

  minPrice.value = null;
  maxPrice.value = null;
  currentPage.value = 1;
};

// Сброс на первую страницу при изменении фильтров
import { watch } from "vue";

watch([search, selectedCategory, itemsPerPage, minPrice, maxPrice], () => {
  currentPage.value = 1;
});

// Также сбрасываем при изменении исходных продуктов
watch(
  () => props.products,
  () => {
    currentPage.value = 1;
  }
);
</script>

<style scoped>
.product-list-container {
  padding: 24px 0;
}

.product-list-header {
  padding: 0 24px;
}

.filters-card {
  border-radius: 16px !important;
}

.products-table-card {
  border-radius: 16px !important;
  overflow: hidden;
}

.products-table-card :deep(.v-data-table-header) {
  background-color: var(--v-surface);
}

.products-table-card :deep(.v-data-table-header th) {
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-size: 0.75rem;
}

.products-table-card :deep(.v-data-table-rows) {
  transition: background-color 0.2s ease;
}

.products-table-card :deep(.v-data-table-rows:hover) {
  background-color: rgba(var(--v-primary-base), 0.04);
}

.gap-2 {
  gap: 8px;
}

.gap-4 {
  gap: 16px;
}

.flex-grow-1 {
  flex-grow: 1;
}

.product-info {
  min-width: 0;
}

.product-title {
  line-height: 1.3;
}

.product-description {
  line-height: 1.4;
  opacity: 0.8;
}

/* Стили для кастомной пагинации */
.custom-pagination {
  background-color: var(--v-surface);
}

.pagination-button {
  min-width: 36px;
  height: 36px;
}

.pagination-page {
  min-width: 36px;
  height: 36px;
  border-radius: 8px;
}

.pagination-page.active {
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.pagination-page:not(.active):hover {
  background-color: rgba(var(--v-primary-base), 0.1);
}
</style>
