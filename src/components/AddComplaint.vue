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
    <q-card-section class="column">
      <q-card-section class="row justify-center q-mt-md q-pa-none">
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
              </q-icon>
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
import { convertSolarToAD } from 'src/helper/convert-AD-to-solar';
import { useRouter } from 'vue-router';
import { getOneClient } from 'src/api/service/clientService';

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
    onBeforeMount(async () => {
      if (typeof $router.currentRoute.value.query.id === 'string') {
        user.value = await getOneClient($router.currentRoute.value.query.id);
        nationalCode.value.val = user.value.nationalCode;
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
      const res = await createComplaint(nationalC, titl, converted_date, why);
      if (res == 400) {
        $q.notify({
          message: 'شکایتی با این اطلاعات وجود دارد',
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
