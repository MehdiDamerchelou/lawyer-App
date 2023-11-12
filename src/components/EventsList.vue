<template>
  <q-card class="bg-transparent no-shadow">
    <q-card-section class="q-pa-none">
      <q-card-section
        class="reverse q-pa-none row justify-between text-h5 text-weight-bold"
      >
        <q-card-section class="q-py-none col"> لیست وقایع </q-card-section>
        <q-card-section v-if="file" class="q-py-none col-2 text-weight-medium">
          {{ file.codeCase }}
        </q-card-section>
        <q-card-section class="col row justify-center reverse q-pa-none">
          <q-btn
            color="grey-10"
            class="cursor-pointer col-2 text-body1"
            size="15px"
          >
            دیدن متهمین
            <q-menu fit anchor="bottom left" class="text-right" self="top left">
              <q-item
                :class="index % 2 == 0 ? 'bg-grey' : 'bg-grey-7'"
                v-for="(data, index) in file.accuseds"
                :key="index"
              >
                <q-item-section>{{ data }}</q-item-section>
              </q-item>
              <q-item class="bg-grey" v-if="file.accuseds.length == 0">
                <q-item-section>متهمی وجود ندارد</q-item-section>
              </q-item>
            </q-menu></q-btn
          >
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
              <q-card-section
                v-for="(item, index1) in data"
                :key="index1"
                class="column col-5 q-pa-none q-ma-sm"
              >
                <div class="col column bg-grey-7 radius">
                  <q-card-section
                    class="row col justify-center q-pt-sm q-pa-none text-h6 reverse"
                  >
                    <div class="col">
                      {{ item.eventTitle }}
                    </div>
                  </q-card-section>
                  <q-card-section
                    class="row col reverse justify-center q-pa-none text-body1"
                  >
                    <div class="col">تاریخ ثبت</div>
                    <div class="col">
                      {{ convertADToSolar(item.dateRecord) }}
                    </div>
                  </q-card-section>
                  <q-card-section
                    class="row col reverse justify-center q-pa-none text-body1"
                  >
                    <div class="col">تاریخ حضور</div>
                    <div class="col">
                      {{ convertADToSolar(item.dateDo) }}
                    </div>
                  </q-card-section>
                </div>
                <q-card-section class="col-2 q-pa-none row justify-center">
                  <div
                    @click="
                      dialog = true;
                      myFile = item;
                    "
                    class="col-6 bg-grey-7 radius q-mt-sm cursor-pointer"
                  >
                    <q-card-section class="q-py-sm text-center">
                      دیدن جزئیات</q-card-section
                    >
                  </div>
                </q-card-section>
              </q-card-section>
            </q-card-section>
            <q-card-section v-if="noData" class="text-h5"
              ><q-icon name="close" color="red" size="40px" /> واقعه ای وجود
              ندارد <q-icon name="close" color="red" size="40px"
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
    <q-dialog
      v-model="dialog"
      maximized
      full-height
      full-width
      persistent
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card class="bg-grey column">
        <q-card-section class="row col-1">
          <q-card-section class="q-pa-none text-h5 col row justify-center">
            {{ myFile.codeCase }} شماره پرونده
          </q-card-section>
          <q-card-section class="q-pa-none row justify-end">
            <q-icon
              name="close"
              size="50px"
              class="cursor-pointer"
              v-close-popup
            />
          </q-card-section>
        </q-card-section>
        <q-card-section class="row justify-center col">
          <q-card-section class="col-6 column q-pa-none">
            <q-card-section class="col column q-pa-none">
              <q-carousel
                animated
                v-model="slide"
                infinite
                arrows
                control-color="red"
                class="col-7 bg-grey-9 radius"
                transition-prev="slide-right"
                transition-next="slide-left"
                v-if="myFile.fileImage.length > 0"
              >
                <q-carousel-slide
                  v-for="(data, index) in myFile.fileImage"
                  :key="index"
                  :name="index + 1"
                  :img-src="'http://192.168.1.13:3000/download/' + data"
                />
              </q-carousel>
              <q-card-section
                v-else
                class="text-white column col-7 bg-grey-9 radius"
              >
                <div class="col row justify-end q-mr-xl q-pr-xl q-mt-xl">
                  <q-icon name="error" size="90px" color="red" />
                </div>
                <div class="col row q-ml-xl q-pl-xl q-m-xl text-h3">
                  متاسفانه عکسی وجود ندارد
                </div>
              </q-card-section>
              <q-card-section class="column col q-pa-none">
                <div class="q-pr-xl q-pl-none q-pt-none">
                  <div class="row col-3 justify-center">
                    <q-card-section
                      class="col q-pb-none q-pl-none row justify-end text-h6"
                      >تاریخ حضور
                    </q-card-section>
                    <q-card-section
                      class="col q-pb-none row q-pr-xl q-pl-none justify-end text-h6"
                      >تاریخ ثبت</q-card-section
                    >
                  </div>
                  <div class="row col-3 justify-center">
                    <q-card-section
                      class="col q-pt-none q-pl-none row justify-center text-h6"
                      >{{ convertADToSolar(myFile.dateDo) }}</q-card-section
                    >
                    <q-card-section
                      class="col q-pt-none row q-pr-xl q-pl-none justify-center text-h6"
                      >{{ convertADToSolar(myFile.dateRecord) }}</q-card-section
                    >
                  </div>
                </div>
                <div class="q-mr-lg text-weight-bold text-right text-h6">
                  شرح واقعه
                </div>
                <div class="row col q-mb-md q-mt-sm justify-center">
                  <q-scroll-area
                    class="col text-right q-pr-lg"
                    :visible="true"
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
                    >{{ myFile.descriptionEvent }}</q-scroll-area
                  >
                </div>
              </q-card-section>
            </q-card-section>
          </q-card-section>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-card>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, onMounted, ref } from 'vue';
import { getOneEvent } from 'src/api/service/caseEventService';
import { getEvent } from 'src/api/service/caseEventService';
import { useRouter } from 'vue-router';
import { convertADToSolar } from 'src/helper/convert-AD-to-solar';
import { getOneFile } from 'src/api/service/fileService';
export default defineComponent({
  name: 'EventList',
  components: {},
  setup() {
    const $router = useRouter();
    const mainData = ref([]);
    const slide = ref(1);
    const myFile = ref([]);
    const spin = ref(true);
    const noData = ref(false);
    const dialog = ref(false);
    const id = ref();
    const file = ref();
    onBeforeMount(async () => {
      if (typeof $router.currentRoute.value.query.id === 'string') {
        file.value = await getOneFile($router.currentRoute.value.query.id);
        console.log(file.value);
        id.value = $router.currentRoute.value.query.id;
      }
    });

    onMounted(async () => {
      if (typeof $router.currentRoute.value.query.id === 'string') {
        let res: [] = await getEvent($router.currentRoute.value.query.id, 0, 6);

        if (res.length > 0) {
          mainData.value.push(res);
        }
      }
    });
    async function onLoad(index: any, done: any) {
      if (spin.value == false) {
        return;
      }
      setTimeout(async () => {
        let res: [] = await getEvent(id.value, mainData.value.length * 6, 6);
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
      slide,
      convertADToSolar,
      onLoad,
      file,
      mainData,
      noData,
      dialog,
      myFile,
    };
  },
});
</script>
<style lang="scss"></style>
