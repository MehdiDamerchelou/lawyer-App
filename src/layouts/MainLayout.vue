<template>
  <q-layout>
    <q-card-section class="column" style="height: 100vh">
      <q-tab-panels
        v-model="tab"
        animated
        transition-prev="slide-left"
        transition-next="slide-right"
        class="bg-grey-7 col radius text-black text-center"
      >
        <q-tab-panel name="AddClient">
          <q-page-container>
            <router-view />
          </q-page-container>
        </q-tab-panel>
        <q-tab-panel name="AddComplaint">
          <q-page-container>
            <router-view />
          </q-page-container>
        </q-tab-panel>
        <q-tab-panel name="payments">
          <q-page-container>
            <router-view />
          </q-page-container>
        </q-tab-panel>
        <q-tab-panel name="Calender">
          <q-page-container>
            <router-view />
          </q-page-container>
        </q-tab-panel>
        <q-tab-panel name="clientList">
          <q-page-container>
            <router-view />
          </q-page-container>
        </q-tab-panel>
        <q-tab-panel name="info">
          <q-page-container>
            <router-view />
          </q-page-container>
        </q-tab-panel>
      </q-tab-panels>
      <q-tabs
        v-model="tab"
        align="center"
        indicator-color="orange-10"
        narrow-indicator
        class="full-width q-mt-lg"
      >
        <router-link class="q-mx-lg" :to="{ path: '/AddClient' }">
          <q-tab
            class="text-black col radius q-px-xl bg-grey-6"
            name="AddClient"
          >
            <q-card-section class="column">
              <q-icon name="person_add" size="60px" />
              افزودن موکل
            </q-card-section>
          </q-tab>
        </router-link>

        <router-link class="q-mx-lg" :to="{ path: '/AddComplaint' }">
          <q-tab
            class="text-black col radius q-px-xl bg-grey-6"
            name="AddComplaint"
          >
            <q-card-section class="column">
              <q-icon name="assignment" size="60px" /> شرح شکایت
            </q-card-section>
          </q-tab>
        </router-link>

        <router-link class="q-mx-lg" :to="{ path: '/payments' }">
          <q-tab
            class="text-black col radius q-px-xl bg-grey-6"
            name="payments"
          >
            <q-card-section class="column">
              <q-icon name="payments" size="60px" /> پرداخت مالی
            </q-card-section>
          </q-tab>
        </router-link>

        <router-link class="q-mx-lg" :to="{ path: '/Calender' }">
          <q-tab
            class="text-black col radius q-px-xl bg-grey-6"
            name="Calender"
          >
            <q-card-section class="column">
              <q-icon name="calendar_month" size="60px" />
              تقویم کاری
            </q-card-section>
          </q-tab>
        </router-link>

        <router-link class="q-mx-lg" :to="{ path: '/Clientlist' }">
          <q-tab
            class="text-black col radius q-px-xl bg-grey-6"
            name="clientList"
          >
            <q-card-section class="column">
              <q-icon name="group" size="60px" />
              لیست موکلان
            </q-card-section>
          </q-tab>
        </router-link>

        <router-link class="q-mx-lg" :to="{ path: '/info' }">
          <q-tab class="text-black col radius q-px-xl bg-grey-6" name="info">
            <q-card-section class="column">
              <q-icon name="info" size="60px" />
              گزارشات
            </q-card-section>
          </q-tab>
        </router-link>
      </q-tabs>
    </q-card-section>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import faIR from 'quasar/lang/fa-IR';
import { Quasar } from 'quasar';

export default defineComponent({
  name: 'MainLayout',

  components: {},

  setup() {
    Quasar.lang.set(faIR);
    let tab: any = ref('AddClient');
    onMounted(() => {
      if (typeof localStorage.getItem('tab') === 'string') {
        // tab.value = useRouter().currentRoute.value.name;
        // console.log(useRouter().currentRoute.value.name);
      }
    });
    watch(tab, () => {
      localStorage.setItem('tab', tab.value);
    });
    return { tab };
  },
});
</script>
<style lang="scss">
.bg-grey-7 {
  background-color: #6a6a6a94 !important;
}
.bg-grey-6 {
  background-color: #d9d9d965 !important;
}
</style>
