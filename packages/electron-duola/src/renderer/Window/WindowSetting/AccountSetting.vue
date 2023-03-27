<template>
  <div>AccountSetting</div>
</template>
<script lang="ts" setup>
import { onMounted } from "vue";
import { dialogReady } from "../../common/Dialog";

onMounted(() => {
  console.log("ready", Date.now());
  window.addEventListener("message", (e) => {
    console.log(e.data, 'AccountSetting')
    console.log(window.opener, 'AccountSetting window.opener')
    window.opener.postMessage({ msgName: "I am AccountSetting" });
  });
  dialogReady();
});
</script>
