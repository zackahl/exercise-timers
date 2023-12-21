export const colors = [
  { title: "Amber", value: "amber" },
  { title: "Black", value: "black" },
  { title: "Blue", value: "blue" },
  { title: "Blue Grey", value: "blue-grey" },
  { title: "Brown", value: "brown" },
  { title: "Cyan", value: "cyan" },
  { title: "Deep Orange", value: "deep-orange" },
  { title: "Deep Purple", value: "deep-purple" },
  { title: "Green", value: "green" },
  { title: "Grey", value: "grey" },
  { title: "Indigo", value: "indigo" },
  { title: "Light Blue", value: "light-blue" },
  { title: "Light Green", value: "light-green" },
  { title: "Lime", value: "lime" },
  { title: "Orange", value: "orange" },
  { title: "Pink", value: "pink" },
  { title: "Purple", value: "purple" },
  { title: "Red", value: "red" },
  { title: "Teal", value: "teal" },
  { title: "White", value: "white" },
  { title: "Yellow", value: "yellow" }
];

export const textColors = [
    { title: "Default", value: "primary" }
]
.concat(colors);

export const bgColors = [
    { title: "Default", value: "inherit" }
]
.concat(colors);

export const animations = [
    { title: "None", value: "none" },
    { title: "Parallax", value: "parallax" },
    { title: "Snow", value: "snow" },
    { title: "Stars", value: "stars" },
    { title: "Fireworks", value: "fireworks" }
]

export const fonts = [
    "Arial",
    "Calibri",
    "Lato",
    "Monospace",
    "Open Sans",
    "Roboto"
];

export const weights = [
    { title: "Regular", value: 300 },
    { title: "Bold", value: 600 },
    { title: "Black", value: 900 }
];

export const formats = [
    { title: 'Minutes/Seconds', value: 'mm:ss' },
    { title: 'Hours/Minutes/Seconds', value: 'HH:mm:ss' }
]

export const display = {
    colors,
    textColors,
    bgColors,
    animations,
    fonts,
    weights,
    formats
}

export default display