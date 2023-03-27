import { defineStore } from "pinia";
import { Ref, ref } from "vue";

interface IUserInfo {
    id: string|number
    name: string
    avatar?: string
}

export const useUserInfo = defineStore('userInfo', () => {
  let data: Ref<IUserInfo | {}> = ref({});
  return { data };
});
