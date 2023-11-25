<template>
  <q-card class="bg-transparent no-shadow">
    <q-card-section class="text-h5 q-pa-sm text-weight-bold">
      <q-card-section
        class="reverse q-pa-none row justify-center text-h5 text-weight-bold"
      >
        <q-card-section class="q-py-none"> افزودن پرداخت مالی </q-card-section>
        <q-card-section v-if="complaint" class="q-py-none text-weight-medium">
          {{ complaint.titleDescriptionComplaint }}
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
    <q-card-section class="column">
      <q-card-section class="row justify-center q-mt-md q-pa-none">
        <q-card-section class="row col-6 q-pa-none reverse">
          <q-input
            color="orange"
            v-model="nationalCode.val"
            filled
            input-class="q-mr-sm text-right"
            suffix="کد ملی"
            mask="##########"
            class="col q-ml-md"
            lazy-rules
            :rules="[(val) => val.length == 10 || 'کد ملی باید 10 رقم باشد']"
          />
          <q-input
            color="orange"
            input-class="q-mr-sm text-right"
            suffix="کد شرح شکایت"
            filled
            class="col q-mr-md"
            v-model="complaintCode.val"
          />
        </q-card-section>
      </q-card-section>
      <q-card-section class="row justify-center q-mt-md q-pa-none">
        <q-card-section class="row col-6 q-pa-none reverse">
          <q-input
            color="orange"
            v-model="price.val"
            filled
            input-class="q-mr-sm text-right"
            suffix="میزان پرداختی"
            mask="###"
            reverse-fill-mask
            class="col q-ml-md"
          />

          <q-input
            color="orange"
            input-class="q-mr-sm text-right"
            suffix="تاریخ"
            readonly
            filled
            class="col row q-mr-md"
            v-model="date.val"
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
                  color="orange"
                  dir="rtl"
                  v-model="date.val"
                  class=""
                  calendar="persian"
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
                @click="date.val = ''"
                color="orange"
              />
            </template>
          </q-input>
        </q-card-section>
      </q-card-section>
      <q-card-section class="row justify-center q-mt-md q-pa-none">
        <q-card-section class="row col-6 q-pa-none reverse">
          <q-file
            v-model="files.val"
            label="File (just image)"
            accept=".jpg, .png"
            color="orange"
            filled
            multiple
            input-class="justify-start"
            class="col overflow-auto"
          />
        </q-card-section>
      </q-card-section>

      <q-card-section class="row justify-center q-mt-md q-pa-none">
        <q-card-section class="row col-6 justify-center q-pa-none reverse">
          <q-btn
            :disable="isDisabled"
            label="افزودن"
            @click="
              create(
                files.val,
                nationalCode.val,
                date.val,
                complaintCode.val,
                price.val
              )
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
import { convertSolarToAD } from 'src/helper/convert-AD-to-solar';
import { createPeyment } from 'src/api/service/paymentService';
import { computed, defineComponent, onBeforeMount, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { getOneComplaint } from 'src/api/service/complaintService';

export default defineComponent({
  name: 'AddPayment',
  components: {},
  setup() {
    let $q = useQuasar();
    let $router = useRouter();

    let files = ref({ val: [], status: false });
    let complaintCode = ref({ val: '', status: false });
    let price = ref({ val: '', status: false });
    let date = ref({ val: '', status: false });
    let nationalCode = ref({ val: '', status: false });

    let complaint = ref();
    let progress = ref(0.0);
    let ttp = ref(0);

    onBeforeMount(async () => {
      if (typeof $router.currentRoute.value.query.id === 'string') {
        complaint.value = await getOneComplaint(
          $router.currentRoute.value.query.id
        );
        nationalCode.value.val = complaint.value.nationalCodeUser;
        complaintCode.value.val = complaint.value.codeDescriptionComplaint;
      }
    });

    let isDisabled = computed(() => {
      if (ttp.value == 5) {
        return false;
      }
      return true;
    });
    watch(ttp, () => {
      progress.value = ttp.value * (1 / 5);
    });
    watch(complaintCode.value, () => {
      if (typeof $router.currentRoute.value.query.id === 'string') {
        if (complaintCode.value.status == false) {
          ttp.value++;
          complaintCode.value.status = true;
        }
        return;
      }
      if (complaintCode.value.val.length > 0) {
        if (complaintCode.value.status == false) {
          ttp.value++;
          complaintCode.value.status = true;
        }
      } else if (complaintCode.value.status == true) {
        if (complaintCode.value.val.length == 0) {
          complaintCode.value.status = false;
          ttp.value--;
        }
      }
    });
    watch(files.value, () => {
      if (files.value.val.length > 0) {
        if (files.value.status == false) {
          ttp.value++;
          files.value.status = true;
        }
      } else if (files.value.status == true) {
        if (files.value.val.length == 0) {
          files.value.status = false;
          ttp.value--;
        }
      }
    });
    watch(price.value, () => {
      if (price.value.val.length > 0) {
        if (price.value.status == false) {
          ttp.value++;
          price.value.status = true;
        }
      } else if (price.value.status == true) {
        if (price.value.val.length == 0) {
          price.value.status = false;
          ttp.value--;
        }
      }
    });
    watch(date.value, () => {
      if (date.value.val.length > 0) {
        if (date.value.status == false) {
          ttp.value++;
          date.value.status = true;
        }
      } else if (date.value.status == true) {
        if (date.value.val.length == 0) {
          date.value.status = false;
          ttp.value--;
        }
      }
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

    async function create(
      file: any,
      nationalC: string,
      pDate: string,
      complaitId: string,
      cost: string
    ) {
      const converted_date = convertSolarToAD(pDate);
      let idtt = $router.currentRoute.value.query.id;
      if (typeof idtt === 'string' && nationalCode.value.val.length < 10) {
        nationalC = nationalCode.value.val;
      }
      if (typeof idtt === 'string' && complaintCode.value.val.length == 0) {
        complaitId = complaintCode.value.val;
      }
      const res = await createPeyment(
        file,
        nationalC,
        converted_date,
        complaitId,
        cost
      );

      if (res == 400) {
        $q.notify({
          message: 'اطلاعات وارد شده شما نادرست است',
          color: 'grey-10',
          icon: 'close',
          iconColor: 'red',
          position: 'center',
        });
      }
      if (res == 204) {
        $q.notify({
          message: `به میزان ${cost} به حساب های مالی کد ملی ${nationalC} با موفقیت اضافه شد`,
          color: 'grey-10',
          icon: 'done',
          iconColor: 'green',
          position: 'center',
        });
        files.value = { val: [], status: false };
        complaintCode.value = { val: '', status: false };
        price.value = { val: '', status: false };
        date.value = { val: '', status: false };
        nationalCode.value = { val: '', status: false };
      }
    }

    return {
      progress,
      isDisabled,
      complaint,
      create,
      price,
      files,
      complaintCode,
      nationalCode,
      date,
    };
  },
});
</script>
<style lang="scss">
.custom-area .q-field__native {
  min-height: 220px;
  max-height: 220px;
}
</style>
