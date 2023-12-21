<template>
  <v-container class="text-center fill-height" style="padding: 10vh 5% 5%; min-height: 100%;">
    <!-- Background Animation -->
    <particles
      id="stopwatch-particles"
      :variant="store.display.animation"
      :key="store.display.animation"
    />
    <v-row class="my-auto">
      <v-col cols="12">
        <h1 :class="`${mobile ? 'text-h2' : 'text-h1'}`">
          Exercise Timers
        </h1>
        <div class="text-body-1 py-5">
          Create and customize a timer that suites your exercise of choice such
          as stretching, weight lifting and high intensity interval training.
        </div>
      </v-col>
      <v-col v-for="timer in timers" :key="timer.title" cols="12" md="4">
        <v-hover>
          <template v-slot:default="{ isHovering, props }">
            <v-card
              v-bind:="props"
              class="pa-2 text-primary"
              elevation="1"
              :to="timer.link"
            >
              <v-card-item :to="timer.link">
                <div class="text-overline mb-1">
                  {{ timer.title }}
                  <v-icon :icon="timer.icon" />
                </div>
                <v-divider />
                <v-icon class="ma-5 mb-0" size="5rem" :icon="timer.icon" />
                <div :class="(mobile ? 'text-h4' : 'text-h3') + ' mt-3'">
                  {{ timer.title }}
                </div>
              </v-card-item>
              <v-card-actions>
                <v-btn variant="outlined" class="text-button" block :to="timer.link">
                  Start {{ timer.title }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </template>
        </v-hover>
      </v-col>
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
    <v-footer app absolute :border="true">
      <v-container class="pa-0">
      <v-row class="align-center">
        <v-col cols="12" sm="4" :class="`${mobile ? 'text-center' : 'text-right'}`" :style="`order: ${mobile ? 0 : 2}`">
          <span class="text-subtitle-2 mr-3">Follow:</span>
          <v-btn
            v-for="(social, index) in socials"
            :aria-label="social.link"
            :href="social.link"
            :key="index"
            :icon="social.icon"
            variant="text"
            density="compact"
            rounded="0"
            class="mr-3"
            color="secondary"
          />
        </v-col>
        <v-col cols="12" sm="4" :class="`${mobile ? ' text-center' : 'text-left'}`">
          <span class="text-subtitle-2 mx-3">Share:</span>
          <v-btn
            v-for="(share, index) in shares"
            :aria-label="share.link"
            :href="share.link"
            :key="index"
            :icon="share.icon"
            variant="text"
            density="compact"
            rounded="0"
            class="mr-3"
            color="secondary"
          />
        </v-col>
        <v-col cols="12" sm="4">
          <a
            aria-label="https://www.zacharykahl.com"
            href="https://www.zacharykahl.com"
            class="text-subtitle-2 text-primary"
            >&copy; {{ year }} Zachary Kahl</a
          >
          <br />
          <a
            aria-label="Sound effects provided by www.zapsplat.com"
            href="https://www.zapsplat.com"
            style="font-size: 10px"
            class="text-primary text-caption"
            >Sound effects obtained from zapsplat.com</a
          >
          <br/>
        </v-col>
      </v-row>
      </v-container>
    </v-footer>
  </v-container>
</template>

<script lang="ts" setup>
  import { useAppStore } from "@/store/app";
  import { ref } from "vue";
  import { useDisplay } from "vuetify";
  import { useSeoMeta } from '@unhead/vue'
  import { socials, shares } from '../models/Socials'
  import particles from "../components/BackgroundParticles.vue"


  useSeoMeta({
    title: 'Exercise Timers',
    description: 'Stopwatch, countdown and interval timers to use when exercising.',
  })

  const { mobile } = useDisplay();
  const store = useAppStore();
  const year = ref(new Date().getFullYear());
  const timers = [
    { title: "Stopwatch", link: "/stopwatch", icon: "mdi-timer" },
    { title: "Countdown", link: "/countdown", icon: "mdi-alarm" },
    { title: "Interval", link: "/Interval", icon: "mdi-timelapse" },
  ];
</script>

<style lang="scss" scoped>
  .v-card {
    .v-icon,
    div {
      transition: transform 0.3s ease-in-out, font-weight 0.1s ease-in-out;
    }
    &:hover {
      .v-icon {
        transform: rotate(20deg) scale(1.1);
      }
    }
  }
</style>
