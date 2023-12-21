<template>
  <v-app v-bind:style="{ fontSize: $store.state.display.font.size + 'px', fontFamily: $store.state.display.font.type }" :dark="$store.state.display.nightMode" :class="{loaded: isPageLoaded}">
    <v-content>
        <Nav />
        <Menu />
        <transition name="fade" mode="out-in">
          <router-view></router-view>
        </transition>
    </v-content>
  </v-app>
</template>

<script lang="ts">
import Nav from './navigation.vue';
import Menu from './menu.vue';
import store from '../store';
  
export default {
  data: function(){
    return {
      title: 'Exercise Timers',
      isPageLoaded: false
    }
  },

  created: function() {
    // If there are saved settings, load them
    if(localStorage.getItem('settings')) {
      const settings = JSON.parse(localStorage.getItem('settings'));
      // State mutation for audio and display
      store.commit('updateAudio', settings.audio);
      store.commit('updateDisplay', settings.display);
    }
  },

  mounted: function() {
    this.isPageLoaded = true;
  },

  components: { Nav, Menu },

  store
};
</script>