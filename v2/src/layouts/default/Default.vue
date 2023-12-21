<template>
  <v-app :class="`bg-${store.display.color.background}`">
    <default-bar />
    <default-side-nav v-if="mobile" />
    <default-settings-menu />
    <default-view />
  </v-app>
</template>

<script lang="ts" setup>
  import DefaultBar from './AppBar.vue'
  import DefaultSideNav from "./SideNav.vue";
  import DefaultView from './View.vue'
  import DefaultSettingsMenu from '@/components/Menu.vue'
  import { useDisplay } from "vuetify";
  import { useAppStore } from "@/store/app";

  const store = useAppStore();
  const { mobile } = useDisplay();
</script>
