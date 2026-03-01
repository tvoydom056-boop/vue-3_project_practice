# Руководство для AI-агентов и контрибьютеров

Добро пожаловать в проект фронтенда ФГИС МДМ! Этот документ содержит руководство по разработке для AI-агентов и контрибьютеров, включая процесс разработки, стандарты кода и лучшие практики для JavaScript и Nuxt.js.

## Архитектура проекта

Проект построен на основе **Nuxt.js 2** и **Vue 2**. Основная структура каталогов:

```
src/
├── assets/          # Статические ресурсы (шрифты, стили, изображения)
├── components/      # Глобальные компоненты Vue
├── components-lazy/ # Динамически загружаемые компоненты
├── layouts/         # Шаблоны страниц
├── pages/           # Страницы приложения (автоматическая маршрутизация)
├── plugins/         # Плагины Nuxt/Vue
├── services/        # Сервисы и API клиенты
├── store/           # Хранилище Vuex
├── middleware/      # Middleware Nuxt
├── utils/           # Вспомогательные утилиты
├── const/           # Константы проекта
├── tests/           # Тесты
└── scripts/         # Вспомогательные скрипты
```

## JavaScript Best Practices для Nuxt.js

### 1. Оптимизация загрузки (CRITICAL)

**Динамический импорт компонентов:**
```javascript
// Вместо:
import HeavyComponent from '@/components/HeavyComponent.vue'

// Используйте:
const HeavyComponent = () => import('@/components/HeavyComponent.vue')
```

**Предзагрузка на основе пользовательского взаимодействия:**
```javascript
// Используйте mouseenter/focus для предзагрузки
<template>
  <div @mouseenter="preloadComponent">
    <component :is="lazyComponent" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      lazyComponent: null
    }
  },
  methods: {
    async preloadComponent() {
      if (!this.lazyComponent) {
        const module = await import('@/components/HeavyComponent.vue')
        this.lazyComponent = module.default
      }
    }
  }
}
</script>
```

### 2. Оптимизация производительности сервера (HIGH)

**Кеширование на уровне запросов:**
```javascript
// В сервисах API
import LRU from 'lru-cache'

const cache = new LRU({
  max: 500,
  ttl: 1000 * 60 * 5 // 5 минут
})

export default {
  async fetchData(key) {
    if (cache.has(key)) {
      return cache.get(key)
    }
    const data = await fetch(`/api/data/${key}`)
    cache.set(key, data)
    return data
  }
}
```

**Параллельная загрузка данных:**
```javascript
// Вместо последовательных await:
async mounted() {
  const user = await fetchUser()
  const posts = await fetchUserPosts(user.id)
  const comments = await fetchUserComments(user.id)
}

// Используйте Promise.all() для независимых операций:
async mounted() {
  const [user, posts, comments] = await Promise.all([
    fetchUser(),
    fetchUserPosts(userId),
    fetchUserComments(userId)
  ])
}
```

### 3. Оптимизация размера бандла (CRITICAL)

**Избегайте barrel-импортов:**
```javascript
// Вместо:
import { Button, Input, Modal } from '@/components'

// Используйте прямые импорты:
import Button from '@/components/Button.vue'
import Input from '@/components/Input.vue'
import Modal from '@/components/Modal.vue'
```

**Отложенная загрузка сторонних библиотек:**
```javascript
// Для аналитики и логирования
export default {
  mounted() {
    // Загружаем после гидратации
    import('analytics-library').then(({ default: analytics }) => {
      analytics.track('page_view')
    })
  }
}
```

### 4. Оптимизация перерисовок (MEDIUM)

**Использование computed свойств:**
```javascript
export default {
  data() {
    return {
      items: [],
      filter: ''
    }
  },
  computed: {
    filteredItems() {
      return this.items.filter(item => 
        item.name.toLowerCase().includes(this.filter.toLowerCase())
      )
    },
    // Для сложных вычислений
    expensiveComputed: {
      get() {
        return this.performExpensiveOperation()
      },
      cache: true // В Vue 3
    }
  }
}
```

**Мемоизация функций:**
```javascript
import { memoize } from 'lodash'

const expensiveFunction = memoize((param) => {
  // Сложные вычисления
  return result
})

// Или используйте встроенную мемоизацию Vue
export default {
  methods: {
    memoizedMethod: _.memoize(function(param) {
      // Сложные вычисления
      return result
    })
  }
}
```

### 5. JavaScript микро-оптимизации (LOW-MEDIUM)

**Оптимизация циклов:**
```javascript
// Кеширование длины массива
for (let i = 0, len = array.length; i < len; i++) {
  // вместо array.length в каждой итерации
}

// Объединение операций filter/map
const result = array
  .filter(item => item.active)
  .map(item => item.name)

// Вместо:
const activeItems = array.filter(item => item.active)
const names = activeItems.map(item => item.name)
```

**Использование Set/Map для быстрого поиска:**
```javascript
// Для частых проверок наличия элемента
const itemSet = new Set(items.map(item => item.id))

if (itemSet.has(targetId)) {
  // O(1) вместо O(n)
}
```

## Nuxt.js специфичные практики

### 1. Конфигурация и настройка

**Оптимизация nuxt.config.js:**
```javascript
// Правильная настройка мета-тегов
head: {
  title: 'ФГИС МДМ',
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { hid: 'description', name: 'description', content: 'mdm' },
    { hid: 'theme-color', name: 'theme-color', content: '#E04E39' },
    // Кеширование для SPA
    { 'http-equiv': 'cache-control', content: 'private, max-age=0, no-cache, no-store' },
  ],
  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.png' }
  ]
},
```

**Оптимизация сборки:**
```javascript
build: {
  // Включение анализатора бандла только в разработке
  analyze: process.env.NODE_ENV === 'development',
  // Оптимизация транспиляции
  transpile: [/^vuetify/],
  // Разделение кода
  splitChunks: {
    layouts: true,
    pages: true,
    commons: true
  },
  // Кэширование загрузчиков
  cache: true
}
```

### 2. Middleware оптимизация

**Асинхронный middleware с кешированием:**
```javascript
// В middleware/auth.js
export default async function ({ store, redirect, route, req }) {
  // Проверка кеша для аутентификации
  if (process.client) {
    const authCache = localStorage.getItem('auth_cache');
    if (authCache && JSON.parse(authCache).valid) {
      return;
    }
  }
  
  // Асинхронная проверка
  if (!store.state.auth.user) {
    // Для публичных маршрутов пропускаем
    const publicRoutes = ['/login', '/register', '/password-reset'];
    if (!publicRoutes.includes(route.path)) {
      return redirect('/login');
    }
  }
}
```

**Middleware для производительности:**
```javascript
// В middleware/performance.js
export default function ({ route, store }) {
  // Отложенная загрузка ресурсов для тяжёлых страниц
  const heavyPages = ['/dashboard', '/analytics', '/reports'];
  if (heavyPages.includes(route.path)) {
    store.commit('SET_LOADING_STATE', true);
  }
}
```

### 3. Плагины и инъекции

**Плагины с ленивой загрузкой:**
```javascript
// В plugins/axios.js
export default function ({ $axios, redirect, error }) {
  // Базовый URL
  $axios.setBaseURL(process.env.API_BASE_URL || 'http://localhost:3000/api');
  
  // Обработка ошибок
  $axios.onError(err => {
    const code = parseInt(err.response && err.response.status);
    
    if (code === 400) {
      redirect('/400');
    } else if (code === 401) {
      redirect('/login');
    } else if (code === 404) {
      redirect('/404');
    } else if (code >= 500) {
      redirect('/500');
    }
    
    return Promise.reject(err);
  });
  
  // Кеширование запросов GET
  $axios.onRequest(config => {
    if (config.method === 'get') {
      config.cache = {
        maxAge: 15 * 60 * 1000, // 15 минут
        exclude: { query: false }
      };
    }
    return config;
  });
}
```

**Плагины для аналитики (отложенная загрузка):**
```javascript
// В plugins/analytics.js (mode: 'client')
export default async function ({ app }) {
  // Загружаем только после гидратации
  if (process.client) {
    await new Promise(resolve => {
      window.addEventListener('load', resolve, { once: true });
    });
    
    const { default: Analytics } = await import('analytics-library');
    app.$analytics = new Analytics();
  }
}
```

### 4. Работа с store (Vuex)

**Оптимизированные геттеры:**
```javascript
// В store/getters.js
export const getters = {
  // Кеширование результатов геттеров
  activeUsers: state => {
    if (!state._cachedActiveUsers || state._cachedActiveUsers.timestamp < Date.now() - 60000) {
      state._cachedActiveUsers = {
        data: state.users.filter(user => user.isActive),
        timestamp: Date.now()
      };
    }
    return state._cachedActiveUsers.data;
  },
  
  // Мемоизированные геттеры с параметрами
  getUserById: state => id => {
    return state.users.find(user => user.id === id);
  },
  
  // Производные вычисления
  statistics: state => {
    return {
      totalUsers: state.users.length,
      activeUsers: state.users.filter(u => u.isActive).length,
      inactiveUsers: state.users.filter(u => !u.isActive).length
    };
  }
}
```

**Оптимизация мутаций:**
```javascript
// В store/mutations.js
export const mutations = {
  // Пакетные обновления
  UPDATE_USERS_BATCH(state, users) {
    users.forEach(user => {
      const index = state.users.findIndex(u => u.id === user.id);
      if (index !== -1) {
        Object.assign(state.users[index], user);
      }
    });
    // Инвалидация кеша
    state._cachedActiveUsers = null;
  },
  
  // Ленивые обновления
  SET_USER_ACTIVE(state, { userId, isActive }) {
    const user = state.users.find(u => u.id === userId);
    if (user) {
      Vue.set(user, 'isActive', isActive);
      state._cachedActiveUsers = null;
    }
  }
}
```

### 5. Компоненты и страницы

**Оптимизация страниц:**
```javascript
// В pages/dashboard.vue
export default {
  name: 'DashboardPage',
  
  // Асинхронные данные с кешированием
  async asyncData({ $axios, params, error }) {
    try {
      const [user, stats, notifications] = await Promise.all([
        $axios.get('/api/user'),
        $axios.get('/api/stats'),
        $axios.get('/api/notifications', { cache: { maxAge: 30000 } }) // 30 секунд
      ]);
      
      return {
        user: user.data,
        stats: stats.data,
        notifications: notifications.data
      };
    } catch (err) {
      error({ statusCode: err.response?.status || 500, message: err.message });
    }
  },
  
  // Ленивая загрузка компонентов
  components: {
    Chart: () => import('@/components/Chart.vue'),
    DataTable: () => import('@/components/DataTable.vue'),
    Widget: () => import('@/components/Widget.vue')
  },
  
  // Head настройки для SEO
  head() {
    return {
      title: `Дашборд - ${this.user?.name || ''}`,
      meta: [
        { hid: 'description', name: 'description', content: 'Панель управления ФГИС МДМ' }
      ]
    };
  }
}
```

**Компоненты с виртуальным скроллингом:**
```javascript
// В components/DataList.vue
export default {
  name: 'DataList',
  props: {
    items: { type: Array, default: () => [] },
    itemHeight: { type: Number, default: 50 }
  },
  data() {
    return {
      visibleStart: 0,
      visibleEnd: 20,
      scrollTop: 0
    };
  },
  computed: {
    visibleItems() {
      return this.items.slice(this.visibleStart, this.visibleEnd);
    },
    totalHeight() {
      return this.items.length * this.itemHeight;
    },
    offsetY() {
      return this.visibleStart * this.itemHeight;
    }
  },
  methods: {
    handleScroll(event) {
      const scrollTop = event.target.scrollTop;
      this.visibleStart = Math.floor(scrollTop / this.itemHeight);
      this.visibleEnd = this.visibleStart + 30; // + буфер
      this.scrollTop = scrollTop;
    }
  }
}
```

### 6. Роутинг и навигация

**Предзагрузка маршрутов:**
```javascript
// В middleware/prefetch.js
export default function ({ route, store }) {
  // Предзагрузка данных для связанных маршрутов
  if (process.client) {
    const prefetchRoutes = {
      '/dashboard': ['/api/user', '/api/stats'],
      '/users': ['/api/users/list'],
      '/settings': ['/api/settings']
    };
    
    const currentRoute = route.path;
    const toPrefetch = prefetchRoutes[currentRoute];
    
    if (toPrefetch) {
      toPrefetch.forEach(url => {
        fetch(url, { priority: 'low' });
      });
    }
  }
}
```

**Оптимизация перехода между страницами:**
```javascript
// В nuxt.config.js
transition: {
  name: 'page',
  mode: 'out-in',
  beforeEnter(el) {
    // Предзагрузка ресурсов для следующей страницы
    const nextPage = this.$route;
    if (nextPage.matched[0]) {
      const components = nextPage.matched[0].components;
      Object.values(components).forEach(component => {
        if (component.preload) {
          component.preload();
        }
      });
    }
  }
}
```

### 7. Оптимизация производительности

**Виртуализация списков:**
```javascript
// В mixins/virtualScroll.js
export default {
  data() {
    return {
      virtualScroll: {
        start: 0,
        end: 30,
        itemHeight: 50,
        buffer: 10
      }
    };
  },
  computed: {
    visibleItems() {
      const start = Math.max(0, this.virtualScroll.start - this.virtualScroll.buffer);
      const end = this.virtualScroll.end + this.virtualScroll.buffer;
      return this.items.slice(start, end);
    },
    totalHeight() {
      return this.items.length * this.virtualScroll.itemHeight;
    },
    offsetY() {
      return Math.max(0, (this.virtualScroll.start - this.virtualScroll.buffer) * this.virtualScroll.itemHeight);
    }
  },
  methods: {
    updateVirtualScroll(scrollTop) {
      const start = Math.floor(scrollTop / this.virtualScroll.itemHeight);
      this.virtualScroll.start = start;
      this.virtualScroll.end = start + Math.ceil(this.$el.clientHeight / this.virtualScroll.itemHeight);
    }
  }
}
```

**Оптимизация памяти:**
```javascript
// В mixins/memoryManagement.js
export default {
  beforeDestroy() {
    // Очистка тяжёлых данных
    this.largeData = null;
    this.heavyComponents = null;
    
    // Отмена подписок
    if (this.eventHandlers) {
      this.eventHandlers.forEach(unsubscribe => unsubscribe());
      this.eventHandlers = null;
    }
    
    // Очистка таймеров
    if (this.intervals) {
      this.intervals.forEach(clearInterval);
      this.intervals = null;
    }
  },
  
  deactivated() {
    // При деактивации компонента (keep-alive)
    this.suspendBackgroundTasks();
  },
  
  activated() {
    // При активации компонента
    this.resumeBackgroundTasks();
  }
}
```

### 8. Безопасность Nuxt.js

**Защита от CSRF:**
```javascript
// В middleware/csrf.js
export default function ({ req, res, query }) {
  if (process.server) {
    // Генерация CSRF токена
    const csrfToken = require('crypto').randomBytes(32).toString('hex');
    
    // Установка в cookies и контекст
    res.setHeader('Set-Cookie', [`csrf_token=${csrfToken}; HttpOnly; Secure; SameSite=Strict`]);
    req.csrfToken = csrfToken;
  }
}
```

**Валидация входных данных:**
```javascript
// В middleware/validation.js
export default function ({ route, query, params, error }) {
  // Валидация параметров маршрута
  const id = params.id;
  if (id && !/^\d+$/.test(id)) {
    return error({ statusCode: 400, message: 'Invalid ID parameter' });
  }
  
  // Валидация query параметров
  const limit = parseInt(query.limit);
  if (limit && (limit < 1 || limit > 100)) {
    return error({ statusCode: 400, message: 'Limit must be between 1 and 100' });
  }
}
```

### 9. Мониторинг и метрики

**Метрики производительности:**
```javascript
// В plugins/performance.js
export default function ({ app }) {
  if (process.client) {
    // Отслеживание метрик Core Web Vitals
    const metrics = {};
    
    // Largest Contentful Paint (LCP)
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      metrics.lcp = lastEntry.renderTime || lastEntry.loadTime;
      
      // Отправка метрик
      if (app.$axios) {
        app.$axios.post('/api/metrics', metrics);
      }
    }).observe({ type: 'largest-contentful-paint', buffered: true });
    
    // First Input Delay (FID)
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        metrics.fid = entry.processingStart - entry.startTime;
      }
    }).observe({ type: 'first-input', buffered: true });
  }
}
```

**Логирование ошибок:**
```javascript
// В plugins/errorHandler.js
export default function ({ app, error }) {
  // Глобальный обработчик ошибок Vue
  if (process.client) {
    Vue.config.errorHandler = (err, vm, info) => {
      console.error('Vue error:', err, info);
      
      // Отправка в систему мониторинга
      if (app.$axios) {
        app.$axios.post('/api/errors', {
          error: err.toString(),
          stack: err.stack,
          component: vm?.$options?.name,
          info
        });
      }
    };
  }
  
  // Обработчик ошибок Nuxt
  app.nuxt.error = (err) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    
    // Логирование
    console.error('Nuxt error:', err);
    
    // Перенаправление на страницу ошибки
    error({ statusCode, message });
  };
}
```

### 10. Оптимизация для мобильных устройств

**Адаптивная загрузка:**
```javascript
// В mixins/mobileOptimization.js
export default {
  data() {
    return {
      isMobile: false,
      isTablet: false,
      isDesktop: true
    };
  },
  mounted() {
    this.checkDevice();
    window.addEventListener('resize', this.checkDevice);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.checkDevice);
  },
  methods: {
    checkDevice() {
      const width = window.innerWidth;
      this.isMobile = width < 768;
      this.isTablet = width >= 768 && width < 1024;
      this.isDesktop = width >= 1024;
      
      // Оптимизация загрузки для мобильных
      if (this.isMobile) {
        this.reduceImageQuality();
        this.deferNonCriticalContent();
      }
    },
    reduceImageQuality() {
      // Уменьшение качества изображений для мобильных
      document.querySelectorAll('img').forEach(img => {
        if (!img.dataset.originalSrc) {
          img.dataset.originalSrc = img.src;
          img.src = img.src.replace(/(\.(jpg|jpeg|png|webp))$/, '-mobile$1');
        }
      });
    },
    deferNonCriticalContent() {
      // Отложенная загрузка не критического контента
      const nonCritical = document.querySelectorAll('[data-defer-mobile]');
      nonCritical.forEach(el => {
        if (el.tagName === 'IMG' && el.dataset.src) {
          el.src = el.dataset.src;
        }
      });
    }
  }
}
```

**Оптимизация тач-событий:**
```javascript
// В directives/touch-optimized.js
export default {
  bind(el, binding) {
    let startX, startY, startTime;
    
    const handleTouchStart = (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      startTime = Date.now();
    };
    
    const handleTouchEnd = (e) => {
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const endTime = Date.now();
      
      const diffX = Math.abs(endX - startX);
      const diffY = Math.abs(endY - startY);
      const diffTime = endTime - startTime;
      
      // Быстрый тап (менее 300мс и смещение менее 10px)
      if (diffTime < 300 && diffX < 10 && diffY < 10) {
        binding.value(e);
      }
    };
    
    el._touchStartHandler = handleTouchStart;
    el._touchEndHandler = handleTouchEnd;
    
    el.addEventListener('touchstart', handleTouchStart, { passive: true });
    el.addEventListener('touchend', handleTouchEnd, { passive: true });
  },
  
  unbind(el) {
    el.removeEventListener('touchstart', el._touchStartHandler);
    el.removeEventListener('touchend', el._touchEndHandler);
    
    delete el._touchStartHandler;
    delete el._touchEndHandler;
  }
}
```

## Команды сборки и разработки

Основные npm команды (выполняются в директории `src/`):

```bash
# Установка зависимостей
npm install

# Запуск в режиме разработки
npm run dev

# Сборка для production
npm run build

# Запуск собранного приложения
npm run start

# Генерация статического сайта
npm run generate

# Анализ размера бандла
npm run analyze

# Создание feature ветки (из корня проекта)
npm run create-feature
```

**Примечание**: Перед установкой зависимостей выполняется предварительная настройка разрешений с помощью `npx npm-force-resolutions`.

## Тестирование

- Тесты располагаются в директории `src/tests/`
- Имена тестовых файлов: `[component-name].spec.js`
- Используйте Jest для unit-тестов
- Стремитесь к покрытию кода не менее 80%

### Пример теста компонента:

```javascript
describe('MyComponent', () => {
  it('renders correctly', () => {
    const wrapper = mount(MyComponent, {
      propsData: { message: 'Hello' }
    })
    expect(wrapper.text()).toContain('Hello')
  })
  
  it('handles async operations', async () => {
    const wrapper = mount(MyComponent)
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.data).toBeDefined()
  })
})
```

## Безопасность

### Защита от XSS

```javascript
// Всегда экранируйте пользовательский ввод
export default {
  methods: {
    safeOutput(text) {
      return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
    }
  }
}
```

### Валидация входных данных

```javascript
// В сервисах и API
export default {
  validateInput(input) {
    if (typeof input !== 'string' || input.length > 1000) {
      throw new Error('Invalid input')
    }
    // Дополнительная валидация
    return input.trim()
  }
}
```

## Мониторинг и отладка

### Логирование

```javascript
// Структурированное логирование
const logger = {
  info(message, data = {}) {
    console.log(JSON.stringify({
      level: 'INFO',
      timestamp: new Date().toISOString(),
      message,
      ...data
    }))
  },
  error(error, context = {}) {
    console.error(JSON.stringify({
      level: 'ERROR',
      timestamp: new Date().toISOString(),
      error: error.message,
      stack: error.stack,
      ...context
    }))
  }
}
```

### Профилирование производительности

```javascript
// Измерение времени выполнения
const measurePerformance = (name, fn) => {
  const start = performance.now()
  const result = fn()
  const end = performance.now()
  
  if (process.env.NODE_ENV === 'development') {
    console.log(`${name}: ${(end - start).toFixed(2)}ms`)
  }
  
  return result
}

// Использование:
const data = measurePerformance('fetchData', () => fetchData())
```

## Рекомендации для AI-агентов

### При работе с кодом:
1. **Сначала анализируйте** существующий код и тесты
2. **Соблюдайте стиль** проекта (2 пробела, PascalCase для компонентов)
3. **Добавляйте тесты** для новой функциональности
4. **Оптимизируйте производительность** используя вышеперечисленные практики
5. **Документируйте сложные решения**

### При рефакторинге:
1. **Сохраняйте обратную совместимость**
2. **Обновляйте тесты** вместе с кодом
3. **Измеряйте влияние** на производительность
4. **Делите большие изменения** на мелкие коммиты

### При оптимизации:
1. **Измерьте перед оптимизацией**
2. **Фокусируйтесь на bottlenecks**
3. **Тестируйте после изменений**
4. **Сравнивайте метрики** до/после

**Примечание**: Этот проект использует Node.js 18.19.0, убедитесь, что у вас установлена совместимая версия.

## Дополнительные ресурсы

- [Официальная документация Nuxt.js](https://nuxtjs.org/docs)
- [Vue.js Style Guide](https://vuejs.org/style-guide/)
- [JavaScript Performance Best Practices](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Performance)
- [Vuex документация](https://vuex.vuejs.org/)
