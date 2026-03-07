# Архитектура приложения с Pinia + Vue Query

## Обзор

Этот проект использует современную архитектуру управления состоянием и работы с API:
- **Pinia** для управления локальным состоянием UI
- **Vue Query (TanStack Query)** для работы с API и кэшированием данных

## Структура

### 1. Управление состоянием (Pinia)

**Pinia** используется для:
- Локального состояния UI (выбранные элементы, фильтры, пагинация)
- Координации между компонентами
- Простых синхронных операций

**Пример хранилища:** `useUserStore`
- Хранит UI состояние (поиск, сортировка, пагинация)
- Делегирует операции с данными к Vue Query
- Предоставляет вычисляемые свойства на основе данных из Vue Query

### 2. Работа с API (Vue Query)

**Vue Query** используется для:
- Кэширования данных
- Фоновой ревалидации
- Оптимистичных обновлений
- Автоматического рефетча
- Управления загрузкой и ошибками

**Ключевые концепции:**

#### Query Keys
Иерархические ключи для организации кэша:
```typescript
export const userQueryKeys = {
  all: ['users'],
  lists: () => [...userQueryKeys.all, 'list'],
  list: (filters) => [...userQueryKeys.lists(), { filters }],
  detail: (id) => [...userQueryKeys.details(), id],
}
```

#### Композабельные функции
Переиспользуемые функции для работы с данными:
```typescript
export function useUsersQuery(filters) {
  return useQuery({
    queryKey: userQueryKeys.list(filters),
    queryFn: () => userService.getUsers(filters),
    staleTime: 1000 * 60 * 5,
  })
}
```

#### Мутации
Операции изменения данных:
```typescript
export function useCreateUserMutation() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: userService.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userQueryKeys.lists() })
    },
  })
}
```

### 3. Сервисный слой

Отдельный слой для работы с API:
```typescript
const userService = {
  async getUsers(params) {
    const response = await apiClient.get('/users')
    return response.data
  },
  // ... другие методы
}
```

## Интеграция Pinia + Vue Query

### Хранилище объединяет оба подхода:

```typescript
export const useUserStore = defineStore('user', () => {
  // UI State (Pinia)
  const searchQuery = ref('')
  
  // Vue Query
  const usersQuery = useUsersQuery({ search: searchQuery.value })
  
  // Комбинированные геттеры
  const users = computed(() => usersQuery.data.value || [])
  const loading = computed(() => usersQuery.isLoading.value)
  
  // Действия
  const setSearchQuery = (query) => {
    searchQuery.value = query
    usersQuery.refetch()
  }
  
  return { users, loading, setSearchQuery }
})
```

## Преимущества

### 1. Разделение ответственности
- **Pinia**: UI состояние, локальные вычисления
- **Vue Query**: Данные сервера, кэширование, синхронизация

### 2. Автоматическое кэширование
- Данные кэшируются автоматически
- Фоновая ревалидация
- Оффлайн поддержка

### 3. Оптимистичные обновления
```typescript
onMutate: async (variables) => {
  // Оптимистичное обновление UI
  queryClient.setQueryData(key, optimisticData)
},
onError: (err, variables, context) => {
  // Откат при ошибке
  queryClient.setQueryData(key, context.previousData)
}
```

### 4. DevTools
- Vue Query DevTools для отладки кэша
- Pinia DevTools для отладки состояния

## Best Practices

### 1. Именование
- `use[Entity]Store` для Pinia хранилищ
- `use[Entity]Queries` для Vue Query функций
- `[entity]QueryKeys` для ключей запросов

### 2. Организация кода
- Хранилища в `features/[feature]/model/`
- Композабельные функции в отдельных файлах
- Сервисы в `shared/api/`

### 3. Обработка ошибок
- Глобальная обработка в интерцепторах
- Локальная обработка в мутациях
- Пользовательские сообщения об ошибках

### 4. Производительность
- Используйте `staleTime` для контроля рефетча
- Настройте `cacheTime` для управления памятью
- Используйте `keepPreviousData` для плавного UX

## Пример использования

### Компонент пользователей:
```vue
<template>
  <div>
    <input v-model="store.searchQuery" @input="store.setSearchQuery" />
    
    <div v-if="store.loading">Загрузка...</div>
    <div v-else>
      <UserItem v-for="user in store.users" :key="user.id" :user="user" />
    </div>
    
    <button @click="store.fetchUsers">Обновить</button>
  </div>
</template>

<script setup>
import { useUserStore } from '@/features/user-management/model/useUserStore'

const store = useUserStore()
</script>
```

## Настройка

### 1. Установка зависимостей:
```bash
npm install @tanstack/vue-query @tanstack/vue-query-devtools
```

### 2. Конфигурация клиента:
```typescript
// src/shared/api/queryClient.ts
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
      refetchOnWindowFocus: true,
    }
  }
})
```

### 3. Интеграция с Vue:
```typescript
// src/app/query.ts
export const vueQueryPlugin = {
  install(app) {
    app.use(VueQueryPlugin, { queryClient })
  }
}
```

## Дополнительные возможности

### Префетчинг:
```typescript
// Префетч данных при наведении
const prefetchUser = usePrefetchUser(userId)
<div @mouseenter="prefetchUser">
```

### Пагинация:
- `useInfiniteQuery` для бесконечной прокрутки
- `keepPreviousData: true` для плавной пагинации

### Оптимистичные обновления:
- Мгновенный отклик UI
- Автоматический откат при ошибке

## Заключение

Эта архитектура обеспечивает:
- Чистое разделение ответственности
- Отличный UX с кэшированием
- Простое тестирование
- Масштабируемость

Для простых приложений можно использовать только Pinia.
Для сложных приложений с большим количеством данных рекомендуется использовать комбинацию Pinia + Vue Query.