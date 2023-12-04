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
          <q-radio color="orange" v-model="shape" val="qdate" label="تاریخ" />
          <q-radio
            color="orange"
            v-model="shape"
            val="nationalId"
            label="کد ملی"
          />
          <q-radio
            color="orange"
            v-model="shape"
            val="nameId"
            label=" نام و نام خانوادگی"
          />
          <q-radio
            color="orange"
            v-model="shape"
            val="TextId"
            label=" متن مورد نظر"
          />
        </q-card-section>

        <q-card-section
          v-if="shape === 'nationalId'"
          class="row q-mt-md justify-center q-pa-none"
        >
          <q-card-section class="row col-6 q-pa-none reverse">
            <q-select
              filled
              @input-value="setValue"
              :model-value="nationalId"
              use-input
              hide-selected
              fill-input
              suffix="کد ملی"
              input-debounce="0"
              :options="codes"
              class="col"
              color="orange"
              max-values="3"
            >
              <template v-slot:no-option>
                <q-item v-if="codes.length == 0 && nationalId.length >= 3">
                  <q-item-section class="text-grey">
                    نتیجه ای یافت نشد
                  </q-item-section>
                </q-item>
                <q-item v-if="codes.length == 0 && nationalId.length < 3">
                  <q-item-section class="text-grey">
                    حداقل سه رقم وارد کنید
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </q-card-section>
        </q-card-section>

        <q-card-section
          v-if="shape === 'TextId'"
          class="row q-my-md justify-center q-pa-none"
        >
          <q-card-section class="row col-6 q-mb-xs q-pa-none reverse">
            <q-input
              color="orange"
              input-class="text-right"
              placeholder="  براساس متن مورد نظر شما در مورد ‍‍‍‍‍‍  شکایت ها"
              filled
              v-model="TextId"
              class="col"
            />
          </q-card-section>
        </q-card-section>

        <q-card-section
          v-if="shape === 'nameId'"
          class="row q-mt-md justify-center q-mb-md q-pa-none"
        >
          <q-card-section class="row col-6 q-mb-xs q-pa-none reverse">
            <q-select
              filled
              @input-value="setName"
              v-model="nameId"
              use-input
              emit-value
              hide-selected
              fill-input
              input-class="text-right q-mr-sm"
              suffix="نام"
              input-debounce="0"
              :options="codes"
              class="col"
              color="orange"
              max-values="2"
            >
              <template v-slot:no-option>
                <q-item v-if="codes.length == 0 && nameId.length >= 2">
                  <q-item-section class="text-grey">
                    نتیجه ای یافت نشد
                  </q-item-section>
                </q-item>
                <q-item v-if="codes.length == 0 && nameId.length < 2">
                  <q-item-section class="text-grey">
                    حداقل دو حرف وارد کنید
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
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
            >
              <template v-slot>
                <q-popup-proxy
                  cover
                  class="bg-transparent no-shadow"
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
              </template>
              <template v-slot:prepend>
                <q-icon
                  class="cursor-pointer"
                  name="close"
                  @click="date.from = ''"
                  color="orange"
                />
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
            >
              <template v-slot>
                <q-popup-proxy
                  cover
                  class="bg-transparent no-shadow"
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
              </template>
              <template v-slot:prepend>
                <q-icon
                  class="cursor-pointer"
                  name="close"
                  @click="date.to = ''"
                  color="orange"
                />
              </template>
            </q-input>
          </q-card-section>
        </q-card-section>

        <q-card-section
          v-if="shape === 'Description'"
          class="row q-mt-md q-mb-md justify-center q-pa-none"
        >
          <q-card-section class="row col-6 q-pa-none q-mb-xs reverse">
            <q-select
              filled
              @input-value="setComplaint"
              :model-value="description"
              use-input
              hide-selected
              fill-input
              suffix="کد شکایت"
              input-debounce="0"
              :options="codes"
              class="col"
              color="orange"
              max-values="3"
            >
              <template v-slot:no-option>
                <q-item v-if="codes.length == 0 && description.length >= 3">
                  <q-item-section class="text-grey">
                    نتیجه ای یافت نشد
                  </q-item-section>
                </q-item>
                <q-item v-if="codes.length == 0 && description.length < 3">
                  <q-item-section class="text-grey">
                    حداقل سه رقم وارد کنید
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </q-card-section>
        </q-card-section>

        <q-card-section class="row justify-center text-grey-9">
          <q-radio
            color="orange"
            v-model="radio"
            v-if="shape != 'TextId'"
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
            v-if="shape != 'TextId'"
            val="payment"
            label="پرداختی ها"
          />
        </q-card-section>
        <q-card-section class="row q-mt-md justify-center q-pa-none">
          <q-card-section class="row col-6 justify-center q-pa-none reverse">
            <q-btn
              label="جستجو کن"
              color="grey-5"
              @click="getDate()"
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

            <InfoNameFamily
              class="col"
              v-if="shape == 'nameId'"
              :newName="sendName"
              :newFamily="familyId"
              :radio="radio"
            />

            <InfoTextId
              class="col"
              v-if="shape == 'TextId'"
              :searchText="TextId"
            />
          </q-card-section>
        </q-card>
      </q-dialog>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue';
import { convertSolarToAD } from 'src/helper/convert-AD-to-solar';
import InfoDate from 'src/components/export-components/InfoDate.vue';
import InfoNationalCode from 'src/components/export-components/InfoNationalCode.vue';
import InfoComplaintId from 'src/components/export-components/InfoComplaintId.vue';
import InfoNameFamily from 'src/components/export-components/infoNameFamily.vue';
import InfoTextId from 'src/components/export-components/infoTextId.vue';
import {
  searchComplaintCode,
  searchName,
  searchNationalCode,
} from 'src/api/service/searchService';
export default defineComponent({
  name: 'ExportInfo',
  components: {
    InfoDate,
    InfoNationalCode,
    InfoComplaintId,
    InfoNameFamily,
    InfoTextId,
  },
  setup() {
    const nationalId = ref('');
    const shape = ref('TextId');
    const radio = ref('payment');
    const date = ref({ from: '', to: '' });
    const description = ref('');
    const dialog = ref(false);
    const res = ref({ data: [], what: '' });
    const nameId = ref('');
    const sendName = ref('');
    const familyId = ref('');
    const TextId = ref('');
    const codes = ref([]);

    watch(nationalId, async () => {
      if (nationalId.value.length >= 3) {
        codes.value = await searchNationalCode(nationalId.value);
      } else {
        codes.value = [];
      }
    });
    watch(description, async () => {
      if (description.value.length >= 3) {
        codes.value = await searchComplaintCode(description.value);
      } else {
        codes.value = [];
      }
    });
    watch(nameId, async () => {
      if (nameId.value.length >= 2) {
        codes.value = await searchName(nameId.value, familyId.value);
      } else {
        codes.value = [];
      }
    });

    const isDisabled = computed(() => {
      if (
        shape.value == 'nationalId' &&
        nationalId.value.length == 10 &&
        nationalId.value == codes.value[0]
      ) {
        return false;
      }
      if (
        (shape.value == 'qdate' && date.value.to.length > 0) ||
        (shape.value == 'qdate' && date.value.from.length > 0)
      ) {
        return false;
      }
      if (
        shape.value == 'Description' &&
        description.value.length == 12 &&
        description.value == codes.value[0]
      ) {
        return false;
      }
      if (shape.value == 'TextId' && TextId.value.length > 0) {
        return false;
      }

      if (shape.value == 'nameId' && nameId.value.length > 0) {
        return false;
      }
      return true;
    });

    async function getDate() {
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
      nameId,
      familyId,
      TextId,
      setValue(val: string) {
        nationalId.value = val;
      },
      setComplaint(val: string) {
        description.value = val;
      },
      sendName,
      setName(val: string) {
        nameId.value = val;
        if (typeof nameId.value == 'object') {
          nameId.value = val.firstName + ' ' + val.familyName;
          sendName.value = val.firstName;
          familyId.value = val.familyName;
        }
      },
      codes,
    };
  },
});
</script>
<style lang="scss"></style>
