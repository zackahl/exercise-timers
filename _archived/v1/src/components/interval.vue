<template>
  <div class="content">
    <v-container fluid fill-height>
      <v-layout wrap align-center justify-center>
        <v-dialog v-model="dialog" width="500" pt-5 persistent>
          <template v-slot:activator="{ on }">
            <v-btn color="dark light--text" dark v-on="on" v-on:click="pause()" :ripple="{ class: 'accent--text' }">
              <v-icon color="accent" class="mr-2">timelapse</v-icon>Set Intervals
            </v-btn>
          </template>
          <v-card>
            <v-card-title class="primary light--text" primary-title>
              <h3 class="ma-0">Set Intervals</h3>
              <v-spacer></v-spacer>
              <v-btn flat icon color="accent" @click="dialog = false">
                <v-icon>close</v-icon>
              </v-btn>
            </v-card-title>
            <v-card-text class="pa-3">
              <v-flex>
                <h4 class="mb-3">Number of Intervals</h4>
                <v-radio-group v-model="time.numIntervalsType" v-on:change="getIntervalSeconds(time.intervalMinutes, time.intervalSeconds)" row mandatory>
                  <v-radio color="accent" label="Infinite" value="infinite"></v-radio>
                  <v-radio color="accent" label="Custom" value="custom"></v-radio>
                </v-radio-group>
                <div v-show="time.numIntervalsType === 'custom'">
                  <v-text-field box v-model="time.numIntervals" class="my-0" hide-details single-line type="number"></v-text-field>
                  <v-slider color="accent" v-model="time.numIntervals" min="1" max="20" step="1"></v-slider>
                </div>
                <v-layout row wrap>
                  <v-flex xs12 sm6 px-2>
                    <h4 class="mb-3">Interval Duration</h4>
                    <v-flex px-2>
                      <h5>Minutes</h5>
                      <v-text-field box v-model="time.intervalMinutes" class="mt-0" hide-details single-line type="number" v-on:change="getIntervalSeconds(time.intervalMinutes, time.intervalSeconds)"></v-text-field>
                      <v-slider color="accent" v-model="time.intervalMinutes" min="0" max="59" step="1" v-on:change="getIntervalSeconds(time.intervalMinutes, time.intervalSeconds)"></v-slider>
                    </v-flex>
                    <v-flex px-2>
                      <h5>Seconds</h5>
                      <v-text-field box v-model="time.intervalSeconds" class="mt-0" hide-details single-line type="number" v-on:change="getIntervalSeconds(time.intervalMinutes, time.intervalSeconds)"></v-text-field>
                      <v-slider color="accent" v-model="time.intervalSeconds" min="0" max="59" step="1" v-on:change="getIntervalSeconds(time.intervalMinutes, time.intervalSeconds)"></v-slider>
                    </v-flex>
                  </v-flex>
                  <v-flex xs12 sm6 px-2>
                    <h4 class="mb-3">Rest Duration</h4>
                    <v-flex px-2>
                      <h5>Minutes</h5>
                      <v-text-field box v-model="time.restMinutes" class="mt-0" hide-details single-line type="number" v-on:change="getRestSeconds(time.restMinutes, time.restSeconds)"></v-text-field>
                      <v-slider color="accent" v-model="time.restMinutes" min="0" max="9" step="1" v-on:change="getRestSeconds(time.restMinutes, time.restSeconds)"></v-slider>
                    </v-flex>
                    <v-flex px-2>
                      <h5>Seconds</h5>
                      <v-text-field box v-model="time.restSeconds" class="mt-0" hide-details single-line type="number" v-on:change="getRestSeconds(time.restMinutes, time.restSeconds)"></v-text-field>
                      <v-slider color="accent" v-model="time.restSeconds" min="0" max="59" step="1" v-on:change="getRestSeconds(time.restMinutes, time.restSeconds)"></v-slider>
                    </v-flex>
                  </v-flex>
                </v-layout>
                <v-expansion-panel v-show="time.numIntervalsType === 'custom'" class="mb-2" dark>
                  <v-expansion-panel-content>
                    <template v-slot:header>
                      <h4 class="mb-0"><v-icon color="accent" class="mr-2">av_timer</v-icon>Custom Durations</h4>
                    </template>
                    <v-card color="primary">
                      <v-card-text>
                        <v-layout wrap row>
                          <v-flex v-for="(interval, index) in time.numIntervals" :key="index" xs6 sm4 pa-1 ma-0>
                            <v-text-field dark box class="custom" color="accent" placeholder="00:00" mask="time" v-model="customDurations[index]" v-on:blur="customIntervalAutofill($event)"
                            :rules="[ validate ]">
                              <template v-slot:label>
                                <strong>Interval {{ index + 1 }}</strong>
                              </template>
                            </v-text-field>
                          </v-flex>
                        </v-layout>
                      </v-card-text>
                    </v-card>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-flex>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions class="primary">
              <v-btn v-if="time.numIntervalsType === 'infinite'" color="dark light--text" @click="dialog = false" v-on:click="reset()" :ripple="{ class: 'accent--text' }">
                <v-icon color="accent" class="mr-2">save</v-icon>Save
              </v-btn>
              <v-btn v-else :disabled="!time.valid" color="dark light--text" @click="dialog = false" v-on:click="getCustomIntervals(customDurations); reset()" :ripple="{ class: 'accent--text' }">
                <v-icon color="accent" class="mr-2">save</v-icon>Save
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn color="error light--text" @click="clear()" :ripple="{ class: 'error--text' }">
                <v-icon class="mr-2">delete</v-icon>Clear
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-flex xs12 pa-3>
          <v-progress-linear height="100" v-model="percentage" :color="time.progress.color"></v-progress-linear>
          <v-slider v-show="time.numIntervalsType === 'custom'" :color="time.progress.color" :value="time.currentIntervalNum" :tick-labels="intervalLabels" :max="time.numIntervals" step="1" ticks="always" tick-size="3" readonly></v-slider>
        </v-flex>
        <v-layout wrap mb-5>
          <v-flex xs12 sm4 mb-3>
            <h4>Time Remaining</h4>
            <span class="timer-small">{{ interval | ms }}</span>
          </v-flex>
          <v-flex xs12 sm4 mb-3>
            <h4>Interval Number</h4>
            <span class="timer-small">{{ time.currentIntervalNum }}<span v-if="time.numIntervalsType == 'custom'"> / {{ time.numIntervals }}</span></span>
          </v-flex>
          <v-flex xs12 sm4>
            <h4>Total Time Elapsed</h4>
            <span class="timer-small">{{ time.elapsed | hms }}</span>
          </v-flex>
        </v-layout>
        <v-bottom-nav color="primary" class="outline" dark height="50px" light>
          <v-btn :disabled="time.started || time.totalIntervalSeconds === 0 || (time.numIntervalsType == 'custom' && time.currentIntervalNum >= time.numIntervals && time.totalIntervalSeconds === 0)" large v-on:click="start()" :ripple="{ class: 'accent--text' }">
            <sub>PLAY</sub>
            <v-icon>play_arrow</v-icon>
          </v-btn>
          <v-btn :disabled="!time.started" large v-on:click="pause()" :ripple="{ class: 'accent--text' }">
            <sub>PAUSE</sub>
            <v-icon>pause</v-icon>
          </v-btn>
          <v-btn :disabled="time.progress.counter <= 0 && time.currentIntervalNum === 1" large v-on:click="reset()" :ripple="{ class: 'accent--text' }">
            <sub>Replay</sub>
            <v-icon>replay</v-icon>
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
        title: 'Interval',
        dialog: false,
        time: {
          intervalMinutes: 0,
          intervalSeconds: 0,
          totalIntervalSeconds: 0,
          totalRestSeconds: 0,
          currentIntervalNum: 1,
          numIntervalsType: "infinite",
          numIntervals: 1,
          customIntervals: [],
          interval: time.hour(0).minute(0).second(0),
          elapsed: time.hour(0).minute(0).second(0),
          rest: time.hour(0).minute(0).second(0),
          restMinutes: 0,
          restSeconds: 0,
          resting: false,
          progress: {
            color: "accent",
            counter: 0
          },
          started: false,
          setinterval: [],
          sound: null,
          valid: false
        }
      }
    },

    computed: {
      totalSeconds: {
        get: function() {
          if(this.time.numIntervalsType === "infinite") {
            return this.time.totalIntervalSeconds;
          } else {
          return this.time.totalIntervalSeconds * this.time.numIntervals;
          }
        },
        set: function() {}
      },
      interval: {
        get: function() {
          return this.time.interval.hour(0).minute(this.time.intervalMinutes).second(this.time.intervalSeconds);
        },
        set: function(newValue) {
          this.time.intervalMinutes = newValue.minute();
          this.time.intervalSeconds = newValue.second();
        }
      },
      customDurations: {
        get: function() {
          var array = store.state.interval.customDurations;
          // Two days to find this error, was set to customIntervals not customDurations *face palm*
          array.length = this.time.numIntervals;
          return array;
        },
        set: function() {}
      },
      percentage: {
        get: function() {
          if(this.totalSeconds != 0) {
            return Math.round((this.time.progress.counter / this.totalSeconds) * 100);
          }
          return 0;
        },
        set: function(newValue) {
          this.time.progress.counter = newValue;
        }
      },
      intervalLabels () {
        var labels = [];
        for(var i = 0; i <= this.time.numIntervals; i++) {
          labels.push(i);
          labels.push("");
          i++;
        }
        labels[0] = "0";
        return labels;
      },
      rest: {
        get: function() {
          return this.time.rest.hour(0).minute(this.time.restMinutes).second(this.time.restSeconds);
        },
        set: function(newValue) {
          this.time.restMinutes = newValue.minute();
          this.time.restSeconds = newValue.second();
        }
      }
    },

    filters: {
      hms: function(value) {
        value = value.format("HH:mm:ss");
        return value;
      },
      ms: function (value) {
        value = value.format("mm:ss");
        return value;
      }
    },

    created: function() {
      this.updateState();
      this.updateInterval();
      // Repopulate the custom durations
      if(this.time.customIntervals.length != 0) {
        for(var i = 0; i < this.customDurations.length; i++) {
          this.customDurations[i] = store.state.interval.customDurations[i];
        }
      }
    },

    methods: {
      updateState: function() {
        store.commit('changeTitle', this.title);
      },
      updateInterval: function() {
        // Use the previous interval values if available
        if(store.state.interval.intervalTime != null) {
          this.interval = store.state.interval.intervalTime;
          this.time.intervalMinutes = store.state.interval.intervalMinutes;
          this.time.intervalSeconds = store.state.interval.intervalSeconds;
          this.time.totalIntervalSeconds = store.state.interval.totalIntervalSeconds;
          this.time.totalRestSeconds = store.state.interval.totalRestSeconds;
          this.time.currentIntervalNum = store.state.interval.currentIntervalNum;
          this.time.numIntervalsType = store.state.interval.numIntervalsType;
          this.time.numIntervals = store.state.interval.numIntervals;
          this.time.customIntervals = store.state.interval.customIntervals;
          this.time.interval = store.state.interval.interval;
          this.time.elapsed = store.state.interval.elapsed;
          this.time.rest = store.state.interval.rest;
          this.time.restMinutes = store.state.interval.restMinutes;
          this.time.restSeconds = store.state.interval.restSeconds;
          this.time.resting = store.state.interval.resting;
          this.time.progress.color = store.state.interval.progress.color;
          this.time.progress.counter = store.state.interval.progress.counter;
        }
      },
      clear: function() {
        this.customDurations.length = 0;
        this.time.customIntervals.length = 0;
        this.time.intervalMinutes = 0;
        this.time.intervalSeconds = 0;
        this.time.restMinutes = 0;
        this.time.restSeconds = 0;
        this.time.currentIntervalNum = 1;
        this.time.totalIntervalSeconds = 0;
        // Force properties to update
        this.$forceUpdate();
      },
      getIntervalSeconds: function(minutes, seconds) {
        if(minutes != 0 || seconds != 0) {
          var customMinutes = minutes;
          var customSeconds = seconds;
          // Override custom interval values
          for(var i = 0; i < this.customDurations.length; i++) {
            if(minutes < 10) {
              customMinutes = "0" + minutes;
            }
            if(seconds < 10) {
              customSeconds = "0" + seconds; 
            }
            this.customDurations[i] = customMinutes + "" + customSeconds;
          }
          minutes = parseInt(minutes) * 60;
          seconds = parseInt(seconds);
          this.time.totalIntervalSeconds = minutes + seconds;
        } else {
          for(var i = 0; i < this.customDurations.length; i++) {
            this.customDurations[i] = "";
          }
          this.time.totalIntervalSeconds = 0;
        }
      },
      getRestSeconds: function(minutes, seconds) {
        minutes = parseInt(minutes) * 60;
        seconds = parseInt(seconds);
        this.time.totalRestSeconds = minutes + seconds;
      },
      customIntervalAutofill: function(event) {
        this.reset();
        var newValue = event.target.value.replace(":", "");
        var index = this.customDurations.indexOf(newValue);
        if(newValue.length < 5 && newValue.length > 0 && parseInt(newValue) > 0) {
          this.customDurations[index] += "0000";
          this.customDurations[index] = this.customDurations[index].substr(0,4);
        }
      },
      getCustomIntervals: function(arrayCustom) {
        // If custom intervals are set
        if(this.time.numIntervalsType === "custom" && arrayCustom.length != 0) {
          var newCustomIntervals = [];
          for(var i = 0; i < arrayCustom.length; i++) {
            // Initialize new interval and interval seconds
            var newInterval;
            var newIntervalSeconds = 0;
            var minutes = 0;
            var seconds = 0;
            // If array / interval has an input value, exract new interval time and interval seconds
            if(arrayCustom.length > 0 && arrayCustom[i] != undefined && arrayCustom[i].length > 0 && arrayCustom[i] != "0000") {
              // Get minutes and seconds from input values
              minutes = arrayCustom[i].substr(0, 2);
              seconds = arrayCustom[i].substr(2, 2);
            } 
            // Else if empty or zero value set all values to specified
            else {
              // If interval has set minutes or seconds
              if(this.time.intervalSeconds != 0 || this.time.intervalMinutes != 0) {
                this.customDurations[i] = arrayCustom[0];
                minutes = arrayCustom[0].substr(0, 2);
                seconds = arrayCustom[0].substr(2, 2);
              // If interval is empty default to 3 seconds
              } else {
                this.customDurations[i] = "0003";
                minutes = 0;
                seconds = 3;
              }
            }
            // Create new interval time
            newInterval = this.interval.hour(0).minute(minutes).second(seconds);
            newIntervalSeconds = +minutes * 60 + +seconds; // + === parseInt()
            // Push interval to array
            newCustomIntervals[i] = [newInterval, newIntervalSeconds];
          }
          // Set array of custom intervals [0] and interval seconds [1]
          this.time.customIntervals = newCustomIntervals;
          this.interval = this.time.customIntervals[0][0];
          this.time.totalIntervalSeconds = this.time.customIntervals[0][1];
        }
        return this.time.customIntervals;
      },
      start: function() {
        // Prevent multiple intervals from starting
        if(this.time.started === false) {
          this.time.started = true;
          this.time.sound = new Howl({src: ['../sounds/' + store.state.audio.interval.sound + '.mp3']})
          this.time.alarm = new Howl({src: ['../sounds/' + store.state.audio.interval.alarm + '.mp3']});

          // Set 1 second interval
          var j = setInterval(() => {
            // Add 1 second to time elapsed and interval
            this.time.elapsed = this.time.elapsed.add(1, 'second');
            this.interval = this.interval.subtract(1, 'second');
            // If it is not currently in rest mode
            if(this.time.resting === false) {
              // 5 seconds remaining sound
              if( parseInt(this.interval.format("mm")) == 0 && parseInt(this.interval.format("ss")) < 6 && parseInt(this.interval.format("ss")) > 0) {
                this.time.sound.play();
              }
              this.time.progress.counter += 1;
            }
            // If all interval cycles are completed
            if(this.percentage === 100) {
              // If custom: pause and clear time remaining
              if(this.time.numIntervalsType === "custom") {
                this.pause();
                this.interval = this.interval.hour(0).minute(0).second(0);
                this.time.totalIntervalSeconds = 0;
              } 
            }
            // If interval is completed then update values
            if(this.interval.format("mm:ss") === "00:00") {              
              // If custom durations are being used
              if(this.time.numIntervalsType === "custom" && this.customDurations.length > 0) {
                // If current interval is less than the total number of intervals
                if(this.time.currentIntervalNum < this.time.numIntervals) {
                  // Set the new interval time
                  this.interval = this.time.customIntervals[this.time.currentIntervalNum][0];
                  // Set the total interval seconds
                  this.time.totalIntervalSeconds = this.time.customIntervals[this.time.currentIntervalNum][1];
                  // Update the percentage
                  this.percentage = this.time.totalIntervalSeconds * this.time.currentIntervalNum;
                }
              } 
              // If no rest time is defined
              if(this.time.totalRestSeconds === 0) {
                if(this.time.numIntervalsType === "infinite" || this.time.currentIntervalNum < this.time.numIntervals) {
                  this.time.currentIntervalNum += 1;
                }
                // If infinite intervals
                if(this.time.numIntervalsType === "infinite") {
                  this.percentage = 0;
                }
                this.time.alarm.play();
              }
              // When resting ends increment interval number
              if(this.time.resting === true) {
                // If there are intervals remaining or type is infinite
                if(this.time.currentIntervalNum != this.time.numIntervals || this.time.numIntervalsType === "infinite") {
                  this.time.currentIntervalNum += 1;
                }
                // If infinite: reset percentage completed to 0
                if(this.time.numIntervalsType === "infinite") {
                  this.percentage = 0;
                }
              }
              // If rest values are selected start rest
              if(this.time.resting === false && this.time.totalRestSeconds > 0 && (this.time.currentIntervalNum < this.time.numIntervals || this.time.numIntervalsType === "infinite")) {
                this.time.alarm.play();
                this.startRest();
              }
              // Else reset interval to initial value
              else {
                this.interval = this.interval.hour(0).minute(0).second(0).add(this.time.totalIntervalSeconds, 'second');
                this.time.progress.color = "accent";
                this.time.resting = false;
              }    
            }
          }, 1000);
          // push the interval to a global property array
          this.time.setinterval.push(j);
        }
      },
      startRest: function() {
        this.interval = this.interval.hour(0).minute(0).second(0).add(this.time.totalRestSeconds, 'second');
        this.time.progress.color = "error";
        this.time.resting = true;
      },
      pause: function() {
        this.time.setinterval.forEach(clearInterval);
        this.time.started = false;
      },
      reset: function() {
        this.pause();
        //If custom values are present reset interval to first value 'interval 1'
        if(this.time.numIntervalsType === "custom" && this.time.customIntervals.length > 0) {
          this.interval = this.interval.hour(0).minute(0).second(0).add(this.time.customIntervals[0][1], 'second');
          this.time.totalIntervalSeconds = this.time.customIntervals[0][1];
        } else {
          this.interval = this.interval.hour(0).minute(0).second(0).add(this.time.totalIntervalSeconds, 'second');
        }
        this.time.currentIntervalNum = 1;
        this.time.elapsed = dayjs().hour(0).minute(0).second(0);
        this.time.resting = false;
        this.time.progress.color = "accent";
        this.time.progress.counter = 0;
      },
      validate: function(value) {
        if(value != undefined) {
          // Not empty
          if(value.length === 0) {
            this.time.valid = false;
            return 'Required.';
          }
          // Between 00:00 and 59:59 
          if(!(/([0-5][0-9][0-5][0-9]*)\w+/.test(value))) {
            this.time.valid = false;
            return 'Invalid Time.';
          }
          // Not set to 00:00
          if(value === "0000") {
            this.time.valid = false;
            return 'Invalid Time.';
          }
          this.time.valid = true;
        }
        return true;
      }
    },

    // Save interval data before changing router
    beforeRouteLeave (to, from, next) {
      store.state.interval.intervalTime = this.interval;
      store.state.interval.intervalMinutes = this.time.intervalMinutes;
      store.state.interval.intervalSeconds = this.time.intervalSeconds;
      store.state.interval.totalIntervalSeconds = this.time.totalIntervalSeconds;
      store.state.interval.totalRestSeconds = this.time.totalRestSeconds;
      store.state.interval.currentIntervalNum = this.time.currentIntervalNum;
      store.state.interval.numIntervalsType = this.time.numIntervalsType;
      store.state.interval.numIntervals = this.time.numIntervals;
      store.state.interval.customDurations = this.customDurations;
      store.state.interval.customIntervals = this.time.customIntervals;
      store.state.interval.interval = this.time.interval;
      store.state.interval.elapsed = this.time.elapsed;
      store.state.interval.rest = this.time.rest;
      store.state.interval.restMinutes = this.time.restMinutes;
      store.state.interval.restSeconds = this.time.restSeconds;
      store.state.interval.resting = this.time.resting;
      store.state.interval.progress.color = this.time.progress.color;
      store.state.interval.progress.counter = this.time.progress.counter;      
      this.pause();
      next();
    },

    components: { Howl },
    store
  }
</script>