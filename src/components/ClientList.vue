<template>
  <q-card class="bg-transparent no-shadow">
    <q-card-section class="q-pa-none">
      <q-card-section class="text-h5 text-weight-bold q-pa-sm">
        لیست موکلان
      </q-card-section>
      <q-card-section class="row justify-center q-pa-none q-pt-sm">
        <q-separator color="black" class="col-8" size="2px" />
      </q-card-section>

      <q-card-section class="row justify-center">
        <q-scroll-area
          class="col-6 q-mt-sm q-px-md"
          :thumb-style="{
            right: '4px',
            borderRadius: '5px',
            backgroundColor: 'orange',
            width: '5px',
            opacity: '0.75',
          }"
          :bar-style="{
            right: '2px',
            borderRadius: '9px',
            backgroundColor: 'black',
            width: '9px',
            opacity: '0.2',
          }"
          :visible="true"
          style="height: 400px"
        >
          <q-infinite-scroll @load="onLoad" :offset="100">
            <q-card-section
              v-for="(data, index) in mainData"
              :key="index"
              class="row justify-center q-pa-none"
            >
              <q-card-section
                v-for="(item, index1) in data"
                :key="index1"
                class="column col-5 q-pa-none q-ma-sm"
              >
                <router-link
                  :to="{
                    path: '/ComplaintList',
                    query: { id: item.nationalCode },
                  }"
                  class="col-8 column bg-grey-7 radius"
                >
                  <q-card-section
                    class="row col justify-center q-py-sm text-h5"
                  >
                    {{ item.firstName }} {{ item.familyName }}
                  </q-card-section>
                  <q-card-section
                    class="row col reverse justify-center q-pa-none text-body1"
                  >
                    <div class="col">کد ملی</div>
                    <div class="col">{{ item.nationalCode }}</div>
                  </q-card-section>
                </router-link>
                <q-card-section class="col-2 q-pa-none row justify-center">
                  <router-link
                    :to="{
                      path: '/AddComplaint',
                      query: { id: item.userID },
                    }"
                    class="col-6 bg-grey-7 radius q-mt-sm"
                    ><q-card-section class="q-py-sm text-center"
                      ><q-icon name="add" size="30px"></q-icon>افزودن
                      شکایت</q-card-section
                    >
                  </router-link>
                </q-card-section>
              </q-card-section>
            </q-card-section>
            <q-card-section v-if="noData" class="text-h5"
              ><q-icon name="close" color="red" size="40px" /> موکلی وجود ندارد
              <q-icon name="close" color="red" size="40px"
            /></q-card-section>
            <template v-slot:loading v-if="spin">
              <div class="row justify-center q-my-md">
                <q-spinner-dots color="orange" size="40px" />
              </div>
            </template>
          </q-infinite-scroll>
        </q-scroll-area>
      </q-card-section>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { getClients } from 'src/api/service/clientService';
export default defineComponent({
  name: 'ClientList',
  components: {},
  setup() {
    const mainData = ref([]);
    const spin = ref(true);
    const noData = ref(false);
    onMounted(async () => {
      let res: [] = await getClients(0, 6);
      if (res.length > 0) {
        mainData.value.push(res);
      }
    });
    async function onLoad(index: any, done: any) {
      if (spin.value == false) {
        return;
      }
      setTimeout(async () => {
        let res: [] = await getClients(mainData.value.length * 6, 6);
        if (res.length < 6) {
          spin.value = false;
        }
        if (res.length > 0) {
          mainData.value.push(res);
        } else {
          if (mainData.value.length == 0) {
            noData.value = true;
            spin.value = false;
          }
        }
        done();
      }, 1000);
    }
    return {
      spin,
      noData,
      onLoad,
      mainData,
    };
  },
});
</script>
<style lang="scss"></style>
