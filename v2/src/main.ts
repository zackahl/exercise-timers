/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'

const app = createApp(App)

// Global directives

// Custom directive called `v-blur` that prevents focus
app.directive('blur', {
    // mounted: (el) => el.blur()
    mounted: (el) => {
        el.onfocus = (ev: { target: { blur: () => any; }; }) => ev.target.blur()
    }
});

registerPlugins(app)

app.mount('#app')
