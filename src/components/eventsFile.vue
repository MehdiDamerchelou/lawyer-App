<template>
  <q-card class="bg-transparent no-shadow">
    <q-card-section class="text-h5 q-pa-sm text-weight-bold">
      وقایع پرونده
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

    <q-card-section class="row q-mt-md justify-center q-pa-none">
      <q-card-section class="row col-6 q-pa-none">
        <q-input
          color="orange"
          input-class=" text-right textc"
          placeholder=":  شرح واقیعه"
          filled
          v-model="Descriptionevent.val"
          class="col textc"
          type="textarea"
        />
      </q-card-section>
    </q-card-section>
    <q-card-section class="row justify-center q-pa-none">
      <q-card-section class="row col-6 reverse q-pa-none">
        <q-card-section class="column col q-pa-none q-pt-sm">
          <q-card-section class="row justify-center q-pa-none">
            <q-card-section class="row col q-pa-none reverse">
              <q-input
                color="orange"
                input-class=" text-right"
                suffix=": شماره پرونده"
                filled
                mask="#"
                reverse-fill-mask
                v-model="FileNumber.val"
                class="col q-ml-md"
              />
            </q-card-section>
          </q-card-section>
          <q-card-section class="row q-mt-md justify-center q-pa-none">
            <q-card-section class="row col q-pa-none reverse">
              <q-input
                color="orange"
                input-class="  text-right"
                suffix="  تاریخ ثبت"
                readonly
                filled
                class="col q-ml-md"
                v-model="Dateset.val"
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
                        color="orange"
                        dir="rtl"
                        v-model="Dateset.val"
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
                  </q-icon>
                </template>
              </q-input>
            </q-card-section>
          </q-card-section>
          <q-card-section class="row justify-center q-pa-none">
            <q-card-section class="row col q-pa-none reverse">
              <q-input
                color="orange"
                input-class=" text-right"
                suffix="تاریخ حضور"
                readonly
                filled
                class="col q-ml-md"
                v-model="Donedate.val"
                mask="date"
                :rules="[
                  (val) =>
                    Dateset.val.length > 0 ||
                    'تاریخ ثبت را وارد کنید بعد تاریخ حضور را وارد کنید',
                  (val) =>
                    convertSolarToAD(val) > convertSolarToAD(Dateset.val) ||
                    'تاریخ حضور باید از تاریخ ثبت جلو تر باشد',
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
                        color="orange"
                        dir="rtl"
                        v-model="Donedate.val"
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
                  </q-icon>
                </template>
              </q-input>
            </q-card-section>
          </q-card-section>
        </q-card-section>
        <q-card-section class="column col q-pa-none q-pt-sm">
          <q-card-section class="row justify-center col q-pa-none">
            <q-card-section class="col q-pa-none column">
              <div class="column col q-pb-md">
                <q-file
                  v-model="files.val"
                  label="File (just image)"
                  accept=".jpg, .png"
                  color="orange"
                  filled
                  multiple
                  input-class="justify-start"
                  class="col c q-mr-md"
                />
              </div>
            </q-card-section>
          </q-card-section>
        </q-card-section> </q-card-section
    ></q-card-section>
    <q-card-section class="row q-mt-sm justify-center q-pa-none">
      <q-card-section class="row col-6 justify-center q-pa-none reverse">
        <q-btn
          label=" ثبت"
          :disable="isDisabled"
          @click="
            createEvent(
              files.val,
              FileNumber.val,
              Dateset.val,
              Donedate.val,
              Descriptionevent.val
            )
          "
          color="grey-5"
          class="text-weight-bold q-px-xl text-black text-body1"
        />
      </q-card-section>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { useQuasar } from 'quasar';
import { computed, defineComponent, ref, watch, onBeforeMount } from 'vue';
import { createCaseEvent } from 'src/api/service/caseEventService';
import { convertSolarToAD } from 'src/helper/convert-AD-to-solar';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'AddFile',
  components: {},
  setup() {
    let $q = useQuasar();
    let Descriptionevent = ref({ val: '', status: false });
    let FileNumber = ref({ val: '', status: false });
    let Donedate = ref({ val: '', status: false });
    let Dateset = ref({ val: '', status: false });

    let res = ref();
    let progress = ref(0.0);
    let ttp = ref(0);
    let $router = useRouter();
    let user = ref();

    let files = ref({ val: [], status: false });

    onBeforeMount(async () => {
      if (typeof $router.currentRoute.value.query.id === 'string') {
        FileNumber.value.val = $router.currentRoute.value.query.id;
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
    watch(Descriptionevent.value, () => {
      if (Descriptionevent.value.val.length == 1) {
        if (Descriptionevent.value.status == false) {
          ttp.value++;
          Descriptionevent.value.status = true;
        }
      } else if (Descriptionevent.value.status == true) {
        if (Descriptionevent.value.val.length < 1) {
          Descriptionevent.value.status = false;
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

    watch(Donedate.value, () => {
      if (Donedate.value.val.length > 0) {
        if (Dateset.value.val.length > 0) {
          if (
            convertSolarToAD(Donedate.value.val) <
            convertSolarToAD(Dateset.value.val)
          ) {
            if (Donedate.value.status == true) {
              Donedate.value.status = false;
              ttp.value--;
            }
            return;
          }
        } else {
          return;
        }
        if (Donedate.value.status == false) {
          ttp.value++;
          Donedate.value.status = true;
        }
      } else if (Donedate.value.status == true) {
        if (Donedate.value.val.length == 0) {
          Donedate.value.status = false;
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

    async function createEvent(
      uplodFile: any,
      fileId: string,
      dateS: string,
      dateD: string,
      descrip: string
    ) {
      let dat1 = convertSolarToAD(dateS);
      let dat2 = convertSolarToAD(dateD);
      const res = await createCaseEvent(uplodFile, fileId, dat1, dat2, descrip);

      if (res == 204) {
        $q.notify({
          message: `این واقعه برای پرونده ${fileId} با موفقیت اضافه شد`,
          color: 'grey-10',
          icon: 'done',
          iconColor: 'green',
          position: 'center',
        });
      }
    }
    return {
      createEvent,
      isDisabled,
      res,
      progress,
      user,
      FileNumber,
      Dateset,
      Descriptionevent,
      Donedate,
      files,
      convertSolarToAD,
    };
  },
});
</script>
<style lang="scss">
.textc.q-field__native {
  min-height: 110px !important;
  max-height: 110px !important;
}
.c .q-field__control {
  height: 100% !important;
  max-height: 300px;
}
.rtl {
  direction: rtl;
}
</style>
