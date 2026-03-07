import { VueQueryPlugin } from '@tanstack/vue-query'
import { queryClient } from '@/shared/api/queryClient'

// Плагин для интеграции Vue Query в приложение
export const vueQueryPlugin = {
  install(app: any) {
    app.use(VueQueryPlugin, { queryClient })
  }
}
