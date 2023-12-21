<template>
  <v-flex>
    <v-layout xs12 py-3 wrap>
      <h4 class="pb-2">{{ title }}</h4>
      <v-flex xs11>
        <v-select color="accent" box v-model="currentValue" :items="items" :label="label" v-on:change="updateState()"></v-select>
      </v-flex>
      <v-flex xs1 my-2>               
        <v-btn icon small flat color="primary" v-on:click="preview()">
          <v-icon color="accent">play_circle_outline</v-icon>
        </v-btn>
      </v-flex>
    </v-layout>
  </v-flex>
</template>

<script lang="ts">
import store from '../store';
import { Howl, Howler } from 'howler';
  
export default {
  data: function(){
    return {
      currentValue: this.stateValue,
      sounds: ['Beep (High)','Beep (Low)','Beep (Echo)','Blip','Buzz','Harp','Tick Tock'],
      alarms: ['Alarm Clock (Classic)','Alarm Clock (Digital)','Buzz','Alert','Double Beep','Warning']
    }
  },
  
  created: function() {
    this.currentValue = this.stateValue;
  },

  computed: {
    // Assign the state props to the correct select elements
    stateValue: {
      get: function() {
        var option;
        if(this.timer == "stopwatch") {
          option = store.state.audio.stopwatch.sound;
        }
        if(this.timer == "countdown") {
          if(this.audiotype == "sound") {
            option = store.state.audio.countdown.sound;
          }
          if(this.audiotype == "alarm") {
            option = store.state.audio.countdown.alarm;
          }
        }
        if(this.timer == "interval") {
          if(this.audiotype == "sound") {
            option = store.state.audio.interval.sound;
          }
          if(this.audiotype == "alarm") {
            option = store.state.audio.interval.alarm;
          }
        }
        return option;
      },
      set: function (newValue) {
        this.timer = newValue;
        this.audiotype = newValue;
      }
    },
    // Define which items to display in select elements
    items: {
      get: function () {
        var items = "";
        if(this.audiotype === "sound") {
          items = this.sounds;
        } else if (this.audiotype === "alarm") {
          items = this.alarms;
        }
        return items;
      },
      set: function (newValue) {
        this.audiotype = newValue;
      }
    }
  },

  props: {
    title: {type: String, default: ''},
    label: {type: String, default: ''},
    timer: {type: String, default: ''},
    audiotype: {type: String, default: ''}
  },

  methods: {
    // Update state values when select element value changes
    updateState: function() {
      if(this.timer == "stopwatch") {
        store.state.audio.stopwatch.sound = this.currentValue;
      }
      if(this.timer == "countdown") {
        if(this.audiotype == "sound") {
          store.state.audio.countdown.sound = this.currentValue;
        }
        if(this.audiotype == "alarm") {
          store.state.audio.countdown.alarm = this.currentValue;
        }
      }
      if(this.timer == "interval") {
        if(this.audiotype == "sound") {
          store.state.audio.interval.sound = this.currentValue;
        }
        if(this.audiotype == "alarm") {
          store.state.audio.interval.alarm = this.currentValue;
        }
      }
    },
    preview: function() {
      var preview = new Howl({src: ['../sounds/' + this.currentValue + '.mp3']});
      preview.play();
    }
  },

  components: { Howl },
  store
};
</script>