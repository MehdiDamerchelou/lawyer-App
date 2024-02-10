<template>
  <q-card class="bg-transparent column col no-shadow">
    <div class="text-h5 row justify-center rtl">
      جستجو براساس متن : {{ searchText }}
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
        <q-card-section
          v-if="mainData.length > 0"
          class="row justify-center q-pa-none"
        >
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
                <div class="col">موکل</div>
                <div class="col">
                  {{ item.User[0].firstName }} {{ item.User[0].familyName }}
                </div>
              </q-card-section>
              <q-card-section
                class="row col reverse justify-center q-pa-none text-body1"
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
                class="row col reverse justify-center q-pa-none text-body1"
              >
                <div class="col">تاریخ</div>
                <div class="col">
                  {{ toPersianDate(item.datePresence) }}
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
        <q-card-section v-else class="text-h5"
          ><q-icon name="close" color="red" size="40px" /> اطلاعاتی وجود ندارد
          <q-icon name="close" color="red" size="40px"
        /></q-card-section>
      </q-scroll-area>
    </q-card-section>
    <q-dialog
      v-model="paymentDialog.open"
      persistent
      full-height
      full-width
      class="column"
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card class="column col img1 text-white">
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
        </div>
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
        </div> </q-card
    ></q-dialog>
  </q-card>
</template>

<script>
import { exportText } from 'src/api/service/exportService';
import { toPersianDate } from 'src/helper/convert-AD-to-solar';
import { onBeforeMount, ref } from 'vue';
import ShowComplaint from 'src/components/ShowComplaint.vue';
import InfoComplaintId from './InfoComplaintId.vue';
export default {
  name: 'infoTextId',
  components: { ShowComplaint, InfoComplaintId },
  props: {
    searchText: String,
  },
  setup(props) {
    const mainData = ref([]);
    const paymentDialog = ref({ open: false, value: '' });
    const myFile = ref();
    const searchtext = props.searchText;
    const noData = ref(false);
    onBeforeMount(async () => {
      if (searchtext == undefined) {
        return;
      }
      await exportText(searchtext).then((response) => {
        mainData.value = response;
        console.log(mainData.value);
        if (response.length == 0) {
          noData.value = true;
        }
      });
    });

    return {
      paymentDialog,
      mainData,
      searchtext,
      toPersianDate,
      myFile,
    };
  },
};
</script>

<style></style>
