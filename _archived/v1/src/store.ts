import Vue from 'vue'
import Vuex from 'vuex'
import * as dayjs from 'dayjs';

Vue.use(Vuex)

const state = {
  title: "Exercise Timers",
  date: dayjs().format('DD/MM/YYYY'),
  toggle: false,
  stopwatch: {
    time: null,
    progress: null,
    counter: null,
    animation: null,
  },
  countdown: {
    time: null,
    totalSeconds: null,
    progress: null,
    animation: null
  },
  interval: {
    intervalTime: null,
    intervalMinutes: null,
    intervalSeconds: null,
    totalIntervalSeconds: null,
    totalRestSeconds: null,
    currentIntervalNum: null,
    numIntervalsType: null,
    numIntervals: null,
    customDurations: [],
    customIntervals: [],
    interval: null,
    elapsed: null,
    rest: null,
    restMinutes: null,
    restSeconds: null,
    resting: null,
    progress: {
      color: null,
      counter: null
    }
  },
  socials: {
    icons: ['fab fa-github','fab fa-codepen','fab fa-dribbble','fab fa-instagram'],
    links: ['https://github.com/zackahl',
            'https://codepen.io/zackahl/',
            'https://dribbble.com/zacharykahl',
            'https://www.instagram.com/zacharykahl/']
  },
  shares: {
    icons: ['fab fa-facebook','fab fa-twitter','fab fa-pinterest','email'],
    links: ['https://www.facebook.com/sharer/sharer.php?u=https://www.exercise-timers.com',
            'https://twitter.com/intent/tweet?text=Stopwatch,%20countdown%20and%20interval%20timers%20to%20use%20when%20exercising https://www.exercise-timers.com',
            'https://pinterest.com/pin/create/button/?url=https://www.exercise-timers.com&media=&description=Stopwatch,%20countdown%20and%20interval%20timers%20to%20use%20when%20exercising.',
            'mailto:?subject=Exercise Timers']
  },
  audio: {
    stopwatch: {
      sound: 'Beep (Low)',
    },
    countdown: {
      sound: 'Tick Tock',
      alarm: 'Double Beep',
    },
    interval: {
      sound: 'Tick Tock',
      alarm: 'Double Beep',
    }
  },
  display: {
    color: {
      shades: ['Amber','Blue','Cyan','Green','Indigo','Orange','Pink','Purple','Red','Teal','Yellow'],
      shade: 'Teal'
    },
    font: {
      types: ['Arial','Calibri','Lato','Monospace','Roboto'],
      type: 'Roboto',
      size: 16
    },
    nightMode: false
  }
}

export default new Vuex.Store({
  state,
  mutations: {
    changeTitle (state, newTitle) {
      // mutate state
      state.title = newTitle;
    },
    updateAudio (state, newAudio) {
      state.audio = newAudio;
    },
    updateDisplay (state, newDisplay) {
      state.display = newDisplay;
    }
  }
})