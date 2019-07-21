// Import Vue and styles
import Vue from "vue";
import Vuetify, {
  VApp,
  VFadeTransition,
  VBtn,
  VToolbar,
  VTabs,
  VInput,
  VSelect
} from 'vuetify/lib';
import './style.scss';
import 'vuetify/src/stylus/app.styl';
import colors from 'vuetify/es5/util/colors';

// Initialise vuetify with theme
Vue.use(Vuetify, {
  theme: {
    primary: colors.blueGrey.darken4, // #263238
    secondary: colors.blueGrey.darken2, // #455a64
    accent: colors.teal.accent2, // #64FFDA
    light: colors.shades.white, // #FFF
    dark: "#1f292e"
  }
})

// Import the single file components
import Store from './store';
import App from './components/app.vue';
import Home from './components/home.vue';
import Stopwatch from './components/stopwatch.vue';
import Countdown from './components/countdown.vue';
import Interval from './components/interval.vue';

// Initialise the vue router
import VueRouter from 'vue-router';
Vue.use(VueRouter);

// Define the routes
const routes = [
//route default 
{ path: '/', component: Home },
//route for home
{ path: '/home', component: Home },
// route for stopwatch
{ path: '/stopwatch', component: Stopwatch },
// route for countdown
{ path: '/countdown', component: Countdown },
// route for interval
{ path: '/interval', component: Interval }
]

// Create the router instance and pass the `routes` option
const router = new VueRouter({
  routes: routes,
  //mode: 'hash'
  mode: 'history'
})

// Instanciate the vue instance
let v = new Vue({
    el: "#app",
    data: Store,
    components: { App },
    template: '<div class="app"><App /></div>',
    // Pass in the router to the Vue instance
    router
//mount the router on the app
}).$mount('#app')