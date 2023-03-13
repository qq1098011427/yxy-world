<script setup lang="ts">
import {onMounted, ref, reactive} from 'vue'

defineProps<{ key?: any }>()

const content = ref<any>([''])
// 保存规则并应用
const saveAndApplyRules = (rules: string) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs: any) => {
    chrome.tabs.sendMessage(tabs[0].id, { type: 'apply-rules', rules });
  });
};
// 获取当前光标所在行的开始/结束位置
const getLoc = (pos: number, value: string) => {
  let start = pos;
  while (start > 0 && value[start - 1] !== '\n') {
    start--;
  }
  let end = pos;
  while (end < value.length && value[end] !== '\n') {
    end++;
  }
  return {
    start,
    end
  };
}
const handleKeyDown = (event: EventTarget | KeyboardEvent) => {
  if ((event as KeyboardEvent).metaKey && (event as KeyboardEvent).key === '/') {
    (event as KeyboardEvent).preventDefault();
    const textarea = (event as any).target;
    let prevEnd = textarea.selectionEnd;
    const { start, end } = getLoc(textarea.selectionEnd, textarea.value)
    const currentLineText = textarea.value.substring(start, end);
    let updatedLineText = '';
    if (currentLineText.startsWith('# ')) {
      updatedLineText = currentLineText.substring(2);
      prevEnd -= 2;
    } else {
      updatedLineText = `# ${currentLineText}`;
      prevEnd += 2;
    }
    const updatedCode = `${textarea.value.substring(0, start)}${updatedLineText}${textarea.value.substring(start + currentLineText.length)}`;
    content.value = updatedCode;
    // 设置焦点位置
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(prevEnd, prevEnd);
    }, 0);
  }
  if ((event as KeyboardEvent).metaKey && (event as KeyboardEvent).key === 's') {
    (event as KeyboardEvent).preventDefault();
    saveAndApplyRules(content.value);
  }
}
// textarea 失去焦点时保存规则
const handleBlur = () => {
  saveAndApplyRules(content.value);
}
</script>

<template>
  <div>
    <textarea
      v-model="content"
      class="textarea"
      placeholder="请输入内容"
      rows="10"
      cols="30"
      @blur="handleBlur"
      @keydown="handleKeyDown"
    ></textarea>
  </div>
</template>

<style lang="less" scoped>
.textarea {
  background-color: #1e1e1e;
  color: #d4d4d4;
  border: 1px solid #d4d4d4;
  border-radius: 4px;
  padding: 4px;
  width: 770px;
}

</style>
