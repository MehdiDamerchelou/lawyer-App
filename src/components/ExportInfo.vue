<template>
  <q-card class="bg-transparent no-shadow">
    <q-card-section class="text-h5 q-pa-sm text-weight-bold">
      گزارشات
      <q-card-section class="row justify-center q-pa-none q-pt-sm">
        <q-separator color="black" class="col-8" size="2px" />
      </q-card-section>
      <q-card-section class="column">
        <q-card-section class="q-gutter-sm">
          <q-radio
            color="orange"
            v-model="shape"
            val="Description"
            label="کد شرح شکایت "
          />
          <q-radio
            color="orange"
            v-model="shape"
            val="qdate"
            label="بر  اساس تاریخ "
          />
          <q-radio
            color="orange"
            v-model="shape"
            val="nationalId"
            label="  بر اساس کد ملی"
          />
        </q-card-section>

        <q-card-section
          v-if="shape === 'nationalId'"
          class="row q-mt-md justify-center q-pa-none"
        >
          <q-card-section class="row col-6 q-pa-none reverse">
            <q-input
              color="orange"
              input-class="text-right"
              placeholder=" کد ملی "
              filled
              mask="##########"
              v-model="nationalId"
              class="col"
              :rules="[(val) => val.length == 10 || 'کد ملی باید 10 رقم باشد']"
            />
          </q-card-section>
        </q-card-section>

        <q-card-section
          class="row q-mt-md justify-center q-pa-none"
          v-if="shape === 'qdate'"
        >
          <q-card-section class="row col-6 q-pa-none reverse">
            <q-input
              color="orange"
              input-class="q-mr-sm text-right"
              suffix="از این تاریخ "
              readonly
              filled
              class="col"
              v-model="date.from"
              mask="date"
              :rules="['date']"
            >
              <template v-slot:prepend>
                <q-icon name="event" color="orange" class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date
                      dir="rtl"
                      v-model="date.from"
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
                </q-icon>
              </template>
            </q-input>
            <q-input
              color="orange"
              input-class="q-mr-sm text-right"
              suffix="  تا این تاریخ"
              readonly
              filled
              class="col q-mr-md"
              v-model="date.to"
              mask="date"
              :rules="[
                (val) =>
                  date.from.length > 0 ||
                  'تاریخ اول را وارد کنید بعد تاریخ دوم را وارد کنید',
                (val) =>
                  convertSolarToAD(val) > convertSolarToAD(date.from) ||
                  'تاریخ دوم باید از تاریخ اول جلو تر باشد',
              ]"
            >
              <template v-slot:prepend>
                <q-icon name="event" color="orange" class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date
                      dir="rtl"
                      v-model="date.to"
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
                </q-icon>
              </template>
            </q-input>
          </q-card-section>
        </q-card-section>

        <q-card-section
          v-if="shape === 'Description'"
          class="row q-mt-md q-mb-md justify-center q-pa-none"
        >
          <q-card-section class="row col-6 q-pa-none q-mb-xs reverse">
            <q-input
              color="orange"
              input-class="text-right"
              placeholder=" کد شرح شکایت"
              filled
              mask="#"
              reverse-fill-mask
              v-model="description"
              class="col"
            />
          </q-card-section>
        </q-card-section>

        <q-card-section class="row justify-center text-grey-9">
          <q-radio
            color="orange"
            v-model="radio"
            val="Complaint"
            label="  شکایت ها "
          />
          <q-radio
            color="orange"
            v-model="radio"
            v-if="shape == 'qdate'"
            val="eventscase"
            class="q-mx-lg"
            label="وقایع پرونده ها"
          />
          <q-radio
            color="orange"
            v-model="radio"
            val="payment"
            label="پرداختی ها"
          />
        </q-card-section>
        <q-card-section class="row q-mt-md justify-center q-pa-none">
          <q-card-section class="row col-6 justify-center q-pa-none reverse">
            <q-btn
              label="جستجو کن"
              color="grey-5"
              @click="getDate(shape)"
              class="text-weight-bold q-px-xl text-black text-body1"
              :disable="isDisabled"
            />
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
            <q-card-section class="q-pa-none col row justify-end">
              <q-icon
                name="close"
                size="50px"
                class="cursor-pointer"
                v-close-popup
              />
            </q-card-section>
          </q-card-section>
          <q-card-section class="column col">
            <InfoDate
              class="col"
              :newDate="date"
              :radio="radio"
              v-if="shape == 'qdate'"
            />
            <InfoNationalCode
              class="col"
              :nCode="nationalId"
              :radio="radio"
              v-if="shape == 'nationalId'"
            />
            <InfoComplaintId
              class="col"
              :complaintId="description"
              :radio="radio"
              v-if="shape == 'Description'"
            />
          </q-card-section>
        </q-card>
      </q-dialog>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import { convertSolarToAD } from 'src/helper/convert-AD-to-solar';
import InfoDate from 'src/components/export-components/InfoDate.vue';
import InfoNationalCode from 'src/components/export-components/InfoNationalCode.vue';
import InfoComplaintId from 'src/components/export-components/InfoComplaintId.vue';
export default defineComponent({
  name: 'ExportInfo',
  components: { InfoDate, InfoNationalCode, InfoComplaintId },
  setup() {
    const nationalId = ref('');
    const shape = ref('nationalId');
    const radio = ref('payment');
    const date = ref({ from: '', to: '' });
    const description = ref('');
    const dialog = ref(false);
    const res = ref({ data: [], what: '' });

    const isDisabled = computed(() => {
      if (shape.value == 'nationalId' && nationalId.value.length == 10) {
        return false;
      }
      if (
        shape.value == 'qdate' &&
        date.value.to.length > 0 &&
        date.value.from.length > 0
      ) {
        if (convertSolarToAD(date.value.to) > convertSolarToAD(date.value.from))
          return false;
        return true;
      }
      if (shape.value == 'Description' && description.value.length > 0) {
        return false;
      }
      return true;
    });

    async function getDate(shapeVal: string) {
      dialog.value = true;

      return;
    }
    return {
      getDate,
      radio,
      nationalId,
      shape,
      isDisabled,
      description,
      res,
      date,
      dialog,
      convertSolarToAD,
    };
  },
});
</script>
<style lang="scss"></style>
