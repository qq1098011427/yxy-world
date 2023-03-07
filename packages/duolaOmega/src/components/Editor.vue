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
  const textarea = textareaRef.value as HTMLDivElement;
  const newText = textarea.innerHTML
  emits('update:modelValue', newText)
};
const handleBlur = () => {
  isBlur.value = true
}
const handleFocus = () => {
  isBlur.value = false
}

const handleKeyDown = () => {}

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
</style>
