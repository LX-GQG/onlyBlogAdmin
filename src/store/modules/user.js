// import { set } from 'lodash';
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
    id: 'user',
    state: () => ({
        token: '',
        userInfo: {},
    }),
    getters: {
        getToken(){
          return this.token
        },
        getUserInfo() {
          return this.userInfo
        }
    },
    actions: {
      setToken(token) {
        this.token = token;
      },
      setUserInfo(userInfo) {
        this.userInfo = userInfo;
      }
    },
});