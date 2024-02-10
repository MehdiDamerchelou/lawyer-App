<template>
  <q-card class="bg-transparent no-shadow">
    <q-card-section class="q-pa-none">
      <q-card-section
        class="reverse q-pa-none row justify-center text-h5 text-weight-bold"
      >
        <div class="row justify-center col-6 reverse q-mr-xl q-pr-xl">
          <q-card-section class="q-py-none q-mr-xl">
            لیست شکایات
          </q-card-section>
        </div>
        <q-card-section class="q-py-none row">
          <router-link
            :to="{ path: '/AddComplaint', query: { id: $route.query.id } }"
          >
            <q-btn icon="add" label="افزودن شکایت" class="q-px-sm" />
          </router-link>
        </q-card-section>
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
              <q-card
                v-for="(item, index1) in data"
                :key="index1"
                class="col-5 bg-grey-7 column radius q-mt-sm q-mx-xs"
              >
                <router-link
                  :to="{
                    path: '/FileList',
                    query: { id: item.codeDescriptionComplaint },
                  }"
                  class="col column"
                >
                  <q-card-section
                    class="row col justify-center q-py-sm text-h5"
                  >
                    {{ item.titleDescriptionComplaint }}
                  </q-card-section>
                  <q-card-section
                    class="row col reverse justify-center q-pa-sm text-body1"
                  >
                    <div class="col">نتیجه</div>
                    <div class="col">
                      {{
                        item.complaintResult == 'check'
                          ? 'درحال برسی'
                          : item.complaintResult == 'win'
                          ? 'برنده'
                          : item.complaintResult == 'lose'
                          ? 'بازنده'
                          : item.complaintResult == 'draw'
                          ? 'مساوی'
                          : ''
                      }}
                    </div>
                  </q-card-section>
                </router-link>
                <q-separator></q-separator>
                <q-card-actions align="center">
                  <q-btn flat
                    ><router-link
                      :to="{
                        path: '/AddFile',
                        query: { id: item.codeDescriptionComplaint },
                      }"
                      ><q-card-section
                        class="q-pl-sm text-center row reverse items-center q-pa-none"
                        ><q-icon name="add" class="col" size="30px"></q-icon>
                        پرونده</q-card-section
                      >
                    </router-link></q-btn
                  >
                  <q-btn flat>
                    <router-link
                      :to="{
                        path: '/payments',
                        query: { id: item.codeDescriptionComplaint },
                      }"
                      ><q-card-section
                        class="q-pl-sm text-center row reverse items-center q-pa-none"
                        ><q-icon name="add" class="col" size="30px"></q-icon>
                        پرداختی</q-card-section
                      >
                    </router-link></q-btn
                  >
                </q-card-actions>
              </q-card>
            </q-card-section>
            <q-card-section v-if="noData" class="text-h5"
              ><q-icon name="close" color="red" size="40px" /> شکایتی وجود ندارد
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
import { defineComponent, onBeforeMount, onMounted, ref } from 'vue';
import { getComplaint } from 'src/api/service/complaintService';
import { getOneClient } from 'src/api/service/clientService';
import { useRouter } from 'vue-router';
export default defineComponent({
  name: 'ComplaintList',
  components: {},
  setup() {
    const $router = useRouter();
    const mainData = ref([]);
    const spin = ref(true);
    const noData = ref(false);
    const id = ref();
    const user = ref();
    onBeforeMount(async () => {
      if (typeof $router.currentRoute.value.query.id === 'string') {
        let newId = $router.currentRoute.value.query.id;
        let res: [] = await getOneClient(newId);
        id.value = res.nationalCode;
      }
    });

    onMounted(async () => {
      if (typeof $router.currentRoute.value.query.id === 'string') {
        let res: [] = await getComplaint(
          $router.currentRoute.value.query.id,
          0,
          6
        );

        if (res.length > 0) {
          mainData.value.push(res);
        }
      }
    });
    async function onLoad(index: any, done: any) {
      setTimeout(async () => {
        if (spin.value == false) {
          return;
        }
        let res: [] = await getComplaint(
          id.value,
          mainData.value.length * 6,
          6
        );
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
      onLoad,
      noData,
      user,
      mainData,
    };
  },
});
</script>
<style lang="scss"></style>
