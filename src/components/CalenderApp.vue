<template>
  <q-card class="bg-transparent no-shadow">
    <q-card-section class="text-h5 q-pa-sm text-weight-bold">
      <q-card-section
        class="reverse q-pa-none row justify-between text-h5 text-weight-bold"
      >
        <q-card-section class="q-py-none col"> تقویم کاری </q-card-section>
        <q-card-section class="col reverse q-pa-none">
          <q-btn
            class="text-body1 bg-grey"
            @click="
              async () => {
                dialog = true;
                alarms = await getAlarm().then((respone) => {
                  myAlarm = respone[0];
                  return respone;
                });
              }
            "
            label="هشدارهای کاری"
          />
        </q-card-section>
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
    <q-card-section class="column q-pa-none">
      <q-card-section class="row justify-center q-mt-md q-pa-none">
        <q-card-section class="row col-6 q-pa-none reverse">
          <q-card-section class="col q-pa-none">
            <q-date
              dir="rtl"
              v-model="alarmDate.val"
              calendar="persian"
              class="bg-grey-4"
              color="orange"
              text-color="black"
              today-btn
            />
          </q-card-section>
          <q-card-section class="col column q-pa-none">
            <q-card-section class="row justify-center q-pa-none">
              <q-input
                color="orange"
                suffix="تاریخ"
                readonly
                filled
                class="col"
                v-model="alarmDate.val"
                mask="date"
                :rules="[
                  (val) =>
                    convertSolarToAD(val) > convertSolarToAD(nowSolar) ||
                    'تاریخ ورودی باید بعد از امروز باشه',
                ]"
              />
            </q-card-section>
            <q-card-section class="row justify-center q-pa-none q-mt-sm">
              <q-input
                color="orange"
                v-model="reason.val"
                class="custom-area q-pa-none col"
                input-class="text-right"
                placeholder="شرح شکوایه"
                filled
                :rules="[
                  (val) =>
                    val.length <= 255 ||
                    'حداکثر تعداد ورودی ها باید کمتر از 255 کاراکتر باشد',
                ]"
                row="10"
                type="textarea"
              />
            </q-card-section>
            <q-card-section class="row justify-center q-pa-none q-mt-sm">
              <q-btn
                :disable="isDisabled"
                label="افزودن"
                @click="create(alarmDate.val, reason.val)"
                color="grey-5"
                class="text-weight-bold q-px-xl text-black text-body1"
              />
            </q-card-section>
          </q-card-section>
        </q-card-section>
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
          <q-card-section class="q-pa-none text-h4 col row justify-center">
            هشدارهای شما
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
        <div class="row justify-center col">
          <q-card-section
            class="row justify-center reverse col-10"
            v-if="alarms.length > 0"
          >
            <q-card-section class="col column q-ml-sm q-pa-none">
              <q-card-section class="col column q-pa-none">
                <div class="row col q-mb-md q-mt-sm justify-center">
                  <q-scroll-area
                    class="col text-right bg-grey-8 text-whit radius"
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
                  >
                    <q-list bordered separator>
                      <q-item
                        v-for="(data, index) in alarms"
                        :key="index"
                        clickable
                        v-ripple
                        @click="myAlarm = data"
                      >
                        <q-item-section>
                          <div class="column">
                            <div class="row justify-end text-h6">
                              {{ convertADToSolar(data.reminderCustomDate) }}
                            </div>
                            <div class="row justify-start col text-grey-3 item">
                              {{ data.descriptionTitle }}
                            </div>
                          </div></q-item-section
                        >
                      </q-item></q-list
                    ></q-scroll-area
                  >
                </div>
              </q-card-section>
            </q-card-section>
            <q-card-section class="col q-mr-sm column q-pa-sm">
              <q-card-section
                class="col bg-grey-8 text-whit column q-mb-sm q-py-none radius"
                v-if="myAlarm"
              >
                <div class="row justify-center text-h5 text-weight-bold">
                  {{ convertADToSolar(myAlarm.reminderCustomDate) }}
                </div>

                <div class="row col q-mb-md q-mt-sm justify-center">
                  <q-scroll-area
                    class="col text-right text-h6"
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
                    >{{ myAlarm.descriptionTitle }}</q-scroll-area
                  >
                </div>
              </q-card-section>
            </q-card-section>
          </q-card-section>
          <q-card-section class="text-h5 q-mt-xl" v-else>
            <q-icon name="close" color="red" size="40px" />
            هشداری وجود ندارد
            <q-icon name="close" color="red" size="40px" />
          </q-card-section>
        </div>
      </q-card>
    </q-dialog>
  </q-card>
</template>

<script lang="ts">
import { useQuasar } from 'quasar';
import {
  convertADToSolar,
  convertSolarToAD,
} from 'src/helper/convert-AD-to-solar';
import { createAlarm, getAlarm } from 'src/api/service/alarmService';
import { computed, defineComponent, ref, watch } from 'vue';
import moment from 'jalali-moment';

export default defineComponent({
  name: 'CalenderApp',
  components: {},
  setup() {
    let $q = useQuasar();

    let dialog = ref(false);
    let myAlarm = ref();
    let alarms = ref([]);
    let nowSolar = ref();
    let alarmDate = ref({ val: '', status: false });
    let reason = ref({ val: '', status: false });

    let progress = ref(0.0);
    let ttp = ref(0);
    let isDisabled = computed(() => {
      if (ttp.value == 2) {
        return false;
      }
      return true;
    });
    watch(ttp, () => {
      progress.value = ttp.value * (1 / 2);
    });
    watch(alarmDate.value, () => {
      if (alarmDate.value.val.length > 0) {
        const nowAD = new Date();
        nowSolar.value = moment(nowAD, 'YYYY-MM-DD').format('jYYYY/jMM/jDD');
        if (
          convertSolarToAD(alarmDate.value.val) <=
          convertSolarToAD(nowSolar.value)
        ) {
          if (alarmDate.value.status == true) {
            alarmDate.value.status = false;
            ttp.value--;
          }
          return;
        }
        if (alarmDate.value.status == false) {
          ttp.value++;
          alarmDate.value.status = true;
        }
      } else if (alarmDate.value.status == true) {
        if (alarmDate.value.val.length == 0) {
          alarmDate.value.status = false;
          ttp.value--;
        }
      }
    });
    watch(reason.value, () => {
      if (reason.value.val.length > 0 && reason.value.val.length <= 255) {
        if (reason.value.status == false) {
          ttp.value++;
          reason.value.status = true;
        }
      } else if (reason.value.status == true) {
        if (reason.value.val.length == 0 || reason.value.val.length > 255) {
          reason.value.status = false;
          ttp.value--;
        }
      }
    });

    async function create(date: string, reas: string) {
      const converted_date = convertSolarToAD(date);

      const res = await createAlarm(converted_date, reas);

      if (res == 204) {
        $q.notify({
          message: `این مطلب برای تاریخ ${date} با موفقیت اضافه شد`,
          color: 'grey-10',
          icon: 'done',
          iconColor: 'green',
          position: 'center',
        });
      }
    }

    return {
      progress,
      dialog,
      isDisabled,
      create,
      reason,
      alarmDate,
      convertSolarToAD,
      convertADToSolar,
      nowSolar,
      getAlarm,
      myAlarm,
      alarms,
    };
  },
});
</script>
<style lang="scss" scoped>
.item {
  direction: rtl;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 550px;
}
</style>
