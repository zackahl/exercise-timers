<template>
  <div class="content">
    <v-container fluid fill-height>
      <v-layout wrap align-center justify-center>
        <v-switch v-model="stopwatch.animation" value prepend-icon="adjust" style="flex: 0; position: fixed; top: 40px; right: 0;"></v-switch>
        <v-flex xs12 mb-5>
          <transition name="fade" mode="out-in">
            <v-progress-circular v-if="stopwatch.animation" :rotate="-90" style="width: 30vw; height: 30vw; min-width: 290px; min-height: 290px" :width="1" :value="percentage" color="accent">
              <span class="timer" style="font-size: calc(4vw + 30px)">{{ stopwatch.time | hms }}</span>
            </v-progress-circular>
            <span v-else class="timer">{{ stopwatch.time | hms }}</span>
          </transition>
        </v-flex>
        <v-bottom-nav color="primary" class="outline" dark height="50px" light>
          <v-btn :disabled="stopwatch.started" large v-on:click="start()" :ripple="{ class: 'accent--text' }">
            <sub>PLAY</sub>
            <v-icon>play_arrow</v-icon>
          </v-btn>
          <v-btn :disabled="!stopwatch.started" large v-on:click="pause()" :ripple="{ class: 'accent--text' }">
            <sub>PAUSE</sub>
            <v-icon>pause</v-icon>
          </v-btn>
          <v-btn :disabled="stopwatch.counter <= 0" large v-on:click="stop()" :ripple="{ class: 'accent--text' }">
            <sub>STOP</sub>
            <v-icon>stop</v-icon>
          </v-btn>
        </v-bottom-nav>
      </v-layout>
    </v-container>
  </div>
</template>


<script lang="ts">
  import store from '../store';
  import { Howl, Howler } from 'howler';
  import * as dayjs from 'dayjs';

  export default {

    data: function(){
      let time = dayjs()
      return {
        title: 'Stopwatch',
        stopwatch: {
          time: time.hour(0).minute(0).second(0),
          progress: 0,
          counter: 0,
          animation: true,
          started: false,
          setinterval: [],
          sound: null
        }
      }
    },
    
    computed: {
      percentage: {
        get: function() {
          return Math.round((this.stopwatch.progress / 60) * 100);
        },
        set: function(newValue) {
          this.stopwatch.progress = newValue;
        }
      }
    },

    filters: {
      hms: function (value) {
        value = value.format("HH:mm:ss");
        return value;
      }
    },

    created: function () {
       this.updateStopwatch();
       this.updateState();
    },

    methods: {
      updateState: function() {
        store.commit('changeTitle', this.title);
      },
      updateStopwatch: function() {
        if(store.state.stopwatch.time != null) {
          this.stopwatch.time = store.state.stopwatch.time;
          this.stopwatch.progress = store.state.stopwatch.progress;
          this.stopwatch.counter = store.state.stopwatch.progress;
          this.stopwatch.animation = store.state.stopwatch.animation;
        }
      },
      start: function() {
        // Prevent multiple intervals from starting
        if(this.stopwatch.started === false) {
          this.stopwatch.started = true;
          this.stopwatch.sound = new Howl({src: ['../sounds/' + store.state.audio.stopwatch.sound + '.mp3']})
          var j = setInterval(() => {
            this.stopwatch.time = this.stopwatch.time.add(1, 'second');
            this.stopwatch.progress += 1;
            this.stopwatch.counter += 1;
            // Play sound every minute
            if(this.stopwatch.time.second() == "0") {
              this.stopwatch.sound.play();
              this.stopwatch.progress = 0;
            }
          }, 1000);
          // push the interval to a global property array
          this.stopwatch.setinterval.push(j);
        }
      },
      pause: function() {
        this.stopwatch.setinterval.forEach(clearInterval);
        this.stopwatch.started = false;
      },
      stop: function() {
        this.pause();
        this.stopwatch.time = dayjs().hour(0).minute(0).second(0);
        this.stopwatch.progress = 0;
        this.stopwatch.counter = 0;
      }
    },

    // Save stopwatch time before changing router
    beforeRouteLeave (to, from, next) {
      store.state.stopwatch.time = this.stopwatch.time;
      store.state.stopwatch.progress = this.stopwatch.progress;
      store.state.stopwatch.progress = this.stopwatch.counter;
      store.state.stopwatch.animation = this.stopwatch.animation;
      this.pause();
      next();
    },

    components: { Howl },
    store
  }
</script>