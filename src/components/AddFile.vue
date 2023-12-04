<template>
  <q-card class="bg-transparent no-shadow">
    <q-card-section class="text-h5 q-pa-sm text-weight-bold">
      <q-card-section
        class="reverse q-pa-none row justify-center text-h5 text-weight-bold"
      >
        <q-card-section class="q-py-none"> افزودن پرونده </q-card-section>
        <q-card-section v-if="myComplaint" class="q-py-none text-weight-medium">
          {{ myComplaint.titleDescriptionComplaint }}
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
      <q-card-section class="column">
        <q-card-section class="row q-mt-md justify-center q-pa-none">
          <q-card-section class="row col-6 q-pa-none reverse">
            <q-input
              color="orange"
              input-class="q-mr-sm text-right"
              suffix=" کد ملی"
              filled
              mask="##########"
              v-model="nationalCode.val"
              class="col q-ml-xl"
              readonly
              :rules="[(val) => val.length == 10 || 'کد ملی باید 10 رقم باشد']"
            />
            <q-input
              color="orange"
              input-class="q-mr-sm text-right"
              suffix=":کد شرح شکایت  "
              filled
              readonly
              v-model="Complaintcode.val"
              class="col q-mr-xl"
            />
          </q-card-section>
        </q-card-section>

        <q-card-section class="row justify-center q-pa-none">
          <q-card-section class="row col-6 q-pa-none reverse">
            <q-input
              color="orange"
              input-class="q-mr-sm text-right"
              suffix=": شماره پرونده"
              mask="#"
              reverse-fill-mask
              filled
              v-model="FileNumber.val"
              class="col q-ml-xl"
            />
            <q-input
              color="orange"
              input-class="q-mr-sm text-right"
              suffix=":شماره بایگانی"
              mask="#"
              reverse-fill-mask
              filled
              v-model="Archivenumber.val"
              class="col q-mr-xl"
            />
          </q-card-section>
        </q-card-section>
        <q-card-section class="row q-mt-md justify-center q-pa-none">
          <q-card-section class="row col-6 q-pa-none reverse">
            <q-input
              color="orange"
              input-class="q-mr-sm text-right"
              suffix=": شماره داد نامه"
              filled
              mask="#"
              reverse-fill-mask
              v-model="indictmentnumber.val"
              class="col q-ml-xl"
            />

            <q-input
              color="orange"
              input-class="q-mr-sm text-right"
              suffix="تاریخ"
              readonly
              filled
              class="col q-mr-xl"
              v-model="Dateset.val"
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
                    v-model="Dateset.val"
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
                  @click="Dateset.val = ''"
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
              input-class="q-mr-sm text-right "
              suffix=": متهمین"
              filled
              v-model="text"
              class="col q-ml-xl"
            >
              <template v-slot:prepend>
                <q-icon
                  name="add"
                  color="orange"
                  @click="
                    if (text.length > 0) {
                      accused.val.push(text);
                      text = '';
                    }
                  "
                  class="cursor-pointer"
                /> </template
            ></q-input>
            <div class="q-mr-xl col-4 column" style="height: 100px">
              <q-scroll-area
                class="col q-pr-md"
                v-if="accused.val.length > 0"
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
                    v-for="(data, index) in accused.val"
                    :key="index"
                    class="text-right"
                  >
                    <q-item-section>{{ data }}</q-item-section>
                  </q-item>
                </q-list>
              </q-scroll-area>
              <q-list class="text-body1" bordered v-else separator>
                <q-item class="text-right">
                  <q-item-section>متهمی اضافه نشده</q-item-section>
                </q-item>
              </q-list>
            </div>
          </q-card-section>
        </q-card-section>

        <q-card-section class="row q-mt-md justify-center q-pa-none">
          <q-card-section class="row col-6 justify-center q-pa-none reverse">
            <q-btn
              label="افزودن"
              @click="
                createcase(
                  nationalCode.val,
                  Complaintcode.val,
                  parseInt(Archivenumber.val),
                  parseInt(FileNumber.val),
                  parseInt(indictmentnumber.val),
                  Dateset.val,
                  accused.val
                )
              "
              :disable="isDisabled"
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
import { useQuasar } from 'quasar';
import { computed, defineComponent, ref, watch, onBeforeMount } from 'vue';
import { createFile } from 'src/api/service/fileService';

import { convertSolarToAD } from 'src/helper/convert-AD-to-solar';
import { useRouter } from 'vue-router';
import { getOneComplaint } from 'src/api/service/complaintService';

export default defineComponent({
  name: 'AddFile',
  components: {},
  setup() {
    let $q = useQuasar();
    let $router = useRouter();
    const nationalCode = ref({ val: '', status: false });
    const Complaintcode = ref({ val: '', status: false });
    const Archivenumber = ref({ val: '', status: false });
    const text = ref('');
    const FileNumber = ref({ val: '', status: false });
    const indictmentnumber = ref({ val: '', status: false });
    const Dateset = ref({ val: '', status: false });
    const accused = ref({ val: [], status: false });
    const progress = ref(0.0);
    const ttp = ref(0);
    const myComplaint = ref();

    onBeforeMount(async () => {
      if (typeof $router.currentRoute.value.query.id === 'string') {
        myComplaint.value = await getOneComplaint(
          $router.currentRoute.value.query.id
        );
        Complaintcode.value.val = myComplaint.value.codeDescriptionComplaint;
        nationalCode.value.val = myComplaint.value.nationalCodeUser;
      }
    });

    let isDisabled = computed(() => {
      if (ttp.value == 7) {
        return false;
      }
      return true;
    });
    watch(ttp, () => {
      progress.value = ttp.value * (1 / 7);
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

    watch(Complaintcode.value, () => {
      if (typeof $router.currentRoute.value.query.id === 'string') {
        if (Complaintcode.value.status == false) {
          ttp.value++;
          Complaintcode.value.status = true;
        }
        return;
      }
      if (Complaintcode.value.val.length > 0) {
        if (Complaintcode.value.status == false) {
          ttp.value++;
          Complaintcode.value.status = true;
        }
      } else if (Complaintcode.value.status == true) {
        if (Complaintcode.value.val.length == 0) {
          Complaintcode.value.status = false;
          ttp.value--;
        }
      }
    });

    watch(Archivenumber.value, () => {
      if (Archivenumber.value.val.length > 0) {
        if (Archivenumber.value.status == false) {
          ttp.value++;
          Archivenumber.value.status = true;
        }
      } else if (Archivenumber.value.status == true) {
        if (Archivenumber.value.val.length == 0) {
          Archivenumber.value.status = false;
          ttp.value--;
        }
      }
    });

    watch(FileNumber.value, () => {
      if (FileNumber.value.val.length > 0) {
        if (FileNumber.value.status == false) {
          ttp.value++;
          FileNumber.value.status = true;
        }
      } else if (FileNumber.value.status == true) {
        if (FileNumber.value.val.length == 0) {
          FileNumber.value.status = false;
          ttp.value--;
        }
      }
    });

    watch(indictmentnumber.value, () => {
      if (indictmentnumber.value.val.length > 0) {
        if (indictmentnumber.value.status == false) {
          ttp.value++;
          indictmentnumber.value.status = true;
        }
      } else if (indictmentnumber.value.status == true) {
        if (indictmentnumber.value.val.length == 0) {
          indictmentnumber.value.status = false;
          ttp.value--;
        }
      }
    });

    watch(Dateset.value, () => {
      if (Dateset.value.val.length > 0) {
        if (Dateset.value.status == false) {
          ttp.value++;
          Dateset.value.status = true;
        }
      } else if (Dateset.value.status == true) {
        if (Dateset.value.val.length == 0) {
          Dateset.value.status = false;
          ttp.value--;
        }
      }
    });
    watch(accused.value, () => {
      if (accused.value.val.length > 0) {
        if (accused.value.status == false) {
          ttp.value++;
          accused.value.status = true;
        }
      } else if (accused.value.status == true) {
        if (accused.value.val.length == 0) {
          accused.value.status = false;
          ttp.value--;
        }
      }
    });
    async function createcase(
      nationalId: string,
      commplaintId: string,
      ArchiveNum: number,
      fileNum: number,
      indictmentNum: number,
      dateset: string,
      accus: string[]
    ) {
      let tt = convertSolarToAD(dateset);

      if (
        typeof $router.currentRoute.value.query.id === 'string' &&
        nationalCode.value.val.length < 10
      ) {
        nationalId = myComplaint.value.nationalCodeUser;
      }
      if (
        typeof $router.currentRoute.value.query.id === 'string' &&
        Complaintcode.value.val.length == 0
      ) {
        commplaintId = myComplaint.value.codeDescriptionComplaint;
      }
      const res = await createFile(
        nationalId,
        commplaintId,
        ArchiveNum,
        fileNum,
        indictmentNum,
        tt,
        accus
      );
      if (res == 400) {
        $q.notify({
          message: 'پرونده ای با این اطلاعات وجود دارد',
          color: 'grey-10',
          icon: 'error',
          iconColor: 'red',
          position: 'center',
        });
      }
      if (res == 404) {
        $q.notify({
          message: 'این شکایت دارای یک پرونده می باشد',
          color: 'grey-10',
          icon: 'error',
          iconColor: 'red',
          position: 'center',
        });
      }
      if (res == 204) {
        $q.notify({
          message: `پرونده ${FileNumber.value.val} با موفقیت اضافه شد`,
          color: 'grey-10',
          icon: 'done',
          iconColor: 'green',
          position: 'center',
        });
        nationalCode.value = { val: '', status: false };
        Complaintcode.value = { val: '', status: false };
        Archivenumber.value = { val: '', status: false };
        FileNumber.value = { val: '', status: false };
        indictmentnumber.value = { val: '', status: false };
        Dateset.value = { val: '', status: false };
        accused.value = { val: [], status: false };
        ttp.value = 0;
      }
    }

    return {
      nationalCode,
      Complaintcode,
      Archivenumber,
      text,
      FileNumber,
      Dateset,
      indictmentnumber,
      accused,
      createcase,
      isDisabled,
      progress,
      model: ref(),
      myComplaint,
    };
  },
});
</script>
<style>
.textc.q-field__native {
  max-height: 100px;
  min-height: 100px;
}
</style>
