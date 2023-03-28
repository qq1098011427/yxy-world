import { defineStore } from "pinia";
import { Ref, ref } from "vue";

interface IUserInfo {
    id: string|number
    name: string
    avatar?: string
}

export const useUserInfo = defineStore('userInfo', () => {
  const data: Ref<IUserInfo | {}> = ref({
      id: Math.random() * 99,
      name: '默认'
  });
  const setData = (newData: IUserInfo) => {
      data.value = newData;
  }
  return { data, setData };
});
