<template>
  <q-card
    v-if="radioVal == 'payment'"
    class="bg-transparent column col no-shadow"
  >
    <div class="text-h5 row justify-center">
      پرداختی ها براساس کد ملی {{ user.firstName }}
    </div>
    <q-card-section class="col-1 q-pa-none column">
      <q-card-section class="">
        <q-btn color="grey-10" label="دانلود تمام دیتا ها" />
      </q-card-section>
    </q-card-section>
    <q-card-section class="row col justify-center">
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
        style="height: 500px"
      >
        <q-infinite-scroll @load="onLoad" :offset="100">
          <q-card-section
            v-for="(data, index) in mainData.finaneialPayments"
            :key="index"
            class="row justify-center q-pa-none"
          >
            <q-card-section
              v-for="(item, index1) in data"
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
                  <div class="col">میزان پرداختی</div>
                  <div class="col">
                    {{ item.price }}
                  </div>
                </q-card-section>
                <q-card-section
                  class="row col reverse justify-center q-pa-none text-body1"
                >
                  <div class="col">تاریخ پرداخت</div>
                  <div class="col">
                    {{ convertADToSolar(item.date) }}
                  </div>
                </q-card-section>
              </div>
            </q-card-section>
          </q-card-section>
          <q-card-section v-if="noData" class="text-h5"
            ><q-icon name="close" color="red" size="40px" /> پرداختی وجود ندارد
            <q-icon name="close" color="red" size="40px"
          /></q-card-section>
          <template v-slot:loading v-if="spin">
            <div class="row justify-center q-my-md">
              <q-spinner-dots color="orange" size="40px" />
            </div>
          </template>
        </q-infinite-scroll>
      </q-scroll-area>
    </q-card-section>
  </q-card>
  <q-card
    v-if="radioVal == 'Complaint'"
    class="bg-transparent column col no-shadow"
  >
    <div class="text-h5 row justify-center">
      شکایت ها براساس کد ملی {{ mainData.firstName }}
    </div>
    <q-card-section class="col-1 q-pa-none column">
      <q-card-section class="">
        <q-btn color="grey-10" label="دانلود تمام دیتا ها" />
      </q-card-section>
    </q-card-section>
    <q-card-section class="row col justify-center">
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
        style="height: 500px"
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
              <div class="col text-center column bg-grey-7 radius">
                <q-card-section class="row col justify-center q-py-sm text-h5">
                  {{ item.titleDescriptionComplaint }}
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
              </div>
            </q-card-section>
          </q-card-section>
          <q-card-section v-if="noData" class="text-h5"
            ><q-icon name="close" color="red" size="40px" /> شکایتی وجود ندارد
            <q-icon name="close" color="red" size="40px"
          /></q-card-section>
          <template v-slot:loading v-if="spin">
            <div class="row justify-center q-my-md">
              <q-spinner-dots color="orange" size="40px" />
            </div>
          </template>
        </q-infinite-scroll>
      </q-scroll-area>
    </q-card-section>
  </q-card>
</template>

<script>
import { nCodeExport } from 'src/api/service/exportService';
import { convertADToSolar } from 'src/helper/convert-AD-to-solar';
import { defineComponent, onMounted, ref } from 'vue';

export default defineComponent({
  name: 'InfoNationalCode',
  components: {},
  props: {
    radio: {},
    nCode: {},
  },
  setup(props) {
    const mainData = ref([]);
    const user = ref();
    const nCode = props.nCode;
    const radioVal = props.radio;
    const spin = ref(true);
    const noData = ref(false);
    onMounted(async () => {
      await getNewData();
    });

    async function getNewData() {
      if (spin.value == false) {
        return;
      }
      let res = await nCodeExport(
        nCode,
        mainData.value.length * 10,
        10,
        radioVal
      );
      if (res.length < 10) {
        spin.value = false;
      }
      if (res.length > 0) {
        mainData.value = res.finaneialPayments;
        user.value = res;
      } else {
        if (mainData.value.length == 0) {
          noData.value = true;
          spin.value = false;
        }
      }
    }
    async function onLoad(index, done) {
      setTimeout(async () => {
        await getNewData();
        done();
      }, 1000);
    }

    return { mainData, spin, onLoad, user, noData, radioVal, convertADToSolar };
  },
});
</script>
