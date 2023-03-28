<template>
  <div class="avatar">{{userInfo.data.name}}</div>
</template>
<script lang="ts" setup>
import { useUserInfo } from '../../store/useUserInfo'
import prisma from "../../../common/db";
import {onMounted} from "vue";

const userInfo = useUserInfo()

onMounted(async () => {
  const user = await prisma.user.findMany()
  userInfo.setData(user[0])
})
</script>
<style lang="less" scoped>
@avatar-color: #f49330;

.avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: @avatar-color;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #ffffff;
  font-size: 10px;
  margin-right: 5px;
  cursor: pointer;
}
</style>
