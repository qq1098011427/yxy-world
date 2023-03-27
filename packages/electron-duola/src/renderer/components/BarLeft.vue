<script setup lang="ts">
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import {router} from "../router";
import { createDialog } from '../common/dialog';

// @ts-ignore
const routerList = ref((router.options.routes.find((i: any) => i.path === '/WindowMain')?.children || []).map((i: any) => ({
  path: `/WindowMain/${i.path}`, text: i.text, isSelected: false, iconPark: i.iconPark, iconParkActive: `${i.iconPark}-active`
})));
const route = useRoute();
watch(
    () => route,
    () => routerList.value.forEach((item) => {
      item.isSelected = item.path === route.fullPath
    }),
    {immediate: true, deep: true}
);
const toRoute = (item: any) => {
  if (item.path === route.fullPath) return;
  router.push(item.path);
};
const openSettingWindow = async () => {
  const config = { modal: false, width: 600, webPreferences: { webviewTag: false } }
  // dialog是新打开的窗口，不过在同一个进程中
  const dialog = await createDialog('/WindowSetting/AccountSetting', config);
  // 打开窗口后给新窗口发送消息， /WindowSetting/AccountSetting中的window.addEventListener('message', (e) => {})可以监听到
  dialog.postMessage({msgName: 'openSettingWindow' });
  window.addEventListener('message', (e) => {
    console.log('BarLeft.vue', e.data);
  });
}
</script>
<template>
  <div class="BarLeft">
    <div class="menu">
      <div v-for="router in routerList" :key="router.path">
        <div @click="toRoute(router)" :class="[`menuItem`, { active: router.isSelected }]">
          <iconpark-icon
              :name="router.isSelected ? router.iconParkActive : router.iconPark"
              style="margin-top: 10px"
              size="20"></iconpark-icon>
          <div class="menuItem-text">{{router.text}}</div>
        </div>
      </div>
    </div>
    <div @click="openSettingWindow" class="setting">
      <div class="menuItem">
        <iconpark-icon name="config" size="20"></iconpark-icon>
      </div>
    </div>
  </div>
</template>
<style lang="less" scoped>
.BarLeft {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: rgb(66, 76, 102);
  padding: 4px;
  box-sizing: border-box;
}
.menu {
  flex: 1;
}
.menuItem {
  height: 56px;
  width: 56px;
  display: flex;
  align-items: center;
  flex-direction: column;
  text-decoration: none;
  cursor: pointer;
  color: rgb(214, 216, 222);
  border-radius: 6px;
  &-text {
    margin-top: 6px;
    font-size: 10px;
  }
}
.active {
  background: rgb(39, 46, 64);
}
</style>
