<template>
  <q-card class="bg-transparent text-white column col no-shadow">
    <q-card-section class="text-center column justify-start col">
      <q-card-section
        v-if="typeof mainData == 'object'"
        class="row col justify-center q-pa-none"
      >
        <q-card-section class="column col-5 q-pa-none q-ma-sm">
          <div class="col text-center column">
            <q-card-section
              class="row col-2 q-mb-sm reverse bg-grey-7 radius justify-center q-py-sm text-h5"
            >
              <div class="col-4 column justify-center" dir="rtl">
                عنوان : {{ mainData.titleDescriptionComplaint }}
              </div>
              <div class="col column justify-center" dir="rtl">
                شماره شکایت : {{ mainData.codeDescriptionComplaint }}
              </div>
            </q-card-section>

            <q-card-section
              class="row col-2 reverse justify-center q-pa-none text-body1"
            >
              <div class="row col reverse q-pt-sm q-ml-sm bg-grey-7 radius">
                <div class="col">نتیجه</div>
                <div class="col q-ml-md q-pt-md">
                  {{
                    mainData.complaintResult == 'check'
                      ? 'درحال برسی'
                      : mainData.complaintResult == 'win'
                      ? 'پیروز'
                      : mainData.complaintResult == 'lsoe'
                      ? 'بازنده'
                      : mainData.complaintResult == 'draw'
                      ? 'مساوی'
                      : ''
                  }}
                </div>
              </div>
              <div class="row col reverse q-pt-sm q-mr-sm bg-grey-7 radius">
                <div class="col q-mr-md">تاریخ</div>
                <div class="col q-pt-md">
                  {{ convertADToSolar(mainData.datePresence) }}
                </div>
              </div>
            </q-card-section>

            <q-card-section
              class="row col-2 q-pt-sm reverse justify-center q-pa-none text-body1"
            >
              <div class="row col reverse q-pt-sm q-ml-sm bg-grey-7 radius">
                <div class="col">نام موکل</div>
                <div class="col q-ml-md q-pt-md">
                  {{ mainData.User[0].firstName }}
                  {{ mainData.User[0].familyName }}
                </div>
              </div>
              <div class="row col reverse q-pt-sm q-mr-sm bg-grey-7 radius">
                <div class="col q-mr-md">کد ملی موکل</div>
                <div class="col q-pt-md">
                  {{ mainData.User[0].nationalCode }}
                </div>
              </div>
            </q-card-section>

            <q-card-section class="column col-5 q-pa-none">
              <div class="column col bg-grey-7 radius q-mt-sm">
                <div class="row justify-end q-px-lg q-pt-sm">شرح شکوایه</div>

                <div class="row col q-mb-md q-mt-sm justify-center">
                  <q-scroll-area
                    class="col text-right q-pr-lg"
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
                    >{{ mainData.descriptionComplaint }}</q-scroll-area
                  >
                </div>
              </div>
            </q-card-section>
          </div>
        </q-card-section>
      </q-card-section>
      <div v-if="noData" class="col-2 row justify-center">
        <q-card-section class="bg-grey-7 row items-center radius text-h5"
          ><q-icon name="close" color="red" size="40px" /> شکایتی به این شماره
          {{ newId }} وجود ندارد <q-icon name="close" color="red" size="40px"
        /></q-card-section>
      </div>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { convertADToSolar } from 'src/helper/convert-AD-to-solar';
import { defineComponent, onBeforeMount, ref } from 'vue';
import { complaintIdExport } from 'src/api/service/exportService';

export default defineComponent({
  props: {
    newId: String,
  },
  name: 'ShowComplaint',
  components: {},
  setup(props) {
    let mainData = ref();
    let noData = ref(false);
    let newId = props.newId;
    onBeforeMount(async () => {
      console.log(newId);

      if (typeof newId == 'string') {
        mainData.value = await complaintIdExport(newId, 'Complaint');
        if (!mainData.value.codeDescriptionComplaint) {
          noData.value = true;
        }
      }
    });
    return { convertADToSolar, noData, mainData };
  },
});
</script>
<style></style>
