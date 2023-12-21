<template>
  <v-row>
    <v-col cols="12">
      <div class="text-subtitle-2 pb-2">{{ title }}</div>
      <v-select
        v-model="data.currentValue"
        @update:model-value="updateState()"
        :items="items"
        :label="label"
        hide-details
      >
        <template v-slot:append>
          <v-btn variant="plain" icon="mdi-play" :disabled="data.currentValue === 'None'" @click="preview()" />
        </template>
      </v-select>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
import { Howl } from "howler";
import { useAppStore } from "@/store/app";
import { ref, WritableComputedRef, computed } from "vue";
import { storeToRefs } from "pinia";
import soundEffects from "@/models/Audio";

const store = useAppStore();
const { audio } = storeToRefs(store);

const props = defineProps({
  title: String,
  label: String,
  timer: String,
  audiotype: String,
});

// Assign the state props to the correct select elements
const stateValue: WritableComputedRef<string> = computed({
  get(): string {
    var option;

    // Global
    if (props.timer == "global") {
      if (props.audiotype == "start") {
        option = audio.value.global.start;
      }
      if (props.audiotype == "pause") {
        option = audio.value.global.pause;
      }
    }

    // Stopwatch
    if (props.timer == "stopwatch") {
      option = audio.value.stopwatch.oneMinute;
    }

    // Countdown
    if (props.timer == "countdown") {
      if (props.audiotype == "tenSeconds") {
        option = audio.value.countdown.tenSeconds;
      }
      if (props.audiotype == "completed") {
        option = audio.value.countdown.completed;
      }
    }

    // Interval
    if (props.timer == "interval") {
      if (props.audiotype == "fiveSeconds") {
        option = audio.value.interval.fiveSeconds;
      }
      if (props.audiotype == "completed") {
        option = audio.value.interval.completed;
      }
    }

    return option as string;
  },
  set(newValue: string) {},
});

const data = ref({
  currentValue: stateValue.value,
  sounds: soundEffects,
});

const items: WritableComputedRef<string[]> = computed({
  get: function () {
    var items = [""];
    // if (props.audiotype === "sound") {
    //   items = data.value.sounds;
    // }
    // else if (props.audiotype === "sound-looped") {
    //   items = data.value.soundsLooped;
    // }
    // else if (props.audiotype === "alarm") {
    //   items = data.value.alarms;
    // }

    // Global
    if (props.timer == "global") {
      if (props.audiotype == "start") {
        items = data.value.sounds.global.start;
      }
      if (props.audiotype == "pause") {
        items = data.value.sounds.global.pause;
      }
    }

    // Stopwatch
    if (props.timer == "stopwatch") {
      items = data.value.sounds.stopwatch.oneMinute;
    }

    // Countdown
    if (props.timer == "countdown") {
      if (props.audiotype == "tenSeconds") {
        items = data.value.sounds.countdown.tenSeconds;
      }
      if (props.audiotype == "completed") {
        items = data.value.sounds.countdown.completed;
      }
    }

    // Interval
    if (props.timer == "interval") {
      if (props.audiotype == "fiveSeconds") {
        items = data.value.sounds.intervals.fiveSeconds;
      }
      if (props.audiotype == "completed") {
        items = data.value.sounds.intervals.completed;
      }
    }
    

    return items;
  },
  set: function (newValue) {
    // props.audiotype = newValue;
  },
});

const updateState = () => {
  // Global
  if (props.timer == "global") {
    if (props.audiotype == "start") {
      audio.value.global.start = data.value.currentValue;
    }
    if (props.audiotype == "pause") {
      audio.value.global.pause = data.value.currentValue;
    }
  }

  // Stopwatch
  if (props.timer == "stopwatch") {
    audio.value.stopwatch.oneMinute = data.value.currentValue;
  }

  // Countdown
  if (props.timer == "countdown") {
    if (props.audiotype == "tenSeconds") {
      audio.value.countdown.tenSeconds = data.value.currentValue;
    }
    if (props.audiotype == "completed") {
      audio.value.countdown.completed = data.value.currentValue;
    }
  }

  // Intervals
  if (props.timer == "interval") {
    if (props.audiotype == "fiveSeconds") {
      audio.value.interval.fiveSeconds = data.value.currentValue;
    }
    if (props.audiotype == "completed") {
      audio.value.interval.completed = data.value.currentValue;
    }
  }
};

const preview = () => {
  var preview = new Howl({
    src: [new URL("../assets/sounds/" + data.value.currentValue + ".mp3", import.meta.url).href]
  });
  preview.play();
};
</script>
