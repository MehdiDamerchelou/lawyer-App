<template>
  <q-card class="bg-transparent no-shadow">
    <q-card-section class="q-pa-none">
      <q-card-section
        class="reverse q-pa-none row justify-center text-h5 text-weight-bold"
      >
        <div class="row justify-center col-6 reverse q-mr-xl q-pr-xl">
          <q-card-section class="q-py-none"> لیست پرونده ها </q-card-section>
          <q-card-section v-if="complaint" class="q-py-none text-weight-medium">
            {{ complaint.titleDescriptionComplaint }}
            {{ complaint.codeDescriptionComplaint }}
          </q-card-section>
        </div>
        <q-card-section v-if="mainData.length == 0" class="q-py-none row">
          <router-link
            :to="{ path: '/AddFile', query: { id: $route.query.id } }"
          >
            <q-btn icon="add" label="افزودن پرونده" class="q-px-sm" />
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
          <q-card-section class="row justify-center q-pa-none">
            <q-card
              v-for="(item, index1) in mainData"
              :key="index1"
              class="column bg-grey-7 col-5 q-pa-none q-ma-sm"
            >
              <router-link
                :to="{ path: '/EventList', query: { id: item.codeCase } }"
                class="col column"
              >
                <q-card-section
                  class="row col justify-center q-pt-sm q-pa-none text-h6 reverse"
                >
                  <div class="col">شماره پرونده</div>
                  <div class="col">
                    {{ item.caseNumber }}
                  </div>
                </q-card-section>
                <q-card-section
                  class="row col reverse justify-center q-pa-none text-body1"
                >
                  <div class="col">تاریخ</div>
                  <div class="col">
                    {{ convertADToSolar(item.dateSet) }}
                  </div>
                </q-card-section>
                <q-card-section
                  class="row col reverse justify-center q-pa-none text-body1"
                >
                  <div class="col">شماره دادنامه</div>
                  <div class="col">
                    {{ item.petitionNumber }}
                  </div>
                </q-card-section>
                <q-card-section
                  class="row col reverse justify-center q-pa-none text-body1"
                >
                  <div class="col">شماره بایگانی</div>
                  <div class="col">
                    {{ item.branchArchiveNumber }}
                  </div>
                </q-card-section>
              </router-link>
              <q-separator></q-separator>
              <q-card-actions align="center">
                <q-btn flat
                  ><router-link
                    :to="{
                      path: '/AddFileEvent',
                      query: { id: item.codeCase },
                    }"
                    ><q-card-section
                      class="q-pl-sm text-center row reverse items-center q-pa-none"
                      ><q-icon name="add" class="col" size="30px"></q-icon>
                      وقایع</q-card-section
                    >
                  </router-link></q-btn
                >
              </q-card-actions>
            </q-card>
          </q-card-section>
          <q-card-section v-if="noData" class="text-h5"
            ><q-icon name="close" color="red" size="40px" /> پرونده ای وجود
            ندارد <q-icon name="close" color="red" size="40px"
          /></q-card-section>
        </q-scroll-area>
      </q-card-section>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, onMounted, ref } from 'vue';
import { getOneComplaint } from 'src/api/service/complaintService';
import { getFile } from 'src/api/service/fileService';
import { useRouter } from 'vue-router';
import { convertADToSolar } from 'src/helper/convert-AD-to-solar';
export default defineComponent({
  name: 'FileList',
  components: {},
  setup() {
    const $router = useRouter();
    const mainData = ref([]);
    const spin = ref(true);
    const noData = ref(false);
    const id = ref();
    const complaint = ref();
    onBeforeMount(async () => {
      if (typeof $router.currentRoute.value.query.id === 'string') {
        complaint.value = await getOneComplaint(
          $router.currentRoute.value.query.id
        );

        id.value = $router.currentRoute.value.query.id;
      }
    });

    onMounted(async () => {
      if (typeof $router.currentRoute.value.query.id === 'string') {
        let res: [] = await getFile($router.currentRoute.value.query.id, 0, 6);
        console.log(res);

        if (res.length > 0) {
          mainData.value = res;
        } else {
          noData.value = true;
        }
      }
    });

    return {
      spin,
      convertADToSolar,
      complaint,
      mainData,
      noData,
    };
  },
});
</script>
<style lang="scss"></style>
