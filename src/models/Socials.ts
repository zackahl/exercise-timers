interface SocialLink {
    name: string
    icon: string
    link: string
}

export const socials:SocialLink[] = [
    { name: 'github', icon: 'mdi-github', link: 'https://github.com/zackahl'},
    { name: 'codepen', icon: 'mdi-codepen', link: 'https://codepen.io/zackahl/' },
    { name: 'instagram', icon: 'mdi-instagram', link: 'https://www.instagram.com/zacharykahldesigns/' }
]

export const shares:SocialLink[] = [
    { name: 'facebook', icon: 'mdi-facebook', link: 'https://www.facebook.com/sharer/sharer.php?u=https://www.exercise-timers.com' },
    { name: 'twitter', icon: 'mdi-twitter', link: 'https://twitter.com/intent/tweet?text=Stopwatch,%20countdown%20and%20interval%20timers%20to%20use%20when%20exercising https://www.exercise-timers.com' },
    { name: 'pinterest', icon: 'mdi-pinterest', link: 'https://pinterest.com/pin/create/button/?url=https://www.exercise-timers.com&media=&description=Stopwatch,%20countdown%20and%20interval%20timers%20to%20use%20when%20exercising.' },
    { name: 'email', icon: 'mdi-email', link: 'mailto:?subject=Exercise Timers' },
]

export default {
    socials,
    shares
}