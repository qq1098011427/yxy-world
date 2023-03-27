<script setup lang="ts">
import {onMounted, ref, onUnmounted} from "vue";
import {ipcRenderer} from "electron";

defineProps<{ title?: string }>();
const isMaximized = ref(false);
const closeWindow = () => {
  ipcRenderer.invoke('closeWindow')
};
const maximizeMainWin = () => {
  console.log('invoke maximizeMainWin')
  ipcRenderer.invoke('maximizeWindow')
};
const minimizeMainWindow = () => {
  ipcRenderer.invoke('minimizeWindow')
};
// 还原窗口
const unmaximizeMainWindow = () => {
  ipcRenderer.invoke('unmaximizeWindow')
};
// 窗口最大化事件
const winMaximizeEvent = () => {
  console.log('渲染进程监听 winMaximizeEvent')
  isMaximized.value = true;
};
// 窗口最小化事件
const winUnmaximizeEvent = () => {
  isMaximized.value = false;
};
onMounted(() => {
  ipcRenderer.on('windowMaximized', winMaximizeEvent);
  ipcRenderer.on('windowUnmaximized', winUnmaximizeEvent)
});
onUnmounted(() => {
  ipcRenderer.off('windowMaximized', winMaximizeEvent)
  ipcRenderer.off('windowUnmaximized', winUnmaximizeEvent)
});
</script>
<template>
  <div class="topBar">
    <div class="winTitle">{{ title }}</div>
    <div class="winTool">
      <div @click="minimizeMainWindow">
        最小
      </div>
      <div v-if="isMaximized" @click="unmaximizeMainWindow">
        还原
      </div>
      <div v-else @click="maximizeMainWin">
        最大
      </div>
      <div @click="closeWindow">
        关闭
      </div>
    </div>
  </div>
</template>
<style scoped lang="less">
.topBar {
  display: flex;
  height: 25px;
  line-height: 25px;
  -webkit-app-region: drag;
  width: 100%;
}

.winTitle {
  flex: 1;
  padding-left: 12px;
  font-size: 14px;
  color: #888;
}

.winTool {
  height: 100%;
  display: flex;
  -webkit-app-region: no-drag;
  div {
    height: 100%;
    width: 34px;
    text-align: center;
    color: #999;
    cursor: pointer;
    line-height: 25px;
    &:hover {
      background: #efefef;
    }
    &:last-child:hover {
      background: #ff7875;
    }
    &:last-child:hover i {
      color: #fff !important;
    }
  }
  .icon {
    font-size: 10px;
    color: #666666;
    font-weight: bold;
  }
}
</style>
