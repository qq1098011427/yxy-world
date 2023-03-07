<script setup lang="ts">
import {onMounted, ref, reactive} from 'vue'

defineProps<{ key?: any }>()

const content = ref<any>([''])

onMounted(() => {
  // load()
})

const load = () => {
  // 从 chrome.storage.local.get 中加载规则
  chrome.storage.local.get('rules', (result: any) => {
    content.value = result.rules
  })
}
// 保存规则并应用
const saveAndApplyRules = (rules: string) => {
  // 将规则保存到 chrome.storage.local 中
  console.log(chrome, '--chrome--')
  chrome.storage.local.set({ rules })
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
    console.log(textarea, '--textarea ooo-');
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
const handleKeyDown1 = (event: EventTarget | KeyboardEvent) => {
  // if ((event as KeyboardEvent).metaKey && (event as KeyboardEvent).key === '/') {
  //   (event as KeyboardEvent).preventDefault();
  //   // 获取当前光标所在行
  //   const selection: any = window.getSelection();
  //   const range = selection.getRangeAt(0);
  //   const currentLine = range.startContainer.parentNode;
  //   // 获取当前行在文本框中的索引
  //   const index = [...currentLine.parentNode.children].indexOf(currentLine);
  //   // 在当前行前面添加 # ，并更新内容
  //   const lineText = currentLine.innerText;
  //   console.log(lineText, '--lineText--')
  //   const updatedLineText = lineText.startsWith('#')
  //       ? lineText.substring(2)
  //       : `# ${lineText}`;
  //   console.log(index, '--index--')
  //   content.value.splice(index, 1, updatedLineText);
  //   console.log(content.value, '---content.value---')
  // }
  // if ((event as KeyboardEvent).metaKey && (event as KeyboardEvent).key === 's') {
  //   (event as KeyboardEvent).preventDefault();
  //   saveAndApplyRules(content.value);
  // }
}
const handleInput = (e: any) => {
  // if (e.target.querySelector('.line')) return
  // e.preventDefault();
  // e.target.innerHTML = `<div class="line">${e.target.innerHTML}</div>`
  // e.target.querySelector('.line').focus();
}
</script>

<template>
  <div>
<!--    <textarea-->
<!--      v-model="content"-->
<!--      class="textarea"-->
<!--      placeholder="请输入内容"-->
<!--      rows="10"-->
<!--      cols="30"-->
<!--      @blur="handleBlur"-->
<!--      @keydown="handleKeyDown"-->
<!--    ></textarea>-->
    <div
        ref="textarea"
        class="textarea"
        @blur="handleBlur"
        @keydown="handleKeyDown1"
        @input="handleInput"
        contenteditable="true">
    </div>
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
.line :first-of-type[line^="#"] {
  color: blue;
}
</style>
