<template>
  <!-- Mobile -->
  <v-app-bar v-if="mobile" flat :border="true" density="compact">
    <template v-slot:prepend>
      <v-app-bar-nav-icon @click="store.toggleMobileMenu"></v-app-bar-nav-icon>
      <v-app-bar-title class="text-subtitle-1 text-primary">{{
        router.currentRoute.value.name
      }}</v-app-bar-title>
    </template>
    <template v-slot:append>
      <v-btn @click="store.toggleSettingsMenu" icon="mdi-cog"></v-btn>
    </template>
  </v-app-bar>
  <!-- Desktop -->
  <v-app-bar v-else flat :border="true" density="compact">
    <template v-slot:prepend>
      <v-tabs
        color="primary"
        :hide-slider="router.currentRoute.value.path === '/'"
      >
        <v-btn
          v-blur
          rounded="0"
          flat
          rad
          color="transparent"
          class="text-secondary"
          icon="mdi-home"
          href="/"
        />
        <!-- <v-icon size="x-large"><v-img src="@/assets/logo.svg" /></v-icon> -->
        <h5 class="text-h5 text-primary mt-2 ml-2">
          {{ router.currentRoute.value.name }}
        </h5>
      </v-tabs>
    </template>
    <template v-slot:append>
      <v-tabs
        color="primary"
        :hide-slider="router.currentRoute.value.path === '/'"
      >
        <v-tab class="text-primary text-button" to="stopwatch">
          <v-icon class="mr-1 text-secondary" icon="mdi-timer" />Stopwatch
        </v-tab>
        <v-tab class="text-primary text-button" to="countdown">
          <v-icon class="mr-1 text-secondary" icon="mdi-alarm" />Countdown
        </v-tab>
        <v-tab class="text-primary text-button" to="interval">
          <v-icon class="mr-1 text-secondary" icon="mdi-timelapse" />Interval
        </v-tab>
        <v-btn
          v-blur
          rounded="0"
          flat
          rad
          color="transparent"
          class="text-secondary"
          icon="mdi-cog"
          @click="store.toggleSettingsMenu"
        />
      </v-tabs>
    </template>
  </v-app-bar>
</template>

<script lang="ts" setup>
import { useAppStore } from "@/store/app";
import router from "@/router";
import { useDisplay } from "vuetify";
const { mobile } = useDisplay();
const store = useAppStore();
</script>
