<template>
  <v-toolbar absolute app height="120" class="pa-5" color="transparent" style="z-index: 999;">
    <!-- Record Split -->
    <v-btn
      v-blur
      prepend-icon="mdi-timer-stop"
      text="split / lap"
      variant="tonal"
      class="mt-5 text-button"
      :disabled="!stopwatch.running"
      @click="split"
      style="position: fixed; top: 45px; left: 10px"
    />
    <!-- Current Date/Time -->
    <template v-if="!mobile">
      <v-spacer/>
      <datetime/>
      <v-spacer/>
    </template>
    <!-- Toggle Timer View -->
    <v-switch
      v-model="stopwatch.animation"
      prepend-icon="mdi-adjust"
      style="position: fixed; top: 40px; right: 10px"
      class="pa-3"
      color="primary"
    />
  </v-toolbar>
  <v-container fluid class="fill-height" 
    :style="`
      font-size: ${store.display.font.size}px !important;
      font-family: ${store.display.font.type} !important;
      font-weight: ${store.display.font.weight} !important;
    `">
    <!-- Background Animation -->
    <particles
      id="stopwatch-particles"
      :variant="store.display.animation"
      :key="store.display.animation"
    />
    <v-row>
      <!-- Timer -->
      <v-col cols="12" class="align-center text-center">
        <v-scale-transition leave-absolute hide-on-leave>
          <v-progress-circular
            v-model="percentage"
            v-show="stopwatch.animation"
            :style="`
              width: ${mobile ? '40vw' : '30vw'};
              height: ${mobile ? '40vw' : '30vw'};
              min-width: 290px;
              min-height: 290px;
              margin-top: 50px;
            `"
            :width="10"
            :color="store.display.color.timer"
          >
          <div class="align-baseline">
            <span style="font-size: calc(4vw + 30px)">
              {{ stopwatch.time.format(store.display.format) }}
            </span>
            <span>
              {{ stopwatch.time.format("SSS").slice(0, 2) }}
            </span>
          </div>
          </v-progress-circular>
        </v-scale-transition>
        <v-fade-transition leave-absolute hide-on-leave>
          <div v-show="!stopwatch.animation">
            <span
              :class="`text-${store.display.color.timer}`"
              style="font-size: 15vw"
            >
              {{ stopwatch.time.format(store.display.format) }}
            </span>
            <span :class="`text-${store.display.color.timer}`">
              {{ stopwatch.time.format("SSS").slice(0, 2) }}
            </span>
          </div>
        </v-fade-transition>
      </v-col>
      <!-- Alert (bottom left) -->
      <v-slide-y-transition v-if="!mobile" leave-absolute>
        <v-alert
          v-show="stopwatch.hint"
          type="info"
          density="compact"
          color="primary"
          variant="tonal"
          closable
          transition="slide-y-transition"
          class="text-body-2"
          style="position: absolute; bottom: 70px; left: 20px;"
          min-width="400px"
        >
          Use <b>Spacebar</b> to quickly start and pause the timer
        </v-alert>
      </v-slide-y-transition>
      <!-- Kofi link -->
      <v-btn v-if="!mobile" class='mt-4' variant="plain" style="position: absolute; bottom: 70px; right: 0;">
        <a href='https://ko-fi.com/A0A5RO5DC' target='_blank'>
          <img
            height='36'
            style='border:0px;height:36px;'
            src='https://storage.ko-fi.com/cdn/kofi5.png?v=3'
            border='0'
            alt='Buy Me a Coffee at ko-fi.com'
          />
        </a>
      </v-btn>
      <!-- Splits -->
      <v-dialog
        v-if="stopwatch.splits.length > 0"
        v-model="showSplits"
        width="500"
      >
        <template v-slot:activator="{ props }">
          <v-btn
            v-bind:="props"
            style="
              position: fixed;
              bottom: 110px;
              left: 50%;
              translate: -50%;
              z-index: 999;
            "
            class="text-button"
            size="small"
            prepend-icon="mdi-magnify"
            color="primary"
            variant="elevated"
          >
            View Splits/Laps
          </v-btn>
        </template>
        <v-card style="overflow: hidden !important;">
          <v-card-title class="d-flex primary">
            <span class="text-h5 text-primary mt-2">Splits/Laps</span>
            <v-spacer></v-spacer>
            <v-btn variant="text" @click="showSplits = false" icon="mdi-close" />
          </v-card-title>
          <v-divider />
          <v-card-text style="overflow-y: scroll;">
            <v-table density="compact" hover>
              <thead>
                <tr>
                  <th class="text-left">
                    Split/Lap No.
                  </th>
                  <th class="text-left">
                    Time
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(split, index) in stopwatch.splits"
                  :key="`split-${index}`"
                >
                  <td>{{ index + 1 }}</td>
                  <td>{{ split.format(`${store.display.format}:SSS`) }}</td>
                </tr>
              </tbody>
            </v-table>
          </v-card-text>
        </v-card>
      </v-dialog>
      <div
        style="
          position: absolute;
          bottom: 70px;
          left: 50%;
          transform: translateX(-50%);
        "
      >
        <v-sheet class="mx-auto" max-width="90vw" color="transparent">
          <v-slide-group show-arrows>
            <v-slide-group-item
              v-for="(split, index) in stopwatch.splits"
              :key="index"
              v-slot="{ isSelected, toggle }"
            >
              <v-chip
                :class="['pa-2 ma-1 text-overline']"
                variant="tonal"
                density="compact"
                label
                style="min-width: 140px"
                :color="store.display.color.timer"
                :style="`min-width: ${store.display.format == 'HH:mm:ss' ? '140px' : '100px'}`"
              >
                <span class="font-weight-bold">{{ index + 1 }}</span> :
                {{ split.format(`${store.display.format}:SSS`) }}
              </v-chip>
            </v-slide-group-item>
          </v-slide-group>
        </v-sheet>
      </div>
    </v-row>
    <!-- Controls -->
    <v-bottom-navigation>
      <v-btn v-blur :disabled="!stopwatch.running" @click="split()" :active="false">
        <v-icon size="x-large" icon="mdi-timer-stop" color="primary" />
      </v-btn>
      <v-btn v-blur :disabled="stopwatch.running" @click="start()" :active="false">
        <v-icon size="x-large" icon="mdi-play" color="primary" />
      </v-btn>
      <v-btn v-blur :disabled="!stopwatch.running" @click="pause()" :active="false">
        <v-icon size="x-large" icon="mdi-pause" color="primary" />
      </v-btn>
      <v-btn v-blur @click="reset()" :active="false">
        <v-icon size="x-large" icon="mdi-replay" color="primary" />
      </v-btn>
    </v-bottom-navigation>
  </v-container>
</template>

<script lang="ts" setup>
import { computed, reactive, onMounted, ref } from "vue";
import { onBeforeRouteLeave } from "vue-router";
import { useDisplay } from "vuetify";
import { useAppStore } from "@/store/app";

import { useSeoMeta } from "@unhead/vue";
import { Howl } from "howler";
import dayjs, { Dayjs } from "dayjs";

import particles from "@/components/BackgroundParticles.vue"
import Datetime from "@/components/Datetime.vue";

useSeoMeta({
  title: "Exercise Timers | Stopwatch",
  description:
    "Stopwatch timer to record your workout duration and manage splits/laps.",
});

const { mobile } = useDisplay();

const store = useAppStore();

const datetime = dayjs();

const showSplits = ref(false);

export interface StopwatchModel {
  time: Dayjs;
  timeStarted: Date | null;
  timePaused: Date | null;
  pausedDuration: number;
  progress: number;
  animation: boolean;
  running: boolean;
  interval: NodeJS.Timeout | null;
  hint: boolean;
  splits: Dayjs[];
}

const stopwatch: StopwatchModel = reactive({
  time: datetime.hour(0).minute(0).second(0).millisecond(0),
  timeStarted: null,
  timePaused: null,
  pausedDuration: 0,
  progress: 0,
  animation: false,
  running: false,
  interval: null,
  hint: false,
  splits: [],
});

// Calculate each second as a percentage
const percentage = computed({
  get() {
    return Math.round((stopwatch.progress / 60) * 100);
  },
  set(newValue: number) {
    stopwatch.progress = newValue;
  },
});

// Audio sound effects
const audio = computed({
  get() { 
    return {
      oneMinuteWarning: (
        store.audio.stopwatch.oneMinute != "None"
        ? new Howl({
            src: [
              new URL(
                "../assets/sounds/" + store.audio.stopwatch.oneMinute + ".mp3",
                import.meta.url
              ).href,
            ],
          })
        : null
      ),
      start: (
        store.audio.global.start != "None"
        ? new Howl({
            src: [
              new URL(
                "../assets/sounds/" + store.audio.global.start + ".mp3",
                import.meta.url
              ).href,
            ],
          })
        : null
      ),
      pause: (
        store.audio.global.pause != "None"
        ? new Howl({
            src: [
              new URL(
                "../assets/sounds/" + store.audio.global.pause + ".mp3",
                import.meta.url
              ).href,
            ],
          })
        : null
      )
    }
  },
  set() {}
})

// Running
const running = () => {
  if (stopwatch.timeStarted) {
    // Update time
    const currentTime = Date.now()
    , timeElapsed = new Date(currentTime - stopwatch.timeStarted.getTime() - stopwatch.pausedDuration)
    , hour = timeElapsed.getUTCHours()
    , min = timeElapsed.getUTCMinutes()
    , sec = timeElapsed.getUTCSeconds()
    , ms = timeElapsed.getUTCMilliseconds()
    stopwatch.time = stopwatch.time.hour(hour).minute(min).second(sec).millisecond(ms)

    // Update progress every second
    stopwatch.progress = Math.floor(timeElapsed.getTime() / 1000) % 60

    // Minute warning
    if (
      Math.floor(timeElapsed.getTime() / 1000) % 60 === 0 &&
      Math.floor(ms / 10) === 0
    ) {
      audio.value.oneMinuteWarning?.play()
      stopwatch.progress = 0;
    }
  }
}

// Start
const start = () => {
  audio.value.start?.play();

  if (stopwatch.running === false) {
    if (stopwatch.timeStarted === null) {
      stopwatch.timeStarted = new Date();
    }
    if (stopwatch.timePaused !== null) {
      stopwatch.pausedDuration += (Date.now() - stopwatch.timePaused.getTime());
    }
    stopwatch.interval = setInterval(running, 10);
    stopwatch.running = true;
  }
};

// Pause
const pause = () => {
  audio.value.pause?.play();
  stopwatch.running = false;
  stopwatch.timePaused = new Date();
  if (stopwatch.interval) clearInterval(stopwatch.interval);
};

// Reset
const reset = () => {
  if (stopwatch.interval) clearInterval(stopwatch.interval);
  stopwatch.pausedDuration = 0;
  stopwatch.timeStarted = null;
  stopwatch.timePaused = null;
  stopwatch.time = dayjs().hour(0).minute(0).second(0).millisecond(0);
  stopwatch.progress = 0;
  stopwatch.splits = [];
  stopwatch.running = false;
  audio.value.oneMinuteWarning?.stop();
  audio.value.start?.stop();
};

// Split
const split = () => {
  stopwatch.splits.push(stopwatch.time);
};

// Save stopwatch time before changing route
onBeforeRouteLeave((to, from, next) => {
  audio.value.oneMinuteWarning?.stop();
  audio.value.start?.stop();
  document.removeEventListener("keydown", () => {}, true)
  reset();
  next();
});

// On component mount
onMounted(() => {
  // Add spacebar key press event
  document.addEventListener("keydown", (event) => {
    if (event.code === "Space") {
      !stopwatch.running ? start() : pause();
    }
  });
  // Hide hint
  stopwatch.hint = true;
  setTimeout(() => {
    stopwatch.hint = false;
  }, 10000);
});
</script>
