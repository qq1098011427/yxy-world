<template>
  <div
      ref="textareaRef"
      class="textarea"
      @blur="handleBlur"
      @focus="handleFocus"
      @keydown="handleKeyDown"
      @input="handleInput"
      @paste="handlePaste"
      contenteditable="true">
  </div>
</template>
<script setup lang="ts">
import {onMounted, ref, watch, nextTick, defineProps, defineEmits} from 'vue'

const props: any = defineProps({
  modelValue: String
})
const emits = defineEmits(['update:modelValue'])
const content = ref<string>(props.modelValue)
const isBlur = ref<boolean>(false)
const textareaRef = ref<any>(null)

// 监听 value 值的变化
watch(() => props.modelValue, (newValue) => {
  isBlur.value && (textareaRef.value.innerText = newValue)
});

const handleInput = () => {
  // 将当前编辑器的内容更新到 value 属性中，实现双向绑定
  const newText = (textareaRef.value as HTMLDivElement).innerText;
  [...textareaRef.value.childNodes].forEach((item: any) => {
    if (item.nodeType === 3) { // 文本节点
      const div = document.createElement('div')
      div.innerHTML = item.textContent
      if (/^#\s?/.test(item.textContent)) {
        div.classList.add('rule-comment')
      } else {
        div.removeAttribute('class')
      }
      item.replaceWith(div)
      // 由于替换了文本节点，所以需要重新获取光标位置
      const selection: any = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(div);
      // 光标置于文本末尾
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    }
    if (item.nodeType === 1) { // 元素节点
      if (/^#\s?/.test(item.innerText)) {
        item.classList.add('rule-comment')
      } else {
        item.removeAttribute('class')
      }
      // 去除innerHTML中的span标签，但保留内容
      const span = item.querySelectorAll('span')
      if (span) {
        span.forEach((item: any) => {
          item.replaceWith(item.innerText)
        })
      }
    }
  })
  console.log(textareaRef.value.innerHTML, '==textareaRef.value==');
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
      console.log(currentLineNode, '==currentLineNode==');
      currentLineNode.innerText = newText;
      currentLineNode.removeAttribute('class')
      offset -= 2
    } else {
      offset += 2
      // 由于第一行特殊，需要被div包裹，不然无法完成对字体的颜色修改
      if (currentLineNode === textareaRef.value) {
        if (!/^<div>/.test(currentLineNode.innerHTML)) {
          const newLineNode = document.createElement('div');
          newLineNode.innerHTML = `# ${range.startContainer.textContent}`;
          newLineNode.className = 'rule-comment'
          currentLineNode.replaceChild(newLineNode, currentLineNode.firstChild);
        }
      } else {
        currentLineNode.innerText = `# ${currentLineText}`;
        currentLineNode.classList.add('rule-comment')
      }
    }
    const newRange = document.createRange();
    newRange.setStart(currentLineNode.firstChild.firstChild ?? currentLineNode.firstChild, Math.max(startOffset + offset, 0));
    newRange.setEnd(currentLineNode.firstChild.firstChild ?? currentLineNode.firstChild, Math.max(startOffset + offset, 0));
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
      const currentLineText = currentLineNode.innerText;
      // 带有#的行，不需要移除className
      if (currentLineNode && !/^#\s?/.test(currentLineText)) {
          currentLineNode?.classList?.remove?.('rule-comment')
      }
      startContainer?.removeAttribute?.('class')
    }, 0)
  }
  // 由于不触发input事件，所以需要手动更新value
  const newText = (textareaRef.value as HTMLDivElement).innerText;
  emits('update:modelValue', newText)
}
const handlePaste = (e: any) => {
  e.preventDefault();
  const text = e.clipboardData.getData('text/plain');
  const parser = new DOMParser();
  const parsed = parser.parseFromString(text, 'text/html');
  const plainText: any = parsed.body.textContent;
  console.log(plainText, '==plainText==')
  document.execCommand('insertText', false, plainText);
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

/deep/ .rule-comment {
  color: #569cd6;
}
</style>