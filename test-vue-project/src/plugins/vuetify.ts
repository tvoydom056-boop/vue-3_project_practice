// Vuetify 3 plugin configuration
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// Import MDI icons
import '@mdi/font/css/materialdesignicons.css'

export const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#6366F1',
          secondary: '#8B5CF6',
          accent: '#F59E0B',
          success: '#10B981',
          error: '#EF4444',
          warning: '#F59E0B',
          info: '#3B82F6',
          background: '#F8FAFC',
          surface: '#FFFFFF',
          'on-surface': '#1E293B',
        },
      },
      dark: {
        colors: {
          primary: '#818CF8',
          secondary: '#A78BFA',
          accent: '#FBBF24',
          success: '#34D399',
          error: '#F87171',
          warning: '#FBBF24',
          info: '#60A5FA',
          background: '#0F172A',
          surface: '#1E293B',
          'on-surface': '#F1F5F9',
        },
      },
    },
  },
})
