<template>
  <div>
    2
  </div>
</template>

<script setup lang="ts">
import { onMounted, watchEffect } from "vue";

onMounted(() => {
  setInterval(() => {
    console.log(1)
  }, 3000);
});

watchEffect(() => {
  console.log("watchEffect触发");
});
</script>
