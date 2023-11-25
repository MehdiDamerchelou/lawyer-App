<template>
  <q-layout class="row items-center justify-center">
    <q-card class="column col text-white bg-transparent no-shadow">
      <q-card-section class="row justify-center">
        <q-avatar
          size="100px"
          font-size="52px"
          color="transparent"
          text-color="black"
          icon="gavel"
      /></q-card-section>
      <q-card-section class="row justify-center">
        <q-input
          filled
          v-model="uName"
          placeholder="نام کاربری"
          class="col-6"
          color="orange"
          input-class="text-right"
        >
          <template v-slot:prepend>
            <q-icon name="person" />
          </template>
        </q-input>
      </q-card-section>
      <q-card-section class="row justify-center">
        <q-input
          filled
          v-model="pwd"
          placeholder="گذرواژه"
          class="col-6"
          color="orange"
          :type="isPwd ? 'password' : 'text'"
          input-class="text-right"
          :rules="[(val) => val.length >= 8 || 'گذرواژه باید حداقل 8 تا باشد']"
          lazy-rules
        >
          <template v-slot:prepend>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>
      </q-card-section>

      <q-card-section class="row justify-center q-mt-xl">
        <q-btn
          label="ورود"
          @click="login(uName, pwd)"
          :disable="isDisabled"
          color="grey-5"
          class="text-weight-bold q-px-xl text-black text-body1"
        />
      </q-card-section>
    </q-card>
    <q-dialog
      v-model="dialog"
      persistent
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card class="bg-grey-8 text-white" style="min-width: 400px">
        <q-card-section>
          <div class="text-h6 text-right">Persistent</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          نام کاربری یا گذرواژه نادرست است
        </q-card-section>

        <q-card-actions align="left" class="text-white">
          <q-btn flat label="باشه" class="text-h6" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import { useAuth } from 'src/stores/authintication';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
export default defineComponent({
  name: 'IndexPage',
  components: {},
  setup() {
    let $q = useQuasar();
    let uName = ref('');
    let pwd = ref('');
    let isPwd = ref(true);
    let dialog = ref(false);
    const authStore = useAuth();
    const $route = useRouter();

    const isDisabled = computed(() => {
      if (uName.value.length == 0 || pwd.value.length < 8) {
        return true;
      }
      return false;
    });

    async function login(username: string, password: string) {
      const { login } = authStore;
      const res = await login(username, password);
      if (res == undefined) {
        $q.notify({
          message: 'به سرور دسترسی ندارید',
          color: 'grey-10',
          icon: 'close',
          iconColor: 'red',
          position: 'center',
        });
        return;
      }
      if (res.accessToken) {
        $route.push('/AddClient');
      }
      if (res == 401) {
        $q.notify({
          message: 'گذرواژه یا نام کاربری شما اشتباه است',
          color: 'grey-10',
          icon: 'error',
          iconColor: 'red',
          position: 'center',
        });
      }
    }
    return { uName, isDisabled, pwd, isPwd, dialog, login };
  },
});
</script>
<style lang="scss"></style>
