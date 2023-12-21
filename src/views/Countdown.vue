<template>
  <v-toolbar absolute app height="120" class="pa-5" color="transparent" style="z-index: 999;">
    <!-- Toggle Time View -->
    <v-switch
      v-model="time.animation"
      prepend-icon="mdi-adjust"
      style="position: fixed; top: 40px; right: 10px"
      class="pa-3"
      color="primary"
    />
    <!-- Current Date/Time -->
    <template v-if="!mobile">
      <v-spacer/>
      <datetime/>
      <v-spacer/>
    </template>
    <!-- Set Countdown -->
    <v-dialog
      v-model="dialog"
      width="500"
      @update:model-value="
        getTotalSeconds();
      "
    >
      <template v-slot:activator="{ props }">
        <v-btn
          v-blur
          v-bind:="props"
          style="position: fixed; top: 65px; left: 20px"
          @click="pause(true)"
          prepend-icon="mdi-alarm"
          variant="tonal"
          class="text-button"
        >
          Set Countdown
        </v-btn>
      </template>
      <v-card style="overflow: hidden !important;">
        <v-card-title class="d-flex primary">
          <span class="text-h5 text-primary mt-2">Set Countdown</span>
          <v-spacer></v-spacer>
          <v-btn v-blur variant="text" @click="dialog = false" icon="mdi-close" />
        </v-card-title>
        <v-divider />
        <v-card-text class="pb-0" style="overflow-y: scroll;">
          <v-row>
            <v-col cols="12" md="4">
              <span class="text-subtitle-1">Hours</span>
              <v-text-field
                v-model="time.setHours"
                class="mt-0"
                hide-details
                single-line
                type="number"
              ></v-text-field>
              <v-slider
                v-model="time.setHours"
                min="0"
                max="23"
                step="1"
                color="primary"
                thumb-label
              ></v-slider>
            </v-col>
            <v-col cols="12" md="4">
              <span class="text-subtitle-1">Minutes</span>
              <v-text-field
                v-model="time.setMinutes"
                class="mt-0"
                hide-details
                single-line
                type="number"
              ></v-text-field>
              <v-slider
                v-model="time.setMinutes"
                min="0"
                max="59"
                step="1"
                color="primary"
                thumb-label
              ></v-slider>
            </v-col>
            <v-col cols="12" md="4">
              <span class="text-subtitle-1">Seconds</span>
              <v-text-field
                v-model="time.setSeconds"
                class="mt-0"
                hide-details
                single-line
                type="number"
              ></v-text-field>
              <v-slider
                v-model="time.setSeconds"
                min="0"
                max="59"
                step="1"
                color="primary"
                thumb-label
              ></v-slider>
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="primary">
          <div class="text-subtitle-1 ml-2">
            <v-icon v-if="!mobile" icon="mdi-alarm" class="mr-2" />{{
              countdown.format(store.display.format)
            }}
          </div>
          <v-spacer />
          <v-btn
            v-blur
            @click="
              dialog = false;
              getTotalSeconds();
            "
            :size="mobile ? 'small' : 'default'"
            text="save"
          >
            <template v-slot:prepend>
              <v-icon icon="mdi-content-save" color="green"/>
            </template>
          </v-btn>
          <v-btn
            v-blur
            @click="clear()"
            text="clear"
          >
            <template v-slot:prepend>
              <v-icon icon="mdi-delete" color="red"/>
            </template>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-toolbar>
  <v-container fluid class="fill-height" 
    :style="`
      font-size: ${store.display.font.size}px !important;
      font-family: ${store.display.font.type} !important;
      font-weight: ${store.display.font.weight} !important;
    `">
    <!-- Background Animation -->
    <particles
      id="countdown-particles"
      :variant="store.display.animation"
      :key="store.display.animation"
    />
    <particles
      v-if="percentage === 100"
      id="countdown-particles-completed"
      variant="confetti"
    />
    <!-- Timer -->
    <v-row>
      <v-col cols="12" class="align-center text-center">
        <v-scale-transition leave-absolute hide-on-leave>
          <v-progress-circular
            v-model="percentage"
            v-show="time.animation"
            :style="`
              width: ${mobile ? '40vw' : '30vw'};
              height: ${mobile ? '40vw' : '30vw'};
              min-width: 290px;
              min-height: 290px;
              margin-top: 50px;
            `"
            :width="10"
            :color="percentage === 100 ? 'green' : store.display.color.timer"
          >
            <div class="align-baseline">
              <span style="font-size: calc(4vw + 30px)">
                {{ countdown.format(store.display.format) }}</span
              >
              <span>
                {{ countdown.format("SSS").slice(0, 2) }}
              </span>
            </div>
            <span class="font-weight-bold" style="position: absolute; bottom: 3rem"
              >{{ percentage }} %</span
            >
          </v-progress-circular>
        </v-scale-transition>
        <v-fade-transition leave-absolute hide-on-leave>
          <div v-show="!time.animation">
            <span
              v-show="!time.animation"
              :class="percentage === 100 ? 'text-green' : `text-${store.display.color.timer}`"
              style="font-size: 15vw"
            >
              {{ countdown.format(store.display.format) }}
            </span>
            <span :class="percentage === 100 ? 'text-green' : `text-${store.display.color.timer}`">
              {{ countdown.format("SSS").slice(0, 2) }}
            </span>
            <v-progress-linear
              v-show="!mobile"
              v-model="percentage"
              :height="20"
              class="border"
              :color="percentage === 100 ? 'green' : store.display.color.timer"
            >
              <template v-slot:default="{ value }">
                <span class="font-weight-bold bg-background pa-1">
                  {{ Math.ceil(value) }}%
                </span>
              </template>
            </v-progress-linear>
          </div>
        </v-fade-transition>
      </v-col>
      <v-slide-y-transition v-if="!mobile"  leave-absolute>
        <v-alert
          v-show="time.hint"
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
    </v-row>
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
    <!-- Controls -->
    <v-bottom-navigation>
      <v-btn
        v-blur
        :disabled="time.running || time.progress >= 100"
        @click="
          () => {
            time.totalSeconds <= 0 ? (dialog = true) : start();
          }
        "
        :active="false"
      >
        <v-icon size="x-large" icon="mdi-play" color="primary" />
      </v-btn>
      <v-btn v-blur :disabled="!time.running" @click="pause()" :active="false">
        <v-icon size="x-large" icon="mdi-pause" color="primary" />
      </v-btn>
      <v-btn v-blur @click="reset()" :active="false">
        <v-icon size="x-large" icon="mdi-replay" color="primary" />
      </v-btn>
    </v-bottom-navigation>
  </v-container>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from "vue";
import { useAppStore } from "@/store/app";
import { onBeforeRouteLeave } from "vue-router";
import { useDisplay } from "vuetify";

import { useSeoMeta } from '@unhead/vue'
import { Howl } from "howler";
import dayjs, { Dayjs } from "dayjs";

import particles from "@/components/BackgroundParticles.vue"
import Datetime from "@/components/Datetime.vue";

useSeoMeta({
  title: 'Exercise Timers | Countdown',
  description: 'Countdown timer to help you set a time limit and stick to it.',
})

const { mobile } = useDisplay();

const store = useAppStore();

const datetime = dayjs();

const dialog = ref(false);

export interface CountdownModel {
  timeStarted: Date | null;
  timePaused: Date | null;
  pausedDuration: number;
  setHours: number
  setMinutes: number
  setSeconds: number
  setMilliseconds: number
  totalSeconds: number
  running: boolean;
  interval: NodeJS.Timeout | null;
  countdown: Dayjs
  progress: number
  animation: boolean
  hint: boolean
}

const time: CountdownModel = reactive({
  timeStarted: null,
  timePaused: null,
  pausedDuration: 0,
  setHours: 0,
  setMinutes: 0,
  setSeconds: 0,
  setMilliseconds: 0,
  totalSeconds: 0,
  running: false,
  interval: null,
  countdown: datetime,
  progress: 0,
  animation: false,
  hint: false
});

const countdown = computed({
  get() {
    return time.countdown
      .hour(time.setHours)
      .minute(time.setMinutes)
      .second(time.setSeconds)
      .millisecond(time.setMilliseconds);
  },
  set(newValue) {
    time.setHours = newValue.hour();
    time.setMinutes = newValue.minute();
    time.setSeconds = newValue.second();
    time.setMilliseconds = newValue.millisecond();
  },
});

// Calculate each second as a percentage
const percentage = computed({
  get() {
    if (time.totalSeconds != 0) {
      return Math.round(time.progress);
    }
    return 0;
  },
  set(newValue: number) {
    time.progress = newValue;
  },
});

// Audio sound effects
const audio = computed({
  get() {
    return {
      tenSecondWarning: (
        store.audio.countdown.tenSeconds != "None"
        ? new Howl({
          src: [
            new URL(
              "../assets/sounds/" + store.audio.countdown.tenSeconds + ".mp3",
              import.meta.url
            ).href,
          ]
        })
        : null
      ),
      completed: (
        store.audio.countdown.completed != "None"
        ? new Howl({
          src: [
            new URL(
              "../assets/sounds/" + store.audio.countdown.completed + ".mp3",
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

// Get total seconds
const getTotalSeconds = () => {
  time.totalSeconds = 0;
  time.progress = 0;
  var totalSeconds =
    time.setHours * 3600 + time.setMinutes * 60 + time.setSeconds;
  time.totalSeconds = totalSeconds;
  return totalSeconds
};

// Clear
const clear = () => {
  time.setHours = 0;
  time.setMinutes = 0;
  time.setSeconds = 0;
};

// Running
const running = () => {
  if (time.timeStarted) {
    // Update time
    const currentTime = Date.now()
    , timeElapsed = new Date((time.totalSeconds * 1000) + time.timeStarted.getTime() - currentTime + time.pausedDuration)
    , hour = timeElapsed.getUTCHours()
    , min = timeElapsed.getUTCMinutes()
    , sec = timeElapsed.getUTCSeconds()
    , ms = timeElapsed.getUTCMilliseconds()
    countdown.value = dayjs().hour(hour).minute(min).second(sec).millisecond(ms)

    // Update progress
    time.progress = 100 - ((((hour * 3600) + (min * 60) + sec) / time.totalSeconds) * 100)

    // 10 seconds remaining warning
    if (
      countdown.value.hour() === 0 &&
      countdown.value.minute() === 0 &&
      (Math.floor(timeElapsed.getTime() / 1000) % 60) === 9
    ) {
      if (!audio.value.tenSecondWarning?.playing()) {
        audio.value.tenSecondWarning?.play();
      }
    }

    // Completed
    if (
      countdown.value.hour() === 0 &&
      countdown.value.minute() === 0 &&
      countdown.value.second() === 0 &&
      Math.floor(ms / 10) <= 1
    ) {
      if (!audio.value.completed?.playing()) {
        audio.value.completed?.play();
      }
      pause(true);
      countdown.value = countdown.value.millisecond(0);
    }
  }
}

// Start
const start = () => {
  if (time.progress < 100) {
    audio.value.start?.play();

    if (time.running === false) {
      if (time.timeStarted === null) {
        time.timeStarted = new Date();
      }
      if (time.timePaused !== null) {
        time.pausedDuration += (Date.now() - time.timePaused.getTime());
      }
      time.interval = setInterval(running, 10);
      time.running = true;
    }
  }
};

// Pause
const pause = (muted?:boolean) => {
  if(!muted) audio.value.pause?.play();
  time.running = false;
  if (!dialog.value) {
    time.timePaused = new Date();
  } else {
    time.timeStarted = null;
    time.timePaused = null;
    time.pausedDuration = 0;
  }
  if (time.interval) clearInterval(time.interval);
  audio.value.tenSecondWarning?.stop();
};

// Reset
const reset = () => {
  if (time.interval) clearInterval(time.interval);
  time.pausedDuration = 0;
  time.timeStarted = null;
  time.timePaused = null;
  time.running = false;
  countdown.value = dayjs()
    .hour(0)
    .minute(0)
    .second(time.totalSeconds)
    .millisecond(0);
  time.progress = 0;
  audio.value.tenSecondWarning?.stop();
};

// Save countdown time before changing router
onBeforeRouteLeave((to, from, next) => {
  audio.value.tenSecondWarning?.stop();
  audio.value.completed?.stop();
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
      time.totalSeconds <= 0
        ? (dialog.value = true)
        : !time.running
        ? start()
        : pause();
    }
  });
  // Hide hint
  time.hint = true;
  setTimeout(() => {
    time.hint = false;
  }, 10000);
});
</script>
