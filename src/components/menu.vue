<template>
  <v-navigation-drawer
    v-model="store.settingsMenu"
    id="menu"
    width="494"
    location="right"
    scrim
    temporary
    :color="store.display.nightMode ? undefined : 'white'"
    :key="data.resetKey"
  >
    <v-toolbar
      absolute
      color="background"
      density="compact"
      style="z-index: 999"
    >
      <v-tabs grow>
        <v-tab
          v-for="section in data.sections"
          :key="section"
          @click="updateSelected(section)"
          grow
        >
          {{ section }}
        </v-tab>
      </v-tabs>
    </v-toolbar>
    <v-window v-model="data.selectedTab" class="mt-14">
      <!-- Audio -->
      <v-window-item value="Audio" color="primary">
        <v-container fluid>
          <v-row>
            <v-col cols="12">
              <h4 class="pb-2">Volume</h4>
              <v-slider
                v-model="store.audio.volume"
                @update:model-value="volumeChange"
                min="0"
                max="100"
                step="1"
                append-icon="mdi-volume-plus"
                prepend-icon="mdi-volume-minus"
                thumb-label
              ></v-slider>
            </v-col>
          </v-row>
          <v-expansion-panels multiple variant="accordion">
            <v-expansion-panel class="mb-2">
              <v-expansion-panel-title>
                <v-icon icon="mdi-clock" class="mr-2" />Global
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <audioselect
                  title="Start"
                  label="Start"
                  timer="global"
                  audiotype="start"
                ></audioselect>
              </v-expansion-panel-text>
              <v-expansion-panel-text>
                <audioselect
                  title="Pause"
                  label="Pause"
                  timer="global"
                  audiotype="pause"
                ></audioselect>
              </v-expansion-panel-text>
            </v-expansion-panel>
            <v-expansion-panel class="mb-2">
              <v-expansion-panel-title>
                <v-icon icon="mdi-timer" class="mr-2" />Stopwatch
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <audioselect
                  title="1 Minute Interval"
                  label="1 Minute Interval"
                  timer="stopwatch"
                  audiotype="oneMinute"
                ></audioselect>
              </v-expansion-panel-text>
            </v-expansion-panel>
            <v-expansion-panel class="mb-2">
              <v-expansion-panel-title>
                <v-icon icon="mdi-alarm" class="mr-2" />Countdown
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <audioselect
                  title="10 Seconds Remaining"
                  label="10 Seconds Remaining"
                  timer="countdown"
                  audiotype="tenSeconds"
                ></audioselect>
                <audioselect
                  title="Countdown Complete"
                  label="Countdown Complete"
                  timer="countdown"
                  audiotype="completed"
                ></audioselect>
              </v-expansion-panel-text>
            </v-expansion-panel>
            <v-expansion-panel class="mb-2">
              <v-expansion-panel-title>
                <v-icon icon="mdi-timelapse" class="mr-2" />Interval
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <audioselect
                  title="5s Before Interval End"
                  label="5s Before Interval End"
                  timer="interval"
                  audiotype="fiveSeconds"
                ></audioselect>
                <audioselect
                  title="Intervals Completed"
                  label="Intervals Completed"
                  timer="interval"
                  audiotype="completed"
                ></audioselect>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-container>
      </v-window-item>
      <!-- Display -->
      <v-window-item value="Display">
        <v-container fluid>
          <v-row>
            <v-col cols="12">
              <h4 class="pb-2">Timer Colour</h4>
              <v-select
                v-model="store.display.color.timer"
                label="Colour"
                :items="display.textColors"
              />
            </v-col>
            <v-col cols="12">
              <h4 class="pb-2">Background Colour</h4>
              <v-select
                v-model="store.display.color.background"
                label="Colour"
                :items="display.bgColors"
              />
            </v-col>
            <v-col cols="12">
              <h4 class="pb-2">Background Animation</h4>
              <v-select
                v-model="store.display.animation"
                label="Colour"
                :items="display.animations"
              />
            </v-col>
            <v-col cols="12">
              <h4 class="pb-2">Font</h4>
              <v-select
                v-model="store.display.font.type"
                :items="display.fonts"
                label="Font Type"
              ></v-select>
            </v-col>
            <v-col cols="12">
              <h4 class="pb-2">Font Weight</h4>
              <v-select
                v-model="store.display.font.weight"
                :items="display.weights"
                label="Font Type"
              ></v-select>
            </v-col>
            <v-col cols="12">
              <h4 class="pb-2">Format</h4>
              <v-select
                v-model="store.display.format"
                :items="display.formats"
                label="Font Type"
              ></v-select>
            </v-col>
            <v-col cols="12">
              <h4 class="pb-2">Theme</h4>
              <v-switch
                v-model="store.display.nightMode"
                hide-details
                prepend-icon="mdi-theme-light-dark"
                :label="store.display.nightMode ? 'Dark' : 'Light'"
                :color="store.display.nightMode ? 'secondary' : 'white'"
                @change="
                  theme.global.name.value = theme.global.current.value.dark
                    ? 'light'
                    : 'dark'
                "
              >
              </v-switch>
            </v-col>
          </v-row>
        </v-container>
      </v-window-item>
    </v-window>
    <v-container fluid>
      <v-row>
        <v-col cols="12">
          <v-btn v-blur @click="save()" text="save" class="mr-2" variant="text">
            <template v-slot:prepend>
              <v-icon icon="mdi-content-save" color="green" />
            </template>
          </v-btn>
          <v-btn
            v-blur
            @click="reset()"
            :text="`reset ${data.selectedTab}`"
            variant="text"
          >
            <template v-slot:prepend>
              <v-icon icon="mdi-restore" color="red" />
            </template>
          </v-btn>
          <v-snackbar
            v-model="data.saved.status"
            :timeout="2000"
            color="primary"
          >
            {{ data.saved.message }}
            <template v-slot:actions>
              <v-btn
                v-blur
                variant="text"
                @click="data.saved.status = false"
                icon="mdi-close"
              />
            </template>
          </v-snackbar>
        </v-col>
      </v-row>
    </v-container>
    <template v-slot:append>
      <v-toolbar color="background" density="compact" :border="true">
        <v-btn
          v-blur
          @click="store.toggleSettingsMenu"
          prepend-icon="mdi-close"
          text="close"
          class="mr-2"
        />
      </v-toolbar>
    </template>
  </v-navigation-drawer>
</template>

<script lang="ts" setup>
import { initState, useAppStore } from "@/store/app";
import { Howler } from "howler";
import { onMounted, ref } from "vue";
import { useTheme } from "vuetify";
import audioselect from "./AudioSelect.vue";
import display from "../models/Display"

const store = useAppStore();

const theme = useTheme();

const data = ref({
  title: "Settings",
  selectedTab: "Audio",
  sections: ["Audio", "Display"],
  saved: {
    status: false,
    message: "Changes saved.",
  },
  resetKey: 0
});

// Update to the selected tab
const updateSelected = (tab: string) => {
  data.value.selectedTab = tab;
};

const volumeChange = () => {
  // Control the volume of all audio
  Howler.volume(store.audio.volume / 1000);
};

// Reset to the default state
const reset = () => {
  // Remember current tab
  var tab = data.value.selectedTab;
  // Reset Audio
  if (tab === "Audio") {
    store.audio = initState.audio;
  }
  // Reset Display
  else if (tab === "Display") {
    store.display = initState.display;
    theme.global.name.value = store.display.nightMode ? "dark" : "light";
  }
  data.value.resetKey += 1;
};

// Save the current state to local storage
const save = () => {
  // localStorage.setItem("settings", JSON.stringify(store));
  data.value.saved.status = true;
  var j = setTimeout(() => {
    data.value.saved.status = false;
  }, 3000);
};

// On component mount
onMounted(() => {
  Howler.volume(store.audio.volume / 1000);
  theme.global.name.value = store.display.nightMode ? "dark" : "light";
});
</script>

<style lang="scss" scoped>
.v-expansion-panel-title--active {
  font-weight: bold;
}
</style>
