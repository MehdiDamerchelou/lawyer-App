<template>
  <q-card
    v-if="radioVal == 'payment'"
    class="bg-transparent column col no-shadow"
  >
    <div class="text-h5 row justify-center">
      پرداختی ها براساس تاریخ از
      {{ date.from.length > 0 ? date.from : 'اول' }} تا
      {{ date.to.length > 0 ? date.to : 'الان' }}
    </div>
    {{ console.log(mainData) }}
    <q-card-section class="text-center row col justify-center">
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
      >
        <q-card-section class="row justify-center q-pa-none">
          <q-card-section
            v-for="(item, index1) in mainData"
            :key="index1"
            class="column col-5 q-pa-none q-ma-sm"
          >
            <div class="col text-center column bg-grey-7 radius">
              <q-card-section
                class="row col reverse justify-center q-pa-sm text-body1"
              >
                <div class="col">شماره شکایت</div>
                <div class="col">
                  {{ item.codeDescriptionComplaint }}
                </div>
              </q-card-section>
              <q-card-section
                class="row col reverse justify-center q-pa-sm text-body1"
              >
                <div class="col">میزان پرداختی</div>
                <div class="col">
                  {{ item.price }}
                </div>
              </q-card-section>
              <q-card-section
                class="row col reverse justify-center q-pa-sm text-body1"
              >
                <div class="col">تاریخ پرداخت</div>
                <div class="col">
                  {{ toPersianDate(item.date) }}
                </div>
              </q-card-section>
              <q-card-section
                class="row col reverse justify-center q-pa-sm q-pb-md text-body1"
              >
                <q-btn
                  label="عکس ها"
                  @click="
                    paymentDialog = true;
                    myFile = item;
                  "
                />
              </q-card-section>
            </div>
          </q-card-section>
        </q-card-section>
        <q-card-section v-if="noData" class="text-h5"
          ><q-icon name="close" color="red" size="40px" /> پرداختی وجود ندارد
          <q-icon name="close" color="red" size="40px"
        /></q-card-section>
      </q-scroll-area>
    </q-card-section>
    <q-dialog
      v-model="paymentDialog"
      persistent
      full-height
      full-width
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card class="bg-grey-9 column text-white">
        <q-card-actions align="right" class="text-teal">
          <q-icon
            name="close"
            color="white"
            class="cursor-pointer"
            size="50px"
            v-close-popup
          />
        </q-card-actions>
        <q-card-section class="row col justify-center q-pa-none">
          <q-card-section class="q-pa-none col column">
            <q-card-section class="row col column q-pa-none justify-center">
              <q-card-section class="q-pa-sm row justify-center"
                >مبلغ {{ myFile.price }} برای کاربر
                {{ myFile.nationalCodeUser }} برای شماره شکایت
                {{ myFile.codeDescriptionComplaint }}</q-card-section
              >
              <div class="row col justify-center">
                <q-carousel
                  swipeable
                  ref="carousel"
                  animated
                  infinite
                  v-model="slide"
                  control-color="red"
                  class="bg-grey-9 col-7 radius"
                  transition-prev="slide-right"
                  transition-next="slide-left"
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
                          !fullscreen ? 'max-width: 50vw' : 'max-width: 70vw'
                        "
                        :src="'http://127.0.0.1:3000/download/' + data"
                        spinner-color="white"
                      />
                      <div
                        class="row justify-center q-mt-md text-white text-h6"
                      >
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
                    <q-carousel-control
                      position="bottom-left"
                      :offset="[18, 18]"
                    >
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
              </div>
            </q-card-section> </q-card-section
        ></q-card-section>
      </q-card>
    </q-dialog>
  </q-card>

  <q-card
    v-if="radioVal == 'eventscase'"
    class="bg-transparent column col no-shadow"
  >
    <div class="text-h5 row justify-center">
      وقایع پرونده براساس تاریخ از
      {{ date.from.length > 0 ? date.from : 'اول' }} تا
      {{ date.to.length > 0 ? date.to : 'الان' }}
    </div>

    <q-card-section class="text-center row col justify-center">
      <q-scroll-area
        class="col-6 q-mt-sm radius q-px-md"
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
      >
        <q-card-section class="row justify-center q-pa-none">
          <q-card-section
            v-for="(item, index1) in mainData"
            :key="index1"
            class="column col-5 q-pa-none q-ma-sm"
          >
            <div class="col text-center column bg-grey-7 radius">
              <q-card-section class="row col justify-center q-py-sm text-h5">
                {{ item.codeCase }}
              </q-card-section>
              <q-card-section
                class="row col reverse justify-center q-pa-sm text-body1"
              >
                <div class="col">تاریخ ثبت</div>
                <div class="col">
                  {{ toPersianDate(item.dateRecord) }}
                </div>
              </q-card-section>
              <q-card-section
                class="row col reverse justify-center q-pa-sm text-body1"
              >
                <div class="col">تاریخ حضور</div>
                <div class="col">
                  {{ toPersianDate(item.dateDo) }}
                </div>
              </q-card-section>
              <q-card-section
                class="row col reverse justify-center q-px-sm q-pt-none text-body1"
              >
                <div class="col">
                  <q-btn
                    @click="
                      paymentDialog = true;
                      myFile = item;
                    "
                    label="جزئیات"
                  />
                </div>
              </q-card-section>
            </div>
          </q-card-section>
        </q-card-section>
        <q-card-section v-if="noData" class="text-h5"
          ><q-icon name="close" color="red" size="40px" /> وافعه ای وجود ندارد
          <q-icon name="close" color="red" size="40px"
        /></q-card-section>
      </q-scroll-area>
    </q-card-section>
    <q-dialog
      v-model="paymentDialog"
      persistent
      full-height
      full-width
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card class="bg-grey-9 column text-white">
        <q-card-actions align="right" class="text-teal">
          <q-icon
            name="close"
            color="white"
            class="cursor-pointer"
            size="50px"
            v-close-popup
          />
        </q-card-actions>
        <q-card-section class="row col justify-center q-pa-none">
          <q-card-section class="q-pa-none col column">
            <q-card-section class="column col q-pa-none justify-center">
              <q-card-section class="q-pa-sm row justify-center">
                شمماره پرونده {{ myFile.codeCase }}</q-card-section
              >
              <div class="row col justify-center">
                <q-carousel
                  swipeable
                  ref="carousel"
                  animated
                  infinite
                  v-model="slide"
                  control-color="red"
                  class="bg-grey-9 col-7 radius"
                  transition-prev="slide-right"
                  transition-next="slide-left"
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
                          !fullscreen ? 'max-width: 34vw' : 'max-width: 70vw'
                        "
                        :src="'http://127.0.0.1:3000/download/' + data"
                        spinner-color="white"
                      />
                      <div
                        class="row justify-center q-mt-md text-white text-h6"
                      >
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
                    <q-carousel-control
                      position="bottom-left"
                      :offset="[18, 18]"
                    >
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
              </div>
            </q-card-section>
            <q-card-section class="col-4 q-pa-none q-pt-sm row justify-center">
              <q-card-section
                class="radius br-white column q-pa-none q-mb-sm col-7"
              >
                <div class="q-pr-xl q-pl-none q-pt-none">
                  <div class="row col-3 justify-center">
                    <q-card-section
                      class="col q-pb-none q-pt-sm q-pl-none row justify-end text-h6"
                      >تاریخ حضور
                    </q-card-section>
                    <q-card-section
                      class="col q-pb-none q-pt-sm row q-pr-xl q-pl-none justify-end text-h6"
                      >تاریخ ثبت</q-card-section
                    >
                  </div>
                  <div class="row col-3 justify-center">
                    <q-card-section
                      class="col q-py-none q-pl-none row justify-center text-h6"
                      >{{ toPersianDate(myFile.dateDo) }}</q-card-section
                    >
                    <q-card-section
                      class="col q-py-none row q-pr-xl q-pl-none justify-center text-h6"
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
          </q-card-section></q-card-section
        >
      </q-card>
    </q-dialog>
  </q-card>

  <q-card
    v-if="radioVal == 'Complaint'"
    class="bg-transparent column col no-shadow"
  >
    <div class="text-h5 row justify-center">
      شکایت ها براساس تاریخ از {{ date.from.length > 0 ? date.from : 'اول' }} تا
      {{ date.to.length > 0 ? date.to : 'الان' }}
    </div>

    <q-card-section class="text-center row col justify-center">
      <q-scroll-area
        class="col-6 q-mt-sm radius q-px-md"
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
      >
        <q-card-section class="row justify-center q-pa-none">
          <q-card-section
            v-for="(item, index1) in mainData"
            :key="index1"
            class="column col-5 q-pa-none q-ma-sm"
          >
            <div class="col text-center column bg-grey-7 radius">
              <q-card-section class="row col justify-center q-py-sm text-h5">
                {{ item.titleDescriptionComplaint }}
              </q-card-section>
              <q-card-section
                class="row col reverse justify-center q-pa-none text-body1"
              >
                <div class="col">نام موکل</div>
                <div class="col">
                  {{ item.users[0].firstName }} {{ item.users[0].familyName }}
                </div>
              </q-card-section>
              <q-card-section
                class="row col reverse justify-center q-pa-none text-body1"
              >
                <div class="col">شماره شکایت</div>
                <div class="col">
                  {{ item.codeDescriptionComplaint }}
                </div>
              </q-card-section>
              <q-card-section
                class="row col reverse justify-center q-pa-none text-body1"
              >
                <div class="col">کد ملی</div>
                <div class="col">
                  {{ item.nationalCodeUser }}
                </div> </q-card-section
              ><q-card-section
                class="row col reverse justify-center q-pa-none text-body1"
              >
                <div class="col">تاریخ</div>
                <div class="col">
                  {{ toPersianDate(item.datePresence) }}
                </div>
              </q-card-section>
              <q-card-section
                class="row col reverse justify-center q-pa-none q-pb-sm text-body1"
              >
                <div class="col">نتیجه</div>
                <div class="col">
                  {{
                    item.complaintResult == 'check'
                      ? 'درحال برسی'
                      : item.complaintResult == 'win'
                      ? 'پیروز'
                      : item.complaintResult == 'lsoe'
                      ? 'بازنده'
                      : item.complaintResult == 'draw'
                      ? 'مساوی'
                      : ''
                  }}
                </div>
              </q-card-section>
              <q-card-section
                class="row col reverse justify-center q-pt-none q-px-sm text-body1"
              >
                <div class="col">
                  <q-btn
                    @click="
                      paymentDialog.open = true;
                      paymentDialog.value = 'complaint';
                      myFile = item.codeDescriptionComplaint;
                    "
                    label="جزئیات"
                  />
                </div>
                <div class="col">
                  <q-btn
                    @click="
                      paymentDialog.open = true;
                      paymentDialog.value = 'payment';
                      myFile = item.codeDescriptionComplaint;
                    "
                    label="پرداختی"
                  />
                </div>
              </q-card-section>
            </div>
          </q-card-section>
        </q-card-section>
        <q-card-section v-if="noData" class="text-h5"
          ><q-icon name="close" color="red" size="40px" /> شکایتی وجود ندارد
          <q-icon name="close" color="red" size="40px"
        /></q-card-section>
      </q-scroll-area>
    </q-card-section>
    <q-dialog
      v-model="paymentDialog.open"
      persistent
      full-height
      full-width
      transition-show="scale"
      transition-hide="scale"
      ><q-card class="column col img1 text-white">
        <div class="column col" v-if="paymentDialog.value == 'payment'">
          <div class="text-h5 row">
            <q-card-section class="q-pa-none q-py-md row justify-center col">
              <div class="column justify-center">پرداختی شکایت</div>
            </q-card-section>
            <q-card-section class="q-pa- row justify-end">
              <q-icon
                name="close"
                size="50px"
                class="cursor-pointer"
                v-close-popup
              />
            </q-card-section>
          </div>
          <InfoComplaintId
            class="col"
            :complaintId="myFile"
            :radio="'payment'"
          />
        </div>
        <div class="column col" v-if="paymentDialog.value == 'complaint'">
          <div class="text-h5 row">
            <q-card-section class="q-pa-none q-py-md row justify-center col">
              <div class="column justify-center">اطلاعات شکایت</div>
            </q-card-section>
            <q-card-section class="q-pa- row justify-end">
              <q-icon
                name="close"
                size="50px"
                class="cursor-pointer"
                v-close-popup
              />
            </q-card-section>
          </div>
          <ShowComplaint class="col" :newId="myFile" />
        </div> </q-card
    ></q-dialog>
  </q-card>
</template>

<script>
import { dateExport } from 'src/api/service/exportService';
import { toADDate, toPersianDate } from 'src/helper/convert-AD-to-solar';
import { defineComponent, onBeforeMount, ref } from 'vue';
import ShowComplaint from '../ShowComplaint.vue';
import InfoComplaintId from './InfoComplaintId.vue';

export default defineComponent({
  name: 'InfoDate',
  components: { ShowComplaint, InfoComplaintId },
  props: {
    radio: {},
    newDate: {},
  },
  setup(props) {
    const mainData = ref([]);
    const paymentDialog = ref({ open: false, value: '' });
    const date = props.newDate;
    const slide = ref(1);
    const radioVal = props.radio;
    const noData = ref(false);
    onBeforeMount(async () => {
      await getNewData();
    });

    async function getNewData() {
      let from = date.from.length > 0 ? toADDate(date.from) : undefined;
      let to = date.to.length > 0 ? toADDate(date.to) : undefined;

      let res = await dateExport(from, to, radioVal);
      console.log(mainData.value);
      if (res.length > 0) {
        mainData.value = res;
      } else {
        if (mainData.value.length == 0) {
          noData.value = true;
        }
      }
    }

    return {
      paymentDialog,
      myFile: ref(),
      slide,
      fullscreen: ref(false),
      mainData,
      date,
      noData,
      radioVal,
      toPersianDate,
    };
  },
});
</script>
<style lang="scss">
.br-white {
  border: 1px solid white;
}
</style>
