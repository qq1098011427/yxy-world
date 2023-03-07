<template>
  <div>
    <Editor v-model="content" ></Editor>
    <button @click="handleClick">点击</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Editor from './Editor.vue';

const content = ref<string>('');

const handleClick = () => {
  console.log(content.value, '--content.value--')
};
</script>
<style lang="less" scoped></style>
