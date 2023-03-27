<template>
  <div>WindowUserInfo</div>
</template>
<script lang="ts" setup>
import { useUserInfo } from '../../store/useUserInfo'

const userInfo = useUserInfo()

console.log(userInfo, '==userInfo==');
</script>
