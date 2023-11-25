<template>
  <q-card class="bg-transparent no-shadow">
    <q-card-section class="q-pa-sm">
      <q-card-section
        class="reverse q-pa-none row justify-center text-h5 text-weight-bold"
      >
        <q-card-section class="q-py-none"> افزودن شرح شکایت </q-card-section>
        <q-card-section v-if="user" class="q-py-none text-weight-medium">
          {{ user.firstName }} {{ user.familyName }}</q-card-section
        >
      </q-card-section>
      <q-card-section class="row justify-center q-pa-none q-pt-sm">
        <q-separator color="black" class="col-8" size="2px" />
      </q-card-section>
      <q-card-section class="row justify-center q-pa-none">
        <q-card-section class="col-8 q-pa-none">
          <q-linear-progress
            :value="progress"
            track-color="transparent"
            color="positive"
          />
        </q-card-section>
      </q-card-section>
    </q-card-section>
    <q-card-section class="text-right column">
      <div class="row justify-center" v-if="typeof allComplaint == 'object'">
        <div class="col-6 column" style="height: 100px">
          <div class="text-h6">سوابق شکایت فرد</div>
          <q-scroll-area
            class="col q-pr-md"
            v-if="allComplaint.descriptionComplaints.length > 0"
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
            ><q-list class="text-body1" bordered separator>
              <q-item
                v-for="(data, index) in allComplaint.descriptionComplaints"
                :key="index"
                class="text-right"
              >
                <q-item-section
                  >نتیجه :
                  {{
                    data.complaintResult == 'check'
                      ? 'درحال برسی'
                      : data.complaintResult == 'win'
                      ? 'پیروز'
                      : data.complaintResult == 'lsoe'
                      ? 'بازنده'
                      : data.complaintResult == 'draw'
                      ? 'مساوی'
                      : ''
                  }}</q-item-section
                >
                <q-item-section
                  >تاریخ :
                  {{ convertADToSolar(data.datePresence) }}</q-item-section
                >
                <q-item-section class="rtl"
                  >عنوان : {{ data.titleDescriptionComplaint }}</q-item-section
                >
              </q-item>
            </q-list>
          </q-scroll-area>
          <q-list class="text-body1" bordered v-else separator>
            <q-item class="text-right">
              <q-item-section>شکایتی وجود ندارد</q-item-section>
            </q-item>
          </q-list>
        </div>
      </div>
      <q-card-section class="row justify-center q-mt-lg q-pa-none">
        <q-card-section class="row col-6 q-pa-none reverse">
          <q-input
            color="orange"
            suffix=": کد ملی"
            filled
            v-model="nationalCode.val"
            mask="##########"
            class="col q-ml-sm"
            lazy-rules
            :rules="[(val) => val.length == 10 || 'کد ملی باید 10 رقم باشد']"
          />
          <q-input
            color="orange"
            v-model="title.val"
            filled
            input-class="q-mx-sm text-right"
            suffix=": عنوان"
            class="col q-mx-sm"
          />

          <q-input
            input-class="q-mr-sm text-right"
            suffix=": تاریخ حضور"
            readonly
            filled
            class="col q-mr-sm"
            v-model="attendance.val"
            mask="date"
          >
            <template v-slot>
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date
                  dir="rtl"
                  v-model="attendance.val"
                  calendar="persian"
                  color="orange"
                  text-color="black"
                  today-btn
                >
                  <div class="row items-center justify-end">
                    <q-btn
                      v-close-popup
                      label="تمام"
                      color="orange"
                      flat
                    ></q-btn>
                  </div>
                </q-date>
              </q-popup-proxy>
            </template>
            <template v-slot:prepend>
              <q-icon
                class="cursor-pointer"
                name="close"
                @click="attendance.val = ''"
                color="orange"
              />
            </template>
          </q-input>
        </q-card-section>
      </q-card-section>
      <q-card-section class="row justify-center q-mt-md q-pa-none">
        <q-card-section class="row col-6 q-pa-none reverse">
          <q-input
            color="orange"
            v-model="reason.val"
            class="custom-area col"
            input-class="text-right"
            placeholder="شرح شکوایه :"
            filled
            row="10"
            type="textarea"
          />
        </q-card-section>
      </q-card-section>
      <q-card-section class="row justify-center q-mt-md q-pa-none">
        <q-card-section class="row col-6 justify-center q-pa-none reverse">
          <q-btn
            :disable="isDisabled"
            label="افزودن"
            @click="
              create(nationalCode.val, title.val, attendance.val, reason.val)
            "
            color="grey-5"
            class="text-weight-bold q-px-xl text-black text-body1"
          />
        </q-card-section>
      </q-card-section>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { useQuasar } from 'quasar';

import { computed, defineComponent, onBeforeMount, ref, watch } from 'vue';
import { createComplaint } from 'src/api/service/complaintService';
import {
  convertADToSolar,
  convertSolarToAD,
} from 'src/helper/convert-AD-to-solar';
import { useRouter } from 'vue-router';
import { getOneClient } from 'src/api/service/clientService';
import { nCodeExport } from 'src/api/service/exportService';

export default defineComponent({
  name: 'AddComplaint',
  components: {},
  setup() {
    let $q = useQuasar();
    let $router = useRouter();
    let attendance = ref({ val: '', status: false });
    let reason = ref({ val: '', status: false });
    let nationalCode = ref({ val: '', status: false });
    let title = ref({ val: '', status: false });
    let progress = ref(0.0);
    let ttp = ref(0);
    const user = ref();
    const allComplaint = ref();
    onBeforeMount(async () => {
      if (typeof $router.currentRoute.value.query.id === 'string') {
        user.value = await getOneClient($router.currentRoute.value.query.id);
        nationalCode.value.val = user.value.nationalCode;
        allComplaint.value = await nCodeExport(
          user.value.nationalCode,
          'Complaint'
        );
        console.log(allComplaint.value);
      }
    });

    let isDisabled = computed(() => {
      if (ttp.value == 4) {
        return false;
      }
      return true;
    });
    watch(ttp, () => {
      progress.value = ttp.value * (1 / 4);
    });
    watch(nationalCode.value, () => {
      if (typeof $router.currentRoute.value.query.id === 'string') {
        if (nationalCode.value.status == false) {
          ttp.value++;
          nationalCode.value.status = true;
        }
        return;
      }
      if (nationalCode.value.val.length == 10) {
        if (nationalCode.value.status == false) {
          ttp.value++;
          nationalCode.value.status = true;
        }
      } else if (nationalCode.value.status == true) {
        if (nationalCode.value.val.length < 10) {
          nationalCode.value.status = false;
          ttp.value--;
        }
      }
    });
    watch(attendance.value, () => {
      if (attendance.value.val.length > 0) {
        if (attendance.value.status == false) {
          ttp.value++;
          attendance.value.status = true;
        }
      } else if (attendance.value.status == true) {
        if (attendance.value.val.length == 0) {
          attendance.value.status = false;
          ttp.value--;
        }
      }
    });
    watch(reason.value, () => {
      if (reason.value.val.length > 0) {
        if (reason.value.status == false) {
          ttp.value++;
          reason.value.status = true;
        }
      } else if (reason.value.status == true) {
        if (reason.value.val.length == 0) {
          reason.value.status = false;
          ttp.value--;
        }
      }
    });
    watch(title.value, () => {
      if (title.value.val.length > 0) {
        if (title.value.status == false) {
          ttp.value++;
          title.value.status = true;
        }
      } else if (title.value.status == true) {
        if (title.value.val.length == 0) {
          title.value.status = false;
          ttp.value--;
        }
      }
    });

    async function create(
      nationalC: string,
      titl: string,
      pDate: string,
      why: string
    ) {
      const converted_date = convertSolarToAD(pDate);
      if (
        typeof $router.currentRoute.value.query.id === 'string' &&
        nationalCode.value.val.length < 10
      ) {
        nationalC = user.value.nationalCode;
      }
      const res = await createComplaint(nationalC, titl, converted_date, why);
      if (res == 400) {
        $q.notify({
          message: 'اطلاعات وارد شده شما نادرست است',
          color: 'grey-10',
          icon: 'error',
          iconColor: 'red',
          position: 'center',
        });
      }
      if (res == 204) {
        $q.notify({
          message: `${titl} برای کد ملی ${nationalC} با موفقیت اضافه شد`,
          color: 'grey-10',
          icon: 'done',
          iconColor: 'green',
          position: 'center',
        });
        nationalCode.value = { val: '', status: false };
        attendance.value = { val: '', status: false };
        reason.value = { val: '', status: false };
        title.value = { val: '', status: false };
      }
    }
    return {
      progress,
      isDisabled,
      create,
      reason,
      user,
      attendance,
      title,
      nationalCode,
      convertADToSolar,
      allComplaint,
    };
  },
});
</script>
<style lang="scss">
.custom-area .q-field__native {
  min-height: 120px;
  max-height: 120px;
}
</style>
