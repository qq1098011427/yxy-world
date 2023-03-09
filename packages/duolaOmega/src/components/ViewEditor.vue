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
  // 'http://www.baidu.com http://locahost:8080\n# http://www.xxx.com http://locahost:8081\n'
  // -> [{ source: 'http://www.baidu.com', target: 'http://locahost:8080' }, ...]
  const rules = content.value.split('\n').map((item: string) => {
    const [source, target] = item.trim().split(/\s+/g)
    return {
      source,
      target
    }
  }).filter((item: any) => item && !item.source.startsWith('#'))
  console.log(rules,' ----rules----');
};
</script>
<style lang="less" scoped></style>
