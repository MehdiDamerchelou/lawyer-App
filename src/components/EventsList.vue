<template>
  <q-card class="bg-transparent no-shadow">
    <q-card-section class="q-pa-none">
      <q-card-section
        class="reverse q-pa-none row justify-center text-h5 text-weight-bold"
      >
        <div class="row justify-center col-6 reverse q-mr-xl q-pr-xl">
          <q-card-section class="q-py-none"> لیست وقایع </q-card-section>
          <q-card-section v-if="file" class="q-py-none text-weight-medium">
            {{ file.codeCase }}
          </q-card-section>
        </div>
        <q-card-section class="q-py-none row">
          <router-link
            :to="{ path: '/AddFileEvent', query: { id: $route.query.id } }"
          >
            <q-btn icon="add" label="افزودن واقعه" class="q-px-sm" />
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
                class="column bg-grey-7 col-5 q-pa-none q-ma-sm"
              >
                <div class="col column q-pa-md">
                  <q-card-section
                    class="row col reverse justify-center q-pa-none text-body1"
                  >
                    <div class="col">تاریخ ثبت</div>
                    <div class="col">
                      {{ toPersianDate(item.dateRecord) }}
                    </div>
                  </q-card-section>
                  <q-card-section
                    class="row col reverse justify-center q-pa-none text-body1"
                  >
                    <div class="col">تاریخ حضور</div>
                    <div class="col">
                      {{ toPersianDate(item.dateDo) }}
                    </div>
                  </q-card-section>
                </div>
                <q-separator></q-separator>
                <q-card-actions align="center">
                  <q-btn
                    @click="
                      async () => {
                        dialog = true;
                        myFile = item;
                      }
                    "
                    flat
                  >
                    <q-card-section
                      class="q-pl-sm text-center row reverse items-center q-pa-none"
                    >
                      دیدن جزئیات</q-card-section
                    >
                  </q-btn>
                </q-card-actions>
              </q-card>
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
      <q-card class="bg-grey- back-image column">
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
                swipeable
                ref="carousel"
                animated
                infinite
                v-model="slide"
                control-color="red"
                class="bg-grey-9 col-8 column radius"
                transition-prev="slide-right"
                transition-next="slide-left"
                v-if="myFile.fileImage.length > 0"
                v-model:fullscreen="fullscreen"
              >
                <q-carousel-slide
                  v-for="(data, index) in myFile.fileImage"
                  :key="index"
                  :name="index + 1"
                  ><div class="col column items-center">
                    <q-img
                      class="col radius"
                      :style="
                        !fullscreen ? 'max-width: 38vw' : 'max-width: 70vw'
                      "
                      :src="'http://127.0.0.1:3000/download/' + data"
                      spinner-color="white"
                    />
                    <div class="row justify-center q-mt-md text-white text-h6">
                      {{ index + 1 }} / {{ myFile.fileImage.length }}
                    </div>
                  </div></q-carousel-slide
                >
                <template v-slot:control>
                  <q-carousel-control
                    position="bottom-right"
                    :offset="[18, 18]"
                    class="q-gutter-xs"
                  >
                    <q-btn
                      push
                      round
                      dense
                      color="orange"
                      text-color="black"
                      icon="arrow_left"
                      @click="$refs.carousel.previous()"
                    />
                    <q-btn
                      push
                      round
                      dense
                      color="orange"
                      text-color="black"
                      icon="arrow_right"
                      @click="$refs.carousel.next()"
                    />
                  </q-carousel-control>
                  <q-carousel-control position="bottom-left" :offset="[18, 18]">
                    <q-btn
                      push
                      round
                      dense
                      color="orange"
                      text-color="black"
                      :icon="fullscreen ? 'fullscreen_exit' : 'fullscreen'"
                      @click="fullscreen = !fullscreen"
                    />
                  </q-carousel-control>
                </template>
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
                      >{{ toPersianDate(myFile.dateDo) }}</q-card-section
                    >
                    <q-card-section
                      class="col q-pt-none row q-pr-xl q-pl-none justify-center text-h6"
                      >{{ toPersianDate(myFile.dateRecord) }}</q-card-section
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
import { getEvent } from 'src/api/service/caseEventService';
import { useRouter } from 'vue-router';
import { toPersianDate } from 'src/helper/convert-AD-to-solar';
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
      toPersianDate,
      onLoad,
      file,
      mainData,
      noData,
      dialog,
      myFile,
      fullscreen: ref(false),
    };
  },
});
</script>
<style lang="scss"></style>
