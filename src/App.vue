<template>
  <router-view />
</template>

<script lang="ts">
import { defineComponent, onBeforeMount } from 'vue';
import { useAuth } from './stores/authintication';

export default defineComponent({
  name: 'App',
  setup() {
    onBeforeMount(async () => {
      const myStore = useAuth();
      const tt: string | null = localStorage.getItem('authentication');
      if (tt === null) {
        return 401;
      }
      if (tt == undefined) {
        return;
      }

      const { refreshToken } = myStore;

      await refreshToken().then(() => {
        setInterval(async () => {
          await refreshToken();
        }, 4 * 60 * 1000);
      });
    });
    return {};
  },
});
</script>
