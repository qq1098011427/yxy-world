<script setup lang="ts">
import { ipcRenderer } from "electron";
import { onMounted } from "vue";

import BarLeft from "../components/BarLeft.vue";
onMounted(() => {});
</script>

<template>
  <div class="page">
    <BarLeft />
    <div class="rightContent">
      <router-view />
    </div>
  </div>
</template>

<style scoped lang="less">
.page {
  height: 100%;
  width: 100%;
  display: flex;
  .rightContent {
    flex: 1;
  }
}
</style>
