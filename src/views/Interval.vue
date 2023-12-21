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
    <!-- Set Interval -->
    <v-dialog
      v-model="dialog"
      width="500"
    >
      <template v-slot:activator="{ props }">
        <v-btn
          v-blur
          v-bind:="props"
          style="position: fixed; top: 65px; left: 20px"
          @click="pause(time.completed, true)"
          prepend-icon="mdi-timelapse"
          variant="tonal"
          class="text-button"
        >
          Set Intervals
        </v-btn>
      </template>
      <v-card style="overflow: hidden;">
        <v-card-title class="d-flex primary">
          <span class="text-h5 text-primary mt-2">Set Intervals</span>
          <v-spacer></v-spacer>
          <v-btn v-blur variant="text" @click="dialog = false" icon="mdi-close" />
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-5" style="overflow-y: scroll;">
          <v-row>
            <v-col cols="12" md="6">
              <span class="text-subtitle-1">Number of Intervals</span>
              <v-radio-group
                v-model="time.numIntervalsType"
                @update:model-value="reset()"
                inline
                hide-details
                class="mb-2"
              >
                <v-radio label="Infinite" value="infinite"></v-radio>
                <v-radio label="Custom" value="custom"></v-radio>
              </v-radio-group>
            </v-col>
            <v-col cols="12" md="6">
              <div v-show="time.numIntervalsType === 'custom'">
                <v-text-field
                  v-model="time.numIntervals"
                  min="1"
                  max="20"
                  hide-details
                  single-line
                  type="number"
                ></v-text-field>
                <v-slider
                  v-model="time.numIntervals"
                  min="1"
                  max="20"
                  step="1"
                  class="mt-3"
                  hide-details
                  color="primary"
                ></v-slider>
              </div>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-tabs v-model="time.durationTab" bg-color="background" grow>
                <v-tab value="working" prepend-icon="mdi-weight-lifter">Working</v-tab>
                <v-tab value="resting" prepend-icon="mdi-sleep">Resting</v-tab>
              </v-tabs>
            </v-col>
          </v-row>
          <v-row v-if="time.durationTab === 'working'">
            <v-col cols="12">
              <span class="text-subtitle-1">Working Duration</span>
            </v-col>
            <v-col cols="12" md="6">
              <span class="text-subtitle-2">Minutes</span>
              <v-text-field
                v-model="time.intervalMinutes"
                @update:model-value="getIntervalSeconds(time.intervalMinutes, time.intervalSeconds)"
                hide-details
                single-line
                type="number"
              ></v-text-field>
              <v-slider
                v-model="time.intervalMinutes"
                @update:model-value="getIntervalSeconds(time.intervalMinutes, time.intervalSeconds)"
                min="0"
                max="59"
                step="1"
                class="mt-3"
                color="primary"
              ></v-slider>
            </v-col>
            <v-col cols="12" md="6">
              <span class="text-subtitle-2">Seconds</span>
              <v-text-field
                v-model="time.intervalSeconds"
                @update:model-value="getIntervalSeconds(time.intervalMinutes, time.intervalSeconds)"
                hide-details
                single-line
                type="number"
              ></v-text-field>
              <v-slider
                v-model="time.intervalSeconds"
                @update:model-value="getIntervalSeconds(time.intervalMinutes, time.intervalSeconds)"
                min="0"
                max="59"
                step="1"
                class="mt-3"
                color="primary"
              ></v-slider>
            </v-col>
          </v-row>
          <v-row v-if="time.durationTab === 'resting'">
            <v-col cols="12">
              <span class="text-subtitle-1">Resting Duration</span>
            </v-col>
            <v-col cols="12" md="6">
              <span class="text-subtitle-2">Minutes</span>
              <v-text-field
                v-model="time.restMinutes"
                @update:model-value="getRestSeconds(time.restMinutes, time.restSeconds)"
                hide-details
                single-line
                type="number"
              ></v-text-field>
              <v-slider
                v-model="time.restMinutes"
                @update:model-value="getRestSeconds(time.restMinutes, time.restSeconds)"
                min="0"
                max="59"
                step="1"
                class="mt-3"
                color="primary"
              ></v-slider>
            </v-col>
            <v-col cols="12" md="6">
              <span class="text-subtitle-2">Seconds</span>
              <v-text-field
                v-model="time.restSeconds"
                @update:model-value="getRestSeconds(time.restMinutes, time.restSeconds)"
                hide-details
                single-line
                type="number"
              ></v-text-field>
              <v-slider
                v-model="time.restSeconds"
                @update:model-value="getRestSeconds(time.restMinutes, time.restSeconds)"
                min="0"
                max="59"
                step="1"
                class="mt-3"
                color="primary"
              ></v-slider>
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="primary">
          <div class="text-subtitle-1 ml-2">
            {{
              time.numIntervalsType === "infinite"
                ? "Infinite"
                : time.numIntervals
            }}
            intervals {{
              time.numIntervalsType === "custom"
                ? " | " + dayjs().hour(0).minute(0).second(0).add((time.totalIntervalSeconds * time.numIntervals) + (time.totalRestSeconds * (time.numIntervals - 1)), "second").format(store.display.format)
                : ''
            }}
          </div>
          <v-spacer />
          <v-btn
            v-blur
            text="save"
            @click="
              () => {
                dialog = false;
                getIntervalSeconds(time.intervalMinutes, time.intervalSeconds);
                getRestSeconds(time.restMinutes, time.restSeconds);
              }
            "
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
  <v-container
    fluid
    class="fill-height" 
    :style="`
      font-size: ${store.display.font.size}px !important;
      font-family: ${store.display.font.type} !important;
      font-weight: ${store.display.font.weight} !important;
    `">
    <!-- Background Animation -->
    <particles
      id="interval-particles"
      :variant="store.display.animation"
      :key="store.display.animation"
    />
    <particles
      v-if="percentage === 100 && time.numIntervalsType === 'custom' && time.currentIntervalNum === time.numIntervals"
      id="interval-particles-completed"
      variant="confetti"
    />
    <!-- Timer -->
    <v-row class="text-center">
      <v-col cols="12">
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
            :color="time.completed || time.resting ? time.progress.color : store.display.color.timer"
          >
            <div style="position: absolute; top: 1.5rem;">
              <div class="text-overline text-primary">Interval</div>
              <span class="font-weight-bold">{{ time.currentIntervalNum
                }}<span v-if="time.numIntervalsType == 'custom'">
                  / {{ time.numIntervals }}</span
                ></span
              >
            </div>
            <div>
              <div class="text-overline text-primary">Time Remaining</div>
              <span style="font-size: calc(4vw + 30px)" class="py-3">{{ interval.format(store.display.format) }}</span>
              <span> {{ interval.format("SSS").slice(0, 2) }}</span>
              <div class="text-h6 text-uppercase text-primary">
                {{ time.progress.status }}
              </div>
            </div>
            <div style="position: absolute; bottom: 1.5rem">
              <div class="text-overline text-primary">Total Time Elapsed</div>
              <span class="font-weight-bold">{{ time.elapsed.format(store.display.format) }}</span><br/>
            </div>
          </v-progress-circular>
        </v-scale-transition>
        <v-fade-transition leave-absolute hide-on-leave>
          <div v-show="!time.animation" style="margin-top: 100px;">
            <v-progress-linear
              v-model="percentage"
              height="100"
              class="mb-5 border"
              :color="time.completed || time.resting ? time.progress.color : store.display.color.timer"
            >
            <div class="text-uppercase bg-background pa-2">
              <span class="text-h5 text-uppercase">{{ time.progress.status }}</span><br/>
              <span class="font-weight-bold">{{ percentage }}%</span>
            </div>
            </v-progress-linear>
            <v-slider
              v-model="time.currentIntervalNum"
              v-show="time.numIntervalsType === 'custom'"
              :color="time.progress.color"
              :ticks="intervalLabels"
              :max="time.numIntervals"
              step="1"
              show-ticks="always"
              tick-size="5"
              readonly
            ></v-slider>
            <v-row>
              <v-col cols="12" md="4">
                <v-sheet class="pa-5" :border="true">
                  <div class="text-overline mb-3">Time Remaining</div>
                  <span style="font-size: 5vw;">{{ interval.format(store.display.format) }}</span>
                  <span v-if="!mobile"> {{ interval.format("SSS").slice(0, 2) }}</span>
                </v-sheet>
              </v-col>
              <v-col cols="12" md="4">
                <v-sheet class="pa-5" :border="true">
                  <div class="text-overline mb-3">Interval</div>
                  <span style="font-size: 5vw;">
                    {{ time.currentIntervalNum}}
                    <span v-if="time.numIntervalsType == 'custom'"> / {{ time.numIntervals }}</span>
                  </span>
                </v-sheet>
              </v-col>
              <v-col cols="12" md="4">
                <v-sheet class="pa-5" :border="true">
                  <div class="text-overline mb-3">Total Time Elapsed</div>
                  <span style="font-size: 5vw;">{{ time.elapsed.format(store.display.format) }}</span>
                  <span v-if="!mobile"> {{ time.elapsed.format("SSS").slice(0, 2) }}</span>
                </v-sheet>
              </v-col>
            </v-row>
          </div>
        </v-fade-transition>
      </v-col>
      <v-slide-y-transition v-if="!mobile" leave-absolute>
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
        :disabled="
          time.running
        "
        @:click="
          () => {
            totalSeconds <= 0 ? (dialog = true) : start();
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
import { Howl } from "howler";
import dayjs, { Dayjs } from "dayjs";
import { computed, getCurrentInstance, onMounted, reactive, ref } from "vue";
import { useAppStore } from "@/store/app";
import { onBeforeRouteLeave } from "vue-router";
import { useDisplay } from "vuetify";
import { useSeoMeta } from '@unhead/vue'
import particles from "@/components/BackgroundParticles.vue"
import Datetime from "@/components/Datetime.vue";

useSeoMeta({
  title: 'Exercise Timers | Interval',
  description: 'Interval timer with work and rest periods.',
})

const { mobile } = useDisplay();

const store = useAppStore();

const datetime = dayjs();

const dialog = ref(false);

export interface IntervalModel {
  timeStarted: Date | null;
  intervalTimeStarted: Date | null;
  timePaused: Date | null;
  intervalPausedDuration: number;
  pausedDuration: number;
  intervalHours: number
  intervalMinutes: number
  intervalSeconds: number
  intervalMilliseconds: number
  totalIntervalSeconds: number
  totalRestSeconds: number
  currentIntervalNum: number
  numIntervalsType: "infinite" | "custom"
  numIntervals: number
  interval: Dayjs
  elapsed: Dayjs
  rest: Dayjs
  restMinutes: number
  restSeconds: number
  resting: boolean
  completed: boolean
  progress: {
    color: string
    counter: number
    status: "paused" | "working" | "resting" | "completed"
  },
  animation: boolean
  running: boolean
  setInterval: NodeJS.Timeout | null
  valid: boolean
  hint: boolean
  durationTab: "working" | "resting"
}

const time: IntervalModel = reactive({
  timeStarted: null,
  intervalTimeStarted: null,
  timePaused: null,
  intervalPausedDuration: 0,
  pausedDuration: 0,
  intervalHours: 0,
  intervalMinutes: 0,
  intervalSeconds: 0,
  intervalMilliseconds: 0,
  totalIntervalSeconds: 0,
  totalRestSeconds: 0,
  currentIntervalNum: 1,
  numIntervalsType: "infinite" as "infinite" | "custom",
  numIntervals: 1,
  interval: datetime.hour(0).minute(0).second(0).millisecond(0),
  elapsed: datetime.hour(0).minute(0).second(0).millisecond(0),
  rest: datetime.hour(0).minute(0).second(0).millisecond(0),
  restMinutes: 0,
  restSeconds: 0,
  resting: false,
  completed: false,
  progress: {
    color: "primary",
    counter: 0,
    status: "paused"
  },
  animation: false,
  running: false,
  setInterval: null,
  valid: true,
  hint: false,
  durationTab: "working"
});

const totalSeconds = computed({
  get() {
    if (time.resting) {
      return time.totalRestSeconds
    } else {
      return time.totalIntervalSeconds;
    }
  },
  set() {},
});

const interval = computed({
  get() {
    return time.interval
      .hour(time.intervalHours)
      .minute(time.intervalMinutes)
      .second(time.intervalSeconds)
      .millisecond(time.intervalMilliseconds)
  },
  set(newValue) {
    time.intervalHours = newValue.hour();
    time.intervalMinutes = newValue.minute();
    time.intervalSeconds = newValue.second();
    time.intervalMilliseconds = newValue.millisecond();
  },
});

const percentage = computed({
  get() {
    if (totalSeconds.value != 0) {
      return Math.round((time.progress.counter / totalSeconds.value) * 100);
    }
    return 0;
  },
  set(newValue: number) {
    time.progress.counter = newValue;
  },
});

const intervalLabels = computed({
  get() {
    var labels = [];
    if (time.numIntervals > 9) {
      for (var i = 0; i <= time.numIntervals; i++) {
        labels.push(i);
        labels.push("");
        i++;
      }
    } else {
      for (var i = 0; i <= time.numIntervals; i++) {
        labels.push(i);
      }
    }
    labels[0] = "";
    return labels as string[];
  },
  set() {},
});

const audio = computed({
  get() {
    return {
      fiveSecondWarning: (
        store.audio.interval.fiveSeconds != "None"
        ? new Howl({
          src: [
            new URL(
              "../assets/sounds/" + store.audio.interval.fiveSeconds + ".mp3",
              import.meta.url
            ).href,
          ]
        })
        : null
      ),
      completed: (
        store.audio.interval.completed != "None"
          ? new Howl({
            src: [
              new URL(
                "../assets/sounds/" + store.audio.interval.completed + ".mp3",
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

const getIntervalSeconds = (minutes: number, seconds: number) => {
  time.totalIntervalSeconds = (minutes * 60) + seconds;
};

const getRestSeconds = (minutes: number, seconds: number) => {
  time.totalRestSeconds = (minutes * 60) + seconds;
};

// Running
const running = () => {
  if (time.intervalTimeStarted && time.timeStarted) {

    // Update time
    const currentTime = Date.now()
    const elapsed = new Date(currentTime - (time.timeStarted.getTime()) - time.pausedDuration)
    const remaining = new Date((totalSeconds.value * 1000) + time.intervalTimeStarted.getTime() - currentTime + time.intervalPausedDuration)

    const timeElapsed = {
      elapsed,
      hour: elapsed.getUTCHours(),
      min: elapsed.getUTCMinutes(),
      sec: elapsed.getUTCSeconds(),
      ms: elapsed.getUTCMilliseconds()
    }

    const timeRemaining = {
      remaining,
      hour: remaining.getUTCHours(),
      min: remaining.getUTCMinutes(),
      sec: remaining.getUTCSeconds(),
      ms: remaining.getUTCMilliseconds()
    }

    // Update progress
    time.progress.counter = totalSeconds.value - Math.floor(remaining.getTime() / 1000) % 60

    // Update time elapsed and interval
    time.elapsed = dayjs().hour(timeElapsed.hour).minute(timeElapsed.min).second(timeElapsed.sec).millisecond(timeElapsed.ms)
    interval.value = dayjs().hour(timeRemaining.hour).minute(timeRemaining.min).second(timeRemaining.sec).millisecond(timeRemaining.ms)

    // If it is not currently in rest mode
    if (time.resting === false) {
      time.progress.status = "working"

      // 5 seconds remaining sound
      if (
        interval.value.hour() === 0 &&
        interval.value.minute() === 0 &&
        interval.value.second() === 4
      ) {
        if (!audio.value.fiveSecondWarning?.playing()) {
          audio.value.fiveSecondWarning?.play();
        }
      }
    }

    // If all interval cycles are completed
    if (
      percentage.value === 100
    ) {
      // If custom: pause and clear time remaining
      if (time.numIntervalsType === "custom" && time.currentIntervalNum === time.numIntervals) {
        if (!audio.value.completed?.playing()) {
          audio.value.completed?.play();
        }
        pause(true, true);
        time.progress.color = "green";
        time.completed = true;
        interval.value = interval.value
          .hour(0)
          .minute(0)
          .second(0)
          .millisecond(0);
        time.elapsed = dayjs()
          .hour(0)
          .minute(0)
          .second(0)
          .millisecond(0)
          .add((time.totalIntervalSeconds * time.numIntervals) + (time.totalRestSeconds * (time.numIntervals - 1)), "second");
        audio.value.fiveSecondWarning?.stop();
        return;
      }
    }

    // If interval is completed then update values
    if (
      interval.value.hour() === 0 &&
      interval.value.minute() === 0 &&
      interval.value.second() === 0 &&
      Math.floor(timeRemaining.ms / 10) <= 1
    ) {
      percentage.value = 0;
      time.intervalPausedDuration = 0;

      // If no rest time is defined
      if (time.totalRestSeconds === 0) {
        if (
          time.numIntervalsType === "infinite" ||
          time.currentIntervalNum < time.numIntervals
        ) {
          time.currentIntervalNum += 1;
        }
        // If infinite intervals
        if (time.numIntervalsType === "infinite") {
          time.intervalPausedDuration = 0;
        }
        audio.value.completed?.play();
      }

      // When resting ends increment interval number
      if (time.resting === true) {
        // If there are intervals remaining or type is infinite
        if (
          time.currentIntervalNum != time.numIntervals ||
          time.numIntervalsType === "infinite"
        ) {
          time.currentIntervalNum += 1;
        }
      }

      // If rest values are selected start rest
      if (
        time.resting === false &&
        time.totalRestSeconds > 0 &&
        (time.currentIntervalNum < time.numIntervals ||
          time.numIntervalsType === "infinite")
      ) {
        audio.value.completed?.play();
        rest();
      }
      // Else reset interval to initial value
      else {
        time.intervalTimeStarted = new Date();
        interval.value = dayjs().hour(0).minute(0).second(0).add(time.totalIntervalSeconds, "second");
        time.progress.color = "primary";
        time.resting = false;
      }
    }
  }
}

// Start
const start = () => {
  if (time.progress.counter < 100) {
    audio.value.start?.play()

    if (time.running === false) {
      if (time.timeStarted === null) {
        time.timeStarted = new Date();
      }
      if (time.intervalTimeStarted === null) {
        time.intervalTimeStarted = new Date();
      }
      if (time.timePaused !== null) {
        time.pausedDuration += (Date.now() - time.timePaused.getTime());
        time.intervalPausedDuration += (Date.now() - time.timePaused.getTime());
      }
      time.setInterval = setInterval(running, 10);
      time.running = true;
    }
  }
}

// Rest
const rest = () => {
  time.progress.color = "red";
  time.progress.status = "resting";
  time.resting = true;
  time.intervalTimeStarted = new Date();
  interval.value = dayjs().hour(0).minute(0).second(0).millisecond(0).add(time.totalRestSeconds, 'second')
  audio.value.fiveSecondWarning?.stop();
};

// Pause
const pause = (completed?:boolean, muted?:boolean) => {
  if (!muted) audio.value.pause?.play()
  time.running = false;
  if (!dialog.value) {
    time.timePaused = new Date();
  } else {
    time.timeStarted = null;
    time.intervalTimeStarted = null;
    time.timePaused = null;
    time.pausedDuration = 0;
    time.intervalPausedDuration = 0;
  }
  if (time.setInterval) clearInterval(time.setInterval);
  time.progress.status = completed ? "completed" : "paused";
  audio.value.fiveSecondWarning?.stop();
};

// Reset
const reset = () => {
  if (time.setInterval) clearInterval(time.setInterval);
  time.pausedDuration = 0;
  time.intervalPausedDuration = 0;
  time.timeStarted = null;
  time.intervalTimeStarted = null;
  time.timePaused = null;
  time.running = false;
  interval.value = interval.value
    .hour(0)
    .minute(0)
    .second(0)
    .millisecond(0)
    .add(time.totalIntervalSeconds, "second");
  time.currentIntervalNum = 1;
  time.elapsed = dayjs().hour(0).minute(0).second(0).millisecond(0);
  time.resting = false;
  time.progress.color = "primary";
  time.progress.counter = 0;
  audio.value.fiveSecondWarning?.stop();
  audio.value.completed?.stop();
}

// Clear
const clear = () => {
  time.intervalMinutes = 0;
  time.intervalSeconds = 0;
  time.restMinutes = 0;
  time.restSeconds = 0;
  time.currentIntervalNum = 1;
  time.totalIntervalSeconds = 0;
  time.numIntervalsType = "infinite";
  time.numIntervals = 1
  // Force properties to update
  const instance = getCurrentInstance();
  instance?.proxy?.$forceUpdate();
};

// Save interval data before changing router
onBeforeRouteLeave((to, from, next) => {
  audio.value.fiveSecondWarning?.stop();
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
      totalSeconds.value <= 0
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
