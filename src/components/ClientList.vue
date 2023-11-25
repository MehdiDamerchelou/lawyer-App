<template>
  <q-card class="bg-transparent no-shadow">
    <q-card-section class="q-pa-none">
      <div class="q-mr-xl row reverse">
        <q-card-section
          class="text-h5 col justify-start q-pa-none row q-mr-xl q-pr-xl text-weight-bold"
        >
          لیست موکلان
        </q-card-section>
        <q-card-section class="q-py-none justify-center row col items-center">
          <router-link :to="{ path: '/AddClient' }">
            <q-btn icon="add" label="افزودن موکل" class="q-px-sm" />
          </router-link>
        </q-card-section>
      </div>
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
              <q-card
                v-for="(item, index1) in data"
                :key="index1"
                class="column col-5 justify-center q-pa-none q-ma-sm bg-grey-7"
              >
                <router-link
                  :to="{
                    path: '/ComplaintList',
                    query: { id: item.userID },
                  }"
                  class="col column"
                >
                  <q-card-section
                    class="row col reverse justify-center q-pa-sm"
                  >
                    <div class="col text-h5">
                      {{ item.firstName }} {{ item.familyName }}
                    </div>
                  </q-card-section>
                  <q-card-section
                    class="row col reverse justify-center q-pa-sm text-body1"
                  >
                    <div class="col">کد ملی</div>
                    <div class="col">{{ item.nationalCode }}</div>
                  </q-card-section>
                </router-link>
                <q-separator></q-separator>
                <q-card-actions align="center">
                  <q-btn flat
                    ><router-link
                      :to="{
                        path: '/AddComplaint',
                        query: { id: item.userID },
                      }"
                      ><q-card-section
                        class="q-pl-sm text-center row reverse items-center q-pa-none"
                        ><q-icon name="add" class="col" size="30px"></q-icon>
                        شکایت</q-card-section
                      >
                    </router-link></q-btn
                  >
                </q-card-actions>
              </q-card>
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
