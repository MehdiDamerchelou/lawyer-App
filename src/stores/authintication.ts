import { defineStore } from 'pinia';
import { login, refreshToken } from 'src/api/service/authService';
import { useRouter } from 'vue-router';

export const useAuth = defineStore('auth', {
  state: () => ({
    isLoggined: false,
  }),
  actions: {
    async login(uName: string, pwd: string) {
      // uName = '4312064083';
      // pwd = '09913064701';
      const res = await login(uName, pwd);
      if (res == undefined) {
        return undefined;
      }
      if (res.accessToken) {
        this.isLoggined = true;
      }

      return res;
    },

    async refreshToken() {
      const $route = useRouter();
      const res = await refreshToken();

      if (res == 401) {
        $route.push({ name: 'login' });
        return;
      }
      return res;
    },
  },
});
