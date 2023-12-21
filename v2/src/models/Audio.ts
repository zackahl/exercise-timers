const sounds = [
    "None",
    "Beep (High)",
    "Beep (Low)",
    "Beep (Echo)",
    "Blip",
    "Buzz",
    "Harp",
    "Tick Tock"
]

const alarms = [
    "None",
    "Alarm Clock (Classic)",
    "Alarm Clock (Digital)",
    "Buzz",
    "Alert",
    "Double Beep",
    "Warning",
]

const soundEffects = {
    global: {
        start: sounds.concat("Start (Speech)").sort(),
        pause: sounds.concat("Pause (Speech)").sort()
    },
    stopwatch: {
        oneMinute: sounds
    },
    countdown: {
        tenSeconds: sounds.concat("Ten Seconds Remaining (Speech)").sort(),
        completed: alarms.concat("Countdown Completed (Speech)").sort()
    },
    intervals: {
        fiveSeconds: sounds.concat("Five Seconds Remaining (Speech)").sort(),
        completed: alarms.concat("Intervals Completed (Speech)").sort()
    }
}

export default soundEffects