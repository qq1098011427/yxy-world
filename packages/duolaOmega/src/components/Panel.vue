<template>
  <div :class="`editor ${isProxy ? 'encircle': ''}`">
    <Editor v-model="content" @onUpdateDynamicRules="handleOpenProxy"></Editor>
    <div class="switch-btn">
      <div v-if="isProxy" class="switch-btn__text" @click="handleCloseProxy">关闭</div>
      <div v-else class="switch-btn__text" @click="handleOpenProxy(false)">开启</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, onUnmounted, ref} from 'vue';
import Editor from './Editor.vue';
// @ts-ignore
import { sendMessage }  from '../../extensions/sendMessage.js'
import { getChromeStorage } from '../utils.js'

const content = ref<string>('');
const isProxy = ref<boolean>(false)


const handleOpenProxy = async (pureSave = false) => {
  const rules = content.value.split('\n').map((item: string) => {
    const [source, target] = item.trim().split(/(?<=[^#])\s+/g)
    return {
      source,
      target
    }
  }).filter(item => item?.source && item?.target)
  // console.log('--rules--:', rules, '--pureSave--:', pureSave)
  // 如果只是按下快捷键保存只是单纯保存规则，不需要控制代理是否被开启
  !pureSave && (isProxy.value = true)
  const obj = pureSave ? { rules } : { rules, isProxy: isProxy.value}
  await chrome.storage.local.set(obj)
  sendMessage('updateDynamicRules')
}

const handleCloseProxy = async () => {
  isProxy.value = false;
  const obj = await chrome.storage.local.get()
  await chrome.storage.local.set({ ...obj, isProxy: isProxy.value })
  sendMessage('clearDynamicRules')
};

onMounted(async () => {
  const { rules, isProxy: _isProxy } = await getChromeStorage()
  content.value = rules.map((item: any) => `${item?.source || ''} ${item?.target || ''}`).join('\n')
  isProxy.value = _isProxy
})
</script>
<style lang="less" scoped>
.editor {
  position: relative;
  width: 770px;
  z-index: 1;
}
.encircle {
  position: relative;
  &:before,
  &:after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 3px;
    border: 4px solid rgba(0, 255, 255, 0.87);
    animation: opacity 3s ease-in infinite;
    z-index: 1;
  }
  &:before {
    animation-delay: 0s;
  }
  &:after {
    animation-delay: 1.5s;
    box-shadow: 0 0 30px 10px rgba(0, 255, 255, 0.87);
  }
}
.switch-btn {
  position: absolute;
  width: 100px;
  height: 50px;
  background: #3d87c459;
  transform: rotate(180deg);
  border-radius: 0 0 50px 50px;
  bottom: 3px;
  left: 350px;
  display: flex;
  cursor: pointer;
  border: 2px solid #d4d4d4;
  z-index: 2;
  &__text {
    color: #d4d4d4;
    font-size: 18px;
    font-family: "Yuanti SC";
    text-align: center;
    line-height: 50px;
    justify-content: center;
    align-items: center;
    flex: 1;
    transform: rotate(180deg);
  }
}
@keyframes opacity {
  0% {
    opacity: 0;
  }
  25% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
  75% {
    opacity: 0.5;
  }
  100% {
    opacity: 0;
  }
}
</style>
