/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'
// import colors from 'vuetify/lib/util/colors.mjs'
import colors from 'vuetify/util/colors'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          background: colors.grey.lighten4,
          surface: colors.shades.white,
          primary: colors.grey.darken4,
          secondary: colors.grey.darken2,
          error: colors.red.lighten1,
          info: colors.blue.darken1,
          success: colors.green.darken1,
          warning: colors.amber.darken1
        },
      },

      dark: {
        colors: {
          background: colors.grey.darken4,
          surface: colors.shades.black,
          primary: colors.shades.white,
          secondary: colors.shades.white,
          error: colors.red.lighten1,
          info: colors.blue.darken1,
          success: colors.green.darken1,
          warning: colors.amber.darken1
        }
      }
    },
  }
})