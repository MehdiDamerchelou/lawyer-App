<template>
  <q-card class="bg-transparent no-shadow">
    <q-card-section class="text-h5 q-pa-sm text-weight-bold">
      افزودن موکل
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
      <q-card-section class="column">
        <q-card-section class="row q-mt-md justify-center q-pa-none">
          <q-card-section class="row col-6 q-pa-none reverse">
            <q-input
              color="orange"
              input-class="q-mr-sm text-right"
              suffix=": نام"
              filled
              v-model="fName.val"
              class="col q-ml-xl"
            />
            <q-input
              color="orange"
              input-class="q-mr-sm text-right"
              suffix=": نام خانوادگی"
              filled
              v-model="lName.val"
              class="col q-mr-xl"
            />
          </q-card-section>
        </q-card-section>
        <q-card-section class="row q-mt-md justify-center q-pa-none">
          <q-card-section class="row col-6 q-pa-none">
            <q-input
              color="orange"
              input-class="q-mr-sm text-right"
              suffix=": آدرس اول"
              filled
              v-model="fAddress.val"
              class="col"
            />
          </q-card-section>
        </q-card-section>
        <q-card-section class="row q-mt-md justify-center q-pa-none">
          <q-card-section class="row col-6 q-pa-none">
            <q-input
              color="orange"
              input-class="q-mr-sm text-right"
              suffix=": آدرس دوم"
              filled
              v-model="sAddress.val"
              class="col"
            />
          </q-card-section>
        </q-card-section>
        <q-card-section class="row q-mt-md justify-center q-pa-none">
          <q-card-section class="row col-6 q-pa-none reverse">
            <q-input
              color="orange"
              suffix=": کد ملی"
              filled
              v-model="nationalCode.val"
              mask="##########"
              class="col q-ml-md"
              lazy-rules
              :rules="[(val) => val.length == 10 || 'کد ملی باید 10 رقم باشد']"
            />
            <q-input
              color="orange"
              suffix=": تلفن همراه"
              filled
              v-model="phone.val"
              type="tel"
              mask="###########"
              class="col q-mx-md"
              lazy-rules
              :rules="[
                (val) => val.length == 11 || 'شماره تلفن باید 11 رقم باشد',
                (val) => /^09{1}/.test(val) || 'با 09 باید آغاز شود',
              ]"
            />
            <q-input
              color="orange"
              filled
              v-model="postalCode.val"
              mask="##########"
              suffix=": کد پستی"
              class="col q-mr-md"
              lazy-rules
              :rules="[(val) => val.length == 10 || 'کد پستی باید 10 رقم باشد']"
            />
          </q-card-section>
        </q-card-section>
        <q-card-section class="row q-mt-md justify-center q-pa-none">
          <q-card-section class="row col-6 justify-center q-pa-none reverse">
            <q-btn
              label="افزودن"
              :disable="isDisabled"
              @click="
                create(
                  fName.val,
                  lName.val,
                  fAddress.val,
                  sAddress.val,
                  nationalCode.val,
                  phone.val,
                  postalCode.val
                )
              "
              color="grey-5"
              class="text-weight-bold q-px-xl text-black text-body1"
            />
          </q-card-section>
        </q-card-section>
      </q-card-section>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue';
import { createClient } from 'src/api/service/clientService';
import { useQuasar } from 'quasar';

export default defineComponent({
  name: 'AddClient',
  components: {},
  setup() {
    let $q = useQuasar();

    let fName = ref({ val: '', status: false });
    let lName = ref({ val: '', status: false });
    let fAddress = ref({ val: '', status: false });
    let sAddress = ref({ val: '', status: false });
    let phone = ref({ val: '', status: false });
    let nationalCode = ref({ val: '', status: false });
    let postalCode = ref({ val: '', status: false });
    let res = ref();

    let progress = ref(0.0);
    let ttp = ref(0);

    let isDisabled = computed(() => {
      if (ttp.value == 7) {
        return false;
      }
      return true;
    });
    watch(ttp, () => {
      progress.value = ttp.value * (1 / 7);
    });
    watch(fName.value, () => {
      if (fName.value.val.length > 0) {
        if (fName.value.status == false) {
          ttp.value++;
          fName.value.status = true;
        }
      } else if (fName.value.status == true) {
        if (fName.value.val.length == 0) {
          fName.value.status = false;
          ttp.value--;
        }
      }
    });
    watch(lName.value, () => {
      if (lName.value.val.length > 0) {
        if (lName.value.status == false) {
          ttp.value++;
          lName.value.status = true;
        }
      } else if (lName.value.status == true) {
        if (lName.value.val.length == 0) {
          lName.value.status = false;
          ttp.value--;
        }
      }
    });
    watch(fAddress.value, () => {
      if (fAddress.value.val.length > 0) {
        if (fAddress.value.status == false) {
          ttp.value++;
          fAddress.value.status = true;
        }
      } else if (fAddress.value.status == true) {
        if (fAddress.value.val.length == 0) {
          fAddress.value.status = false;
          ttp.value--;
        }
      }
    });
    watch(sAddress.value, () => {
      if (sAddress.value.val.length > 0) {
        if (sAddress.value.status == false) {
          ttp.value++;
          sAddress.value.status = true;
        }
      } else if (sAddress.value.status == true) {
        if (sAddress.value.val.length == 0) {
          sAddress.value.status = false;
          ttp.value--;
        }
      }
    });
    watch(nationalCode.value, () => {
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
    watch(phone.value, () => {
      if (phone.value.val.length == 11 && /^09{1}/.test(phone.value.val)) {
        if (phone.value.status == false) {
          ttp.value++;
          phone.value.status = true;
        }
      } else if (phone.value.status == true) {
        if (
          phone.value.val.length < 11 ||
          /^09{1}/.test(phone.value.val) == false
        ) {
          phone.value.status = false;
          ttp.value--;
        }
      }
    });
    watch(postalCode.value, () => {
      if (postalCode.value.val.length == 10) {
        if (postalCode.value.status == false) {
          ttp.value++;
          postalCode.value.status = true;
        }
      } else if (postalCode.value.status == true) {
        if (postalCode.value.val.length < 10) {
          postalCode.value.status = false;
          ttp.value--;
        }
      }
    });

    async function create(
      firstN: string,
      secondN: string,
      firstA: string,
      secondA: string,
      nCode: string,
      phoneNum: string,
      postCode: string
    ) {
      const res = await createClient(
        firstN,
        secondN,
        firstA,
        secondA,
        nCode,
        phoneNum,
        postCode
      );
      if (res == 401) {
        $q.notify({
          message: 'موکلی با این اطلاعات وجود دارد',
          color: 'grey-10',
          icon: 'error',
          iconColor: 'red',
          position: 'center',
        });
      }

      if (res == 204) {
        $q.notify({
          message: `${firstN + ' ' + secondN} با موفقیت اضافه شد`,
          color: 'grey-10',
          icon: 'done',
          iconColor: 'green',
          position: 'center',
        });
        fName.value = { val: '', status: false };
        lName.value = { val: '', status: false };
        fAddress.value = { val: '', status: false };
        sAddress.value = { val: '', status: false };
        phone.value = { val: '', status: false };
        nationalCode.value = { val: '', status: false };
        postalCode.value = { val: '', status: false };
      }
    }

    return {
      fName,
      lName,
      create,
      fAddress,
      nationalCode,
      isDisabled,
      postalCode,
      phone,
      sAddress,
      res,
      progress,
    };
  },
});
</script>
<style lang="scss"></style>
