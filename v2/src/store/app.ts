import { defineStore } from "pinia";
import { useStorage } from '@vueuse/core';
import { AnimationVariant } from "@/models/Animation";

export const initState = {
  mobileMenu: false,
  settingsMenu: false,
  audio: {
    volume: 50,
    global: {
      start: "Beep (Low)",
      pause: "Beep (Low)"
    },
    stopwatch: {
      oneMinute: "Beep (Low)"
    },
    countdown: {
      tenSeconds: "Tick Tock",
      completed: "Double Beep"
    },
    interval: {
      fiveSeconds: "Tick Tock",
      completed: "Double Beep"
    },
  },
  display: {
    color: {
      background: "inherit",
      timer: "primary"
    },
    animation: 'snow' as AnimationVariant,
    font: {
      type: "Roboto",
      size: 16,
      weight: 300
    },
    format: "HH:mm:ss",
    nightMode: false
  },
}

export const useAppStore = defineStore("app", {
  state: () => (useStorage('settings', initState)),
  actions: {
    toggleMobileMenu() {
      this.mobileMenu = !this.mobileMenu;
    },
    toggleSettingsMenu() {
      this.settingsMenu = !this.settingsMenu;
    }
  }
});
