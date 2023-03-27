<template>
  <header>
    <div class="header-container">
      <div class="header-left"></div>
      <div class="header-middle">
        <Search />
      </div>
      <div class="header-right">
        <div class="avatar" ></div>
      </div>
    </div>
  </header>
</template>
<script setup lang="ts">
import Search from "./Search.vue";
</script>
<style lang="less" scoped>
@header-height: 42px;
@primary-color: #007bff;
@bg-color: rgb(66, 76, 102);
header {
  width: 100%;
  box-sizing: inherit;
}

.header-container {
  box-sizing: inherit;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: @header-height;
  width: 100%;
  background: @bg-color;
  padding: 0 10px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

/* header left */
.header-left {
  display: flex;
  align-items: center;
}

/* header middle */
.header-middle {
  display: flex;
  align-items: center;
}

/* header right */
.header-right {
  display: flex;
  align-items: center;
  .avatar {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: @primary-color;
    margin-right: 5px;
  }
}
</style>
