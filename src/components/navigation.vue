<template>
  <v-toolbar color="primary" class="nav pl-3" dark dense fixed flat tabs>
    <v-toolbar-side-icon v-on:click="$store.state.toggle = !$store.state.toggle" :ripple="{ class: 'accent--text' }">
      <v-icon color="accent">menu</v-icon>
    </v-toolbar-side-icon>
    <h3 class="grow hidden-sm-and-down ma-0 pl-3" style="min-width: 150px">{{ $store.state.title }}</h3>
    <v-spacer></v-spacer>
    <v-tabs color="primary" right style="width: 85%" hide-slider v-on:change="$store.state.toggle = false">
      <v-tab class="accent--text" v-bind:to="'/stopwatch'">
        <v-icon class="mr-1">timer</v-icon>Stopwatch
      </v-tab>
      <v-tab class="accent--text" v-bind:to="'/countdown'">
        <v-icon class="mr-1">alarm</v-icon>Countdown
      </v-tab>
      <v-tab class="accent--text" v-bind:to="'/interval'">
        <v-icon class="mr-1">timelapse</v-icon>Interval
      </v-tab>
      <v-tab v-bind:to="'/home'" :ripple="{ class: 'accent--text' }">
        <v-icon color="light">home</v-icon>
      </v-tab>
    </v-tabs>
  </v-toolbar>
</template>

<script lang="ts">
  import store from '../store';

  export default {
    store
  }
</script>