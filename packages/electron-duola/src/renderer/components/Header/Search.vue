<template>
  <div>
    <div class="search-container">
      <iconpark-icon class="search" name="search" size="16" />
      <input type="text" placeholder="搜索">
    </div>
  </div>
</template>
<script setup lang="ts">
</script>
<style lang="less" scoped>
@primary-color: rgb(255,255,255);
@hover-color: #eee;
@shallow-bg-color: rgb(@primary-color, 0.2);
@shallow-color: rgb(@primary-color, 0.6);

.search-container {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 300px;
  height: 28px;
  border-radius: 4px;
  background-color: @shallow-bg-color;
  cursor: pointer;
  
  input[type="text"] {
    flex: 1;
    height: 100%;
    padding: 0 10px;
    border: none;
    background-color: transparent;
    font-size: 14px;
    text-align: center;
    transition: background-color 0.2s ease;
    &::placeholder {
      color: @shallow-color;
      font-style: italic;
      font-size: 12px;
      transition: color 0.2s ease;
    }
    &:focus-visible {
      outline: none;
    }
    &:hover {
      background-color: rgb(@primary-color, 0.1);
      &::placeholder {
        color: @primary-color;
      }
    }
  }
  .search {
    position: absolute;
    top: 50%;
    left: 10px;
    transform: translateY(-50%);
    color: @shallow-color;
    font-size: 14px;
  }
}
</style>
