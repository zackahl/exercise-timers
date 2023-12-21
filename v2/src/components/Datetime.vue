<template>
    <span class="text-caption text-disabled">
        {{ datetime.format('llll') }}
    </span>
</template>
  
<script lang="ts" setup>
    import dayjs from "dayjs";
    import localizedFormat from "dayjs/plugin/localizedFormat"
    import { onMounted, ref } from "vue";
    dayjs.extend(localizedFormat)

    const datetime = ref(dayjs())

    // On component mount
    onMounted(() => {
        // Update datetime
        setInterval(() => {
            datetime.value = dayjs();
        }, 1000)
    });
</script>
  