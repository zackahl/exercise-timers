<template>
  <v-navigation-drawer v-model="store.mobileMenu" temporary>
    <v-list nav>
      <v-list-item
        prepend-icon="mdi-home"
        title="Exercise Timers"
        value="home"
        to="/"
        replace
        exact
      ></v-list-item>
      <v-list-item
        prepend-icon="mdi-timer"
        title="Stopwatch"
        value="stopwatch"
        to="/stopwatch"
        replace
      ></v-list-item>
      <v-list-item
        prepend-icon="mdi-alarm"
        title="Countdown"
        value="countdown"
        to="/countdown"
        replace
      ></v-list-item>
      <v-list-item
        prepend-icon="mdi-timelapse"
        title="Interval"
        value="interval"
        to="/interval"
        replace
      ></v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts" setup>
  import { useAppStore } from "@/store/app";
  const store = useAppStore();
</script>
