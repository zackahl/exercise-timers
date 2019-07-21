<template>
  <div class="content">
    <v-container fluid fill-height>
      <v-layout row wrap align-center justify-center>
        <v-switch v-model="time.animation" value prepend-icon="adjust" style="flex: 0; position: absolute; bottom: 50px; right: 5px"></v-switch>
        <v-dialog v-model="dialog" width="500" pt-5 persistent>
          <template v-slot:activator="{ on }">
            <v-btn color="dark light--text" pt-5 large dark v-on="on" v-on:click="pause()" :ripple="{ class: 'accent--text' }">
              <v-icon color="accent" class="mr-2">alarm</v-icon>Set Countdown
            </v-btn>
          </template>
          <v-card>
            <v-card-title class="primary light--text" primary-title>
              <h3 class="ma-0">Set Countdown</h3>
              <v-spacer></v-spacer>
              <v-btn flat icon color="accent" @click="dialog = false">
                <v-icon>close</v-icon>
              </v-btn>
            </v-card-title>
            <v-card-text class="pb-0">
              <v-layout wrap>
                <v-flex xs12 sm4 px-2>
                  <h4>Hours</h4>
                  <v-text-field box v-model="time.setHours" class="mt-0" hide-details single-line type="number" v-on:change="getTotalSeconds()"></v-text-field>
                  <v-slider color="accent" v-model="time.setHours" min="0" max="24" step="1" v-on:change="getTotalSeconds()"></v-slider>
                </v-flex>
                <v-flex xs12 sm4 px-2>
                  <h4>Minutes</h4>
                  <v-text-field box v-model="time.setMinutes" class="mt-0" hide-details single-line type="number" v-on:change="getTotalSeconds()"></v-text-field>
                  <v-slider color="accent" v-model="time.setMinutes" min="0" max="59" step="1" v-on:change="getTotalSeconds()"></v-slider>
                </v-flex>
                <v-flex xs12 sm4 px-2>
                  <h4>Seconds</h4>
                  <v-text-field box v-model="time.setSeconds" class="mt-0" hide-details single-line type="number" v-on:change="getTotalSeconds()"></v-text-field>
                  <v-slider color="accent" v-model="time.setSeconds" min="0" max="59" step="1" v-on:change="getTotalSeconds()"></v-slider>
                </v-flex>
              </v-layout>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions class="primary">
              <v-btn color="dark light--text" @click="dialog = false;" :ripple="{ class: 'accent--text' }">
                <v-icon color="accent" class="mr-2">save</v-icon>Save
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn color="error light--text" @click="clear()" :ripple="{ class: 'error--text' }">
                <v-icon class="mr-2">delete</v-icon>Clear
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-flex xs12 py-5 mb-5>
          <transition name="fade" mode="out-in">
            <v-progress-circular v-if="time.animation" :rotate="-90" style="width: 30vw; height: 30vw; min-width: 290px; min-height: 290px" :width="1" :value="percentage" color="accent">
              <span class="timer" style="font-size: calc(4vw + 30px)">{{ countdown | hms }}</span>
            </v-progress-circular>
            <span v-else class="timer">{{ countdown | hms }}</span>
          </transition>
        </v-flex>  
        <v-bottom-nav color="primary" class="outline" dark height="50px" light>
          <v-btn large :disabled="time.started || time.setSeconds === 0 && time.setMinutes === 0 && time.setHours === 0" v-on:click="start()" :ripple="{ class: 'accent--text' }">
            <sub>PLAY</sub>
            <v-icon>play_arrow</v-icon>
          </v-btn>
          <v-btn :disabled="!time.started" large v-on:click="pause()" :ripple="{ class: 'accent--text' }">
            <sub>PAUSE</sub>
            <v-icon>pause</v-icon>
          </v-btn>
          <v-btn :disabled="time.totalSeconds <= 0" large v-on:click="stop()" :ripple="{ class: 'accent--text' }">
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
        title: 'Countdown',
        dialog: false,
        time: {
          setHours: 0,
          setMinutes: 0,
          setSeconds: 0,
          totalSeconds: 0,
          started: false,
          interval: [],
          countdown: time,
          progress: 0,
          animation: true,
          sound: null,
          alarm: null
        }
      }
    },

    computed: {
      countdown: {
        get: function () {
          return this.time.countdown.hour(this.time.setHours).minute(this.time.setMinutes).second(this.time.setSeconds)
        },
        set: function (newValue) {
          this.time.setHours = newValue.hour();
          this.time.setMinutes = newValue.minute();
          this.time.setSeconds = newValue.second();
        }
      },
      percentage: {
        get: function() {
          if(this.time.totalSeconds != 0) {
            return Math.round((this.time.progress / this.time.totalSeconds) * 100);
          }
          return 0; 
        },
        set: function(newValue) {
          this.time.progress = newValue;
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
      this.updateState();
      this.updateCountdown();
    },

    methods: {
      updateState: function() {
        store.commit('changeTitle', this.title);
      },
      updateCountdown: function() {
        // Use the previous countdown values if available
        if(store.state.countdown.time != null) {
          this.countdown = store.state.countdown.time;
          this.time.totalSeconds = store.state.countdown.totalSeconds;
          this.time.progress = store.state.countdown.progress;
          this.time.animation = store.state.countdown.animation;
        }
      },
      getTotalSeconds: function () {
        this.time.totalSeconds = 0;
        this.time.progress = 0
        var totalSeconds = (this.time.setHours * 3600) + (this.time.setMinutes * 60) + this.time.setSeconds;
        this.time.totalSeconds = totalSeconds;
      },
      clear: function() {
        this.time.setHours = 0;
        this.time.setMinutes = 0;
        this.time.setSeconds = 0;
      },
      start: function() {
        // Prevent multiple intervals from starting or starting countdown on 0
        if(this.time.started === false && (this.countdown.format("HH:mm:ss") != "00:00:00")) {
          this.time.started = true;
          this.time.sound = new Howl({src: ['../sounds/' + store.state.audio.countdown.sound + '.mp3']});
          this.time.alarm = new Howl({src: ['../sounds/' + store.state.audio.countdown.alarm + '.mp3']});
          var j = setInterval(() => {
            this.countdown = this.countdown.subtract(1, 'second');
            this.time.progress += 1;
            // 10 second remaining sound
            if(parseInt(this.countdown.format("mm")) == 0 && parseInt(this.countdown.format("ss")) < 11 && parseInt(this.countdown.format("ss")) > 0) {
              this.time.sound.play();
            }
            // Stop once countdown reaches 0
            if((this.countdown.format("HH:mm:ss") === "00:00:00")) {
              this.stop();
              this.time.alarm.play();
            }
          }, 1000);
          // push the interval to a global property array
          this.time.interval.push(j);
        }
      },
      pause: function() {
        this.time.interval.forEach(clearInterval);
        this.time.started = false;
      },
      stop: function() {
        this.pause();
        this.countdown = dayjs().hour(0).minute(0).second(0);
        this.time.progress = 0;
        this.time.totalSeconds = 0;
      }
    },

    // Save countdown time before changing router
    beforeRouteLeave (to, from, next) {
      store.state.countdown.time = this.countdown;
      store.state.countdown.totalSeconds = this.time.totalSeconds;
      store.state.countdown.progress = this.time.progress;
      store.state.countdown.animation = this.time.animation;
      this.pause();
      next();
    },

    components: { Howl },
    store
  }
</script>