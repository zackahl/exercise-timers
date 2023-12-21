<template>
  <vue-particles v-if="variant != 'none'" :id="id" :particlesInit="particlesInit" :options="options" />
</template>

<script lang="ts" setup>
import type { Engine } from "@tsparticles/engine";
import { loadEmittersPlugin } from "@tsparticles/plugin-emitters";
import { loadSlim } from "tsparticles-slim";
import { PropType, computed } from "vue";
import Animations, { AnimationVariant } from "../models/Animation";

const props = defineProps({
  id: {
    type: String,
    required: true
  },
  variant: {
    type: String as PropType<AnimationVariant>,
    required: true
  }
});

async function particlesInit(engine: Engine) {
  await loadEmittersPlugin(engine);
  await loadSlim(engine);
}

const options = computed({
  get() {
    if (props.variant == "parallax") {
      return Animations.parallax
    }
    if (props.variant == "confetti") {
      return Animations.confetti
    }
    if (props.variant == "snow") {
      return Animations.snow
    }
    if (props.variant == "stars") {
      return Animations.stars
    }
    if (props.variant == "fireworks") {
      return Animations.fireworks
    }
  },
  set() {},
});
</script>