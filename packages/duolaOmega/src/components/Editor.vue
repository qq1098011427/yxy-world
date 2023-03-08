<template>
    <div
        ref="textareaRef"
        class="textarea"
        @blur="handleBlur"
        @focus="handleFocus"
        @keydown="handleKeyDown"
        @input="handleInput"
        contenteditable="true">
    </div>
</template>
<script setup lang="ts">
import { onMounted, ref, watch, nextTick, defineProps, defineEmits } from 'vue'

const props: any = defineProps({
  modelValue: String
})
const emits = defineEmits(['update:modelValue'])
const content = ref<string>(props.modelValue)
const isBlur = ref<boolean>(false)
const textareaRef = ref<any>(null)

// 监听 value 值的变化
watch(() => props.modelValue, (newValue) => {
  isBlur.value && (textareaRef.value.innerHTML = newValue)
});

const handleInput = () => {
  // 将当前编辑器的内容更新到 value 属性中，实现双向绑定
  const newText = (textareaRef.value as HTMLDivElement).innerHTML
  emits('update:modelValue', newText)
};
const handleBlur = () => {
  isBlur.value = true
}
const handleFocus = () => {
  isBlur.value = false
}

const handleKeyDown = (e: any) => {
  if (e.metaKey && e.key === '/') {
    e.preventDefault()
    // 获取当前光标所在行
    const selection: any = window.getSelection();
    const range = selection.getRangeAt(0);
    const startOffset = range.startOffset;
    const currentLineNode = range.startContainer.parentNode;
    let offset = 0
    // currentLineNode必须在textarea中，且文本框中必须有内容
    if (!textareaRef.value.contains(currentLineNode) || !textareaRef.value.innerHTML || !range.startContainer.textContent) return
    const currentLineText = currentLineNode.innerText;
    // 如果当前行已经以#开头，则移除#
    if (/^#/.test(currentLineText)) {
      const newText = currentLineText.replace(/^#\s?/, '');
      currentLineNode.innerText = newText;
      currentLineNode.removeAttribute('class')
      offset -= 2
    } else {
      offset += 2
      // 由于第一行特殊，需要被div包裹，不然无法完成对字体的颜色修改
      if (currentLineNode === textareaRef.value) {
        if (!/^<div>/.test(currentLineNode.innerHTML)) {
          const newLineNode = document.createElement('div');
          newLineNode.innerHTML = `# ${currentLineText}`;
          newLineNode.className = 'rule-comment'
          currentLineNode.replaceChild(newLineNode, currentLineNode.firstChild);
        }
      } else {
        currentLineNode.innerText = `# ${currentLineText}`;
        currentLineNode.classList.add('rule-comment')
      }
    }
    const newRange = document.createRange();
    newRange.setStart(currentLineNode.firstChild.firstChild ?? currentLineNode.firstChild, startOffset + offset);
    newRange.setEnd(currentLineNode.firstChild.firstChild ?? currentLineNode.firstChild, startOffset + offset);
    selection.removeAllRanges();
    selection.addRange(newRange);
  }
  if (e.metaKey && e.key === 's') {
    e.preventDefault()
  }
  if (e.key === 'Enter') {
    setTimeout(() => {
      // 获取当前光标所在行
      const selection: any = window.getSelection();
      const range = selection.getRangeAt(0);
      const startContainer = range.startContainer;
      const currentLineNode = startContainer.parentNode;
      console.log(currentLineNode, '==currentLineNode==', range.startContainer, '==range.startContainer==')
      // if (currentLineNode === textareaRef.value) return
      currentLineNode?.classList?.remove?.('rule-comment')
      startContainer?.removeAttribute?.('class')
    }, 0)
  }
}

onMounted(() => {
  nextTick(() => {
    const textarea = textareaRef.value as HTMLDivElement;
    textarea.focus();
  });
});
</script>

<style lang="less" scoped>
.textarea {
  background-color: #1e1e1e;
  color: #d4d4d4;
  border: 1px solid #d4d4d4;
  border-radius: 4px;
  padding: 4px;
  width: 770px;
}
/deep/.rule-comment {
  color: #569cd6;
}
</style>
