<template>
  <q-card
    v-if="radioVal == 'payment'"
    class="bg-transparent column col no-shadow"
  >
    <div
      dir="rtl"
      v-if="typeof mainData == 'object'"
      class="text-h5 row justify-center"
    >
      پرداختی ها براساس نام و نام خانوادگی
      {{ mainData.firstName }} {{ mainData.familyName }}
    </div>

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
        v-if="typeof mainData == 'object'"
      >
        <q-card-section class="row justify-center q-pa-none">
          <q-card-section
            v-for="(item, index1) in mainData.finaneialPayments"
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
                  {{ convertADToSolar(item.date) }}
                </div>
              </q-card-section>
              <q-card-section
                class="row col reverse justify-center q-pt-none q-px-sm text-body1"
              >
                <div class="col">
                  <q-btn
                    @click="
                      dialog.open = true;
                      dialog.value = 'payment';
                      myFile = item;
                    "
                    label="عکس ها"
                  />
                </div>
                <div class="col">
                  <q-btn
                    @click="
                      dialog.open = true;
                      dialog.value = 'complaint';
                      myFile = item.codeDescriptionComplaint;
                    "
                    label="جزئیات شکایت"
                  />
                </div>
              </q-card-section>
            </div>
          </q-card-section>
        </q-card-section>
        <q-card-section
          v-if="mainData.finaneialPayments.length == 0"
          class="text-h5"
          ><q-icon name="close" color="red" size="40px" /> پرداختی وجود ندارد
          <q-icon name="close" color="red" size="40px"
        /></q-card-section>
      </q-scroll-area>
    </q-card-section>
    <q-dialog
      v-model="dialog.open"
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
          <q-card-section
            v-if="dialog.value == 'payment'"
            class="q-pa-none col column"
          >
            <q-card-section class="col column justify-center">
              <q-card-section class="q-pa-sm row justify-center"
                >مبلغ {{ myFile.price }} برای کاربر
                {{ myFile.nationalCodeUser }} برای شماره شکایت
                {{ myFile.codeDescriptionComplaint }}</q-card-section
              >
              <q-carousel
                swipeable
                ref="carousel"
                animated
                infinite
                v-model="slide"
                control-color="red"
                class="bg-grey-9 col radius"
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
                      :src="'http://192.168.1.22:3000/download/' + data"
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
            </q-card-section>
          </q-card-section>
          <q-card-section
            v-if="dialog.value == 'complaint'"
            class="q-pa-none col column"
          >
            <q-card-section class="col column justify-center">
              <q-card-section class="q-pa-sm row justify-center"
                >اطلاعات شکایت</q-card-section
              >
              <ShowComplaint class="col" :newId="myFile" />
            </q-card-section>
          </q-card-section>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-card>

  <q-card
    v-if="radioVal == 'Complaint'"
    class="bg-transparent column col no-shadow"
  >
    <div class="text-h5 row justify-center" v-if="typeof mainData == 'object'">
      شکایت ها براساس نام و نام خانوادگی {{ mainData.firstName }}
      {{ mainData.familyName }}
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
        v-if="typeof mainData == 'object'"
      >
        <q-card-section class="row justify-center q-pa-none">
          <q-card-section
            v-for="(item, index1) in mainData.descriptionComplaints"
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
                  {{ convertADToSolar(item.datePresence) }}
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
                      dialog.open = true;
                      dialog.value = 'complaint';
                      myFile = item.codeDescriptionComplaint;
                    "
                    label="جزئیات"
                  />
                </div>
                <div class="col">
                  <q-btn
                    @click="
                      dialog.open = true;
                      dialog.value = 'payment';
                      myFile = item.codeDescriptionComplaint;
                    "
                    label="پرداختی"
                  />
                </div>
              </q-card-section>
            </div>
          </q-card-section>
        </q-card-section>
        <q-card-section
          v-if="mainData.descriptionComplaints.length == 0"
          class="text-h5"
          ><q-icon name="close" color="red" size="40px" /> شکایتی وجود ندارد
          <q-icon name="close" color="red" size="40px"
        /></q-card-section>
      </q-scroll-area>
    </q-card-section>
    <q-dialog
      v-model="dialog.open"
      persistent
      full-height
      full-width
      transition-show="scale"
      transition-hide="scale"
      ><q-card class="column col img1 text-white">
        <div class="column col" v-if="dialog.value == 'payment'">
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
        <div class="column col" v-if="dialog.value == 'complaint'">
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
import { onBeforeMount, ref } from 'vue';
import { exportName } from 'src/api/service/exportService';
import { convertADToSolar } from 'src/helper/convert-AD-to-solar';
import InfoComplaintId from 'components/export-components/InfoComplaintId.vue';
import ShowComplaint from 'components/ShowComplaint.vue';
export default {
  name: 'infoNameFamily',
  props: {
    newName: String,
    newFamily: String,
    radio: String,
  },
  components: { ShowComplaint, InfoComplaintId },
  setup(props) {
    const mainData = ref();
    const name = props.newName;
    const family = props.newFamily;
    const radioVal = props.radio;
    const dialog = ref({ open: false, value: '' });

    onBeforeMount(async () => {
      if (name == undefined || family == undefined || radioVal == undefined) {
        return;
      }

      await exportName(name, family, radioVal).then((response) => {
        mainData.value = response;
        console.log(mainData.value);
      });
    });
    return {
      mainData,
      dialog,
      fullscreen: ref(false),
      myFile: ref(),
      radioVal,
      convertADToSolar,
    };
  },
};
</script>

<style></style>
