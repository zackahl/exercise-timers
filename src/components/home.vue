<template>
  <div class="content pt-5" id="content">
    <div class="content-info mt-5">
      <h1>{{ title }}</h1>
      <p class="px-5">Create and customize a timer that suites your exercise of choice such as stretching, weight lifting and high intensity interval training.</p>
    </div>
    <div class="content-stopwatch sm4 xs12">
      <router-link v-bind:to="'/stopwatch'">
        <h2>Stopwatch</h2>
        <v-icon class="timer-icon">timer</v-icon>
      </router-link>
    </div>
    <div class="content-countdown sm4 xs12">
      <router-link v-bind:to="'/countdown'">
        <h2>Countdown</h2>
        <v-icon class="timer-icon">alarm</v-icon>
      </router-link>
    </div>
    <div class="content-interval sm4 xs12">
      <router-link v-bind:to="'/interval'">
        <h2>Interval</h2>
        <v-icon class="timer-icon">timelapse</v-icon>
      </router-link>
    </div>
    <div class="content-footer pb-4" id="footer">
      <v-layout wrap align-end>
        <v-flex xs12 sm4>
          <h4>Follow</h4>
          <v-btn v-for="(icon, index) in $store.state.socials.icons" :aria-label="$store.state.socials.links[index]" :href="$store.state.socials.links[index]" icon>
            <v-icon size="30px">{{ icon }}</v-icon>
          </v-btn>
        </v-flex>
        <v-flex xs12 sm4 class="copyright">
          <a aria-label="https://www.zacharykahl.com" href="https://www.zacharykahl.com" >&copy; Zachary Kahl 2019</a>
          <br>
          <a aria-label="Sound effects provided by www.zapsplat.com" href=”https://www.zapsplat.com” style="font-size: 10px">Sound effects obtained from zapsplat.com</a>
        </v-flex>
        <v-flex xs12 sm4>
          <h4>Share</h4>
          <v-btn v-for="(icon, index) in $store.state.shares.icons" :aria-label="$store.state.shares.links[index]" :href="$store.state.shares.links[index]" icon>
            <v-icon size="30px">{{ icon }}</v-icon>
          </v-btn>
        </v-flex>
      </v-layout>
    </div>
  </div>
</template>
      
<script lang="ts">
  import store from '../store';

  export default {
    data: function(){
      return {
        title: 'Exercise Timers' 
      }
    },

    created: function () {
       this.updateState();
    },

    methods: {
      updateState: function() {
        store.commit('changeTitle', this.title);
      }
    },

    store
  }
</script>