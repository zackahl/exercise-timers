<template>
  <transition name="slide-fade">
    <div v-show="$store.state.toggle === true" class="menu" dark id="menu">
      <v-toolbar color="primary" dense class="mt-5 pa-0 nav">
        <v-tabs color="primary" class="outline" hide-slider centered grow mandatory>
          <v-tab v-for="section in sections" class="accent--text" :key="section" v-on:click="updateSelected(section)" grow>
            {{ section }}
          </v-tab>
        </v-tabs>
      </v-toolbar>
      <v-tabs-items>
        <!-- Audio -->
        <v-tab-item v-if="selectedTab === 'Audio'"> 
        <v-container fluid>
          <v-layout wrap>
            <v-flex xs12 py-3>
              <h4 class="pb-2">Volume</h4>
              <v-slider dark color="accent" v-model="volume" min="0" max="10" append-icon="volume_up" prepend-icon="volume_down" v-on:change="volumeChange"></v-slider>
            </v-flex>
            <v-expansion-panel dark color="accent" style="box-shadow: none">
              <v-expansion-panel-content class="my-1 light--text">
                <template v-slot:header>
                  <div class="subheading">Stopwatch</div>
                </template>
                <v-card class="light--text">
                  <v-card-text class="primary">
                    <audioselect title="Sound" label="1 Minute Interval" timer="stopwatch" audiotype="sound" :key="'stopwatchSound' + rerender"></audioselect>
                  </v-card-text>
                </v-card>
              </v-expansion-panel-content>
              <v-expansion-panel-content class="my-1 light--text">
                <template v-slot:header>
                  <div class="subheading">Countdown</div>
                </template>
                <v-card class="light--text">
                  <v-card-text class="primary">
                    <audioselect title="Sound" label="10 Seconds Remaining" timer="countdown" audiotype="sound" :key="'countdownSound' + rerender"></audioselect>
                    <audioselect title="Alarm" label="Countdown Complete" timer="countdown" audiotype="alarm" :key="'countdownAlarm' + rerender"></audioselect>
                  </v-card-text>
                </v-card>
              </v-expansion-panel-content>
              <v-expansion-panel-content class="my-1 light--text">
                <template v-slot:header>
                  <div class="subheading">Interval</div>
                </template>
                <v-card class="light--text">
                  <v-card-text class="primary">
                    <audioselect title="Sound" label="5s Before Interval End" timer="interval" audiotype="sound" :key="'intervalSound' + rerender"></audioselect>
                    <audioselect title="Alarm" label="Intervals Completed" timer="interval" audiotype="alarm" :key="'intervalAlarm' + rerender"></audioselect>
                  </v-card-text>
                </v-card>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-layout>
        </v-container>
        </v-tab-item>
        <!-- Display -->
        <v-tab-item v-if="selectedTab === 'Display'"> 
        <v-container fluid>
          <v-layout wrap align-center>
            <v-flex xs12 py-3>
              <v-flex xs12 py-3>
                <h4 class="pb-2">Color</h4>
                <v-select dark color="accent" v-model="$store.state.display.color.shade" :items="$store.state.display.color.shades" box label="Color" v-on:change="colorChange"></v-select>
              </v-flex>
              <h4 class="pb-2">Font</h4>
              <v-select dark color="accent" v-model="$store.state.display.font.type" :items="$store.state.display.font.types" box label="Font Type"></v-select>
              <v-slider dark color="accent" v-model="$store.state.display.font.size" min="12" max="20" prepend-icon="format_size"></v-slider>
            </v-flex>
            <v-flex xs12 py-3>
              <h4 class="pb-2">Mode</h4>
              <v-switch dark color="accent" v-model="$store.state.display.nightMode" value append-icon="brightness_3" prepend-icon="brightness_5"></v-switch>
            </v-flex>
          </v-layout>
        </v-container>
        </v-tab-item>
      </v-tabs-items>
      <v-container fluid>
        <v-layout wrap align-center>
          <v-flex xs12>
            <v-btn v-on:click="save()" color="dark light--text" :ripple="{ class: 'accent--text' }">
              <v-icon color="accent" class="mr-2">save</v-icon>Save
            </v-btn>
            <v-btn v-on:click="reset()" color="error light--text" :ripple="{ class: 'error--text' }">
              <v-icon color="light" class="mr-2">settings_backup_restore</v-icon>Reset {{ selectedTab }}
            </v-btn>
          </v-flex>
          <transition name="fade" mode="in-out">
            <v-flex xs12 pa-2 v-show="saved.status != false" class="accent--text">{{ saved.message }}</v-flex>
          </transition>
        </v-layout>
      </v-container>
    </div>
  </transition>
</template>

<script lang="ts">
  import store from '../store';
  import { Howl, Howler } from 'howler';
  import colors from 'vuetify/es5/util/colors';
  import audioselect from './audioselect.vue';
  const initialStateCopy = JSON.parse(JSON.stringify(store.state));

  export default {
    data: function(){
      return {
        title: 'Settings',
        selectedTab: 'Audio',
        sections: ['Audio', 'Display'],
        rerender: 0,
        volume: 5,
        saved: {
          status: false,
          message: "Changes saved."
        }
      }
    },

    methods: {
      // Update to the selected tab
      updateSelected: function(i) {
        this.selectedTab = i;
      },
      // Change key values to force rerender
      forceRerender() {
        this.rerender += 1;
      },
      // Reset to the default state
      reset: function() {
        // Remember current tab
        var tab = this.selectedTab;
        // Reset Audio 
        if (tab === "Audio") {
          store.commit('updateAudio', JSON.parse(JSON.stringify(initialStateCopy.audio)));
          this.volume = 5;
          this.volumeChange();
        }
        // Reset Display
        else if (tab === "Display") {
          store.commit('updateDisplay', JSON.parse(JSON.stringify(initialStateCopy.display)));
          this.colorChange();
        }        
        // Rerender necessary components
        this.forceRerender();
      },
      save: function() {
        // Save the current state to local storage
        localStorage.setItem('settings', JSON.stringify(store.state));
        this.saved.status = true;
        var j = setTimeout(() => {
          this.saved.status  = false;
        }, 3000);
      },
      volumeChange: function() {
        // Control the volume of all audio
        Howler.volume(this.volume / 100);
      },
      colorChange: function() {
        var color = (store.state.display.color.shade).toLowerCase();
        this.$vuetify.theme.accent = colors[color].accent2;
      }
    },

    mounted: function() {
      this.colorChange();
    },

    components: { Howl, audioselect },
    store
  }
</script>