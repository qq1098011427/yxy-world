<script setup lang="ts">
import { toRaw, ref, watch } from "vue";
import { useRoute } from "vue-router";
import {router} from "../router";

// @ts-ignore
const routerList = ref(router.options.routes.find((i: any) => i.path === '/WindowMain').children.map((i: any) => ({
  path: `/WindowMain/${i.path}`, text: i.text, isSelected: false, iconPark: i.iconPark, iconParkActive: `${i.iconPark}-active`
})));
const route = useRoute();
watch(() => route,
    () => routerList.value.forEach((item) => {
      item.isSelected = item.path === route.fullPath
    }),
    {
      immediate: true, deep: true,
    }
);
const toRoute = (item: any) => {
  if (item.path === route.fullPath) return;
  router.push(item.path);
};
</script>
<template>
  <div class="BarLeft">
    <div class="menu">
      <div v-for="router in routerList" :key="router.path">
        <div @click="toRoute(router)" :class="[`menuItem`, { active: router.isSelected }]">
          <iconpark-icon :name="router.isSelected ? router.iconParkActive : router.iconPark" size="20"></iconpark-icon>
          <div class="menuItem-text">{{router.text}}</div>
        </div>
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
  justify-content: center;
  align-items: center;
  flex-direction: column;
  text-decoration: none;
  cursor: pointer;
  color: rgb(214, 216, 222);
  border-radius: 6px;
  &-text {
    margin-top: 8px;
    font-size: 10px;
  }
}
.active {
  background: rgb(39, 46, 64);
}
</style>
