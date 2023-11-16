<template>
  <q-card
    v-if="radioVal == 'payment'"
    class="bg-transparent column col no-shadow"
  >
    <div
      v-if="typeof mainData == 'object'"
      dir="rtl"
      class="text-h5 row justify-center"
    >
      پرداختی ها براساس کد شکایت
      {{ mainData.codeDescriptionComplaint }}
      عنوان :
      {{ mainData.titleDescriptionComplaint }}
    </div>
    <q-card-section class="text-center row col justify-center">
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
      >
        <q-card-section
          v-if="typeof mainData == 'object'"
          class="row justify-center q-pa-none"
        >
          <q-card-section
            v-for="(item, index1) in mainData.finaneialPayments"
            :key="index1"
            class="column col-5 q-pa-none q-ma-sm"
          >
            <div class="col text-center column bg-grey-7 radius">
              <q-card-section
                class="row col reverse justify-center q-pa-sm text-body1"
              >
                <div class="col">شماره شکایت</div>
                <div class="col">
                  {{ item.codeDescriptionComplaint }}
                </div>
              </q-card-section>
              <q-card-section
                class="row col reverse justify-center q-pa-sm text-body1"
              >
                <div class="col">میزان پرداختی</div>
                <div class="col">
                  {{ item.price }}
                </div>
              </q-card-section>
              <q-card-section
                class="row col reverse justify-center q-pa-sm text-body1"
              >
                <div class="col">تاریخ پرداخت</div>
                <div class="col">
                  {{ convertADToSolar(item.date) }}
                </div>
              </q-card-section>
              <q-card-section
                class="row col reverse justify-center q-pt-none q-px-sm text-body1"
              >
                <div class="col">
                  <q-btn
                    @click="
                      dialog = true;
                      myFile = item;
                    "
                    label="عکس ها"
                  />
                </div>
              </q-card-section>
            </div>
          </q-card-section>
        </q-card-section>
        <q-card-section v-if="noData" class="text-h5"
          ><q-icon name="close" color="red" size="40px" /> پرداختی وجود ندارد
          <q-icon name="close" color="red" size="40px"
        /></q-card-section>
      </q-scroll-area>
    </q-card-section>
    <q-dialog
      v-model="dialog"
      persistent
      full-height
      full-width
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card class="bg-grey-9 column text-white">
        <q-card-actions align="right" class="text-teal">
          <q-icon
            name="close"
            color="white"
            class="cursor-pointer"
            size="50px"
            v-close-popup
          />
        </q-card-actions>
        <q-card-section class="row col justify-center q-pa-none">
          <q-card-section class="q-pa-none col column">
            <q-card-section class="col column justify-center">
              <q-card-section class="q-pa-sm row justify-center"
                >مبلغ {{ myFile.price }} برای کاربر
                {{ myFile.nationalCodeUser }} برای شماره شکایت
                {{ myFile.codeDescriptionComplaint }}</q-card-section
              >
              <q-carousel
                swipeable
                ref="carousel"
                animated
                infinite
                v-model="slide"
                control-color="red"
                class="bg-grey-9 col radius"
                transition-prev="slide-right"
                transition-next="slide-left"
                v-model:fullscreen="fullscreen"
              >
                <q-carousel-slide
                  v-for="(data, index) in myFile.fileImage"
                  :key="index"
                  :name="index + 1"
                  ><div class="col column items-center">
                    <q-img
                      class="col radius"
                      :style="
                        !fullscreen ? 'max-width: 50vw' : 'max-width: 70vw'
                      "
                      :src="'http://127.0.0.1:3000/download/' + data"
                      spinner-color="white"
                    />
                    <div class="row justify-center q-mt-md text-white text-h6">
                      {{ index + 1 }} / {{ myFile.fileImage.length }}
                    </div>
                  </div></q-carousel-slide
                >
                <template v-slot:control>
                  <q-carousel-control
                    position="bottom-right"
                    :offset="[18, 18]"
                    class="q-gutter-xs"
                  >
                    <q-btn
                      push
                      round
                      dense
                      color="orange"
                      text-color="black"
                      icon="arrow_left"
                      @click="$refs.carousel.previous()"
                    />
                    <q-btn
                      push
                      round
                      dense
                      color="orange"
                      text-color="black"
                      icon="arrow_right"
                      @click="$refs.carousel.next()"
                    />
                  </q-carousel-control>
                  <q-carousel-control position="bottom-left" :offset="[18, 18]">
                    <q-btn
                      push
                      round
                      dense
                      color="orange"
                      text-color="black"
                      :icon="fullscreen ? 'fullscreen_exit' : 'fullscreen'"
                      @click="fullscreen = !fullscreen"
                    />
                  </q-carousel-control>
                </template>
              </q-carousel>
            </q-card-section> </q-card-section
        ></q-card-section>
      </q-card>
    </q-dialog>
  </q-card>

  <q-card
    v-if="radioVal == 'Complaint'"
    class="bg-transparent column col no-shadow"
  >
    <div class="text-h5 row justify-center">اطلاعات شکایت</div>

    <q-card-section class="text-center row col justify-center">
      <q-card-section
        v-if="typeof mainData == 'object'"
        class="column col justify-center q-pa-none"
      >
        <ShowComplaint :newId="complaintId" class="bg-transparent text-black" />
      </q-card-section>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { complaintIdExport } from 'src/api/service/exportService';
import { convertADToSolar } from 'src/helper/convert-AD-to-solar';
import ShowComplaint from 'src/components/ShowComplaint.vue';
import { defineComponent, onBeforeMount, ref } from 'vue';

export default defineComponent({
  name: 'InfoComplaintId',
  components: { ShowComplaint },
  props: {
    radio: String,
    complaintId: String,
  },
  setup(props) {
    const mainData = ref();
    let complaintId = props.complaintId;
    let radioVal = props.radio;
    const noData = ref(false);
    onBeforeMount(async () => {
      if (complaintId == undefined || radioVal == undefined) {
        return;
      }
      await complaintIdExport(complaintId, radioVal).then((response) => {
        mainData.value = response;
        mainData.value.finaneialPayments = [
          {
            nationalCodeUser: '1111111111',
            codeDescriptionComplaint: '023376169517',
            price: 1646,
            date: 1699734600000,
            fileImage: ['Screenshot (9)-799565823608.png'],
          },
          {
            nationalCodeUser: '1111111111',
            codeDescriptionComplaint: '023376169517',
            price: 1646,
            date: 1699734600000,
            fileImage: ['Screenshot (9)-919586778834.png'],
          },
          {
            nationalCodeUser: '1111111111',
            codeDescriptionComplaint: '023376169517',
            price: 1646,
            date: 1699734600000,
            fileImage: ['Screenshot (9)-662660942449.png'],
          },
          {
            nationalCodeUser: '1111111111',
            codeDescriptionComplaint: '023376169517',
            price: 1646,
            date: 1699734600000,
            fileImage: ['Screenshot (9)-306557390389.png'],
          },
          {
            nationalCodeUser: '1111111111',
            codeDescriptionComplaint: '023376169517',
            price: 2345654,
            date: 1700425800000,
            fileImage: [
              'Screenshot (3)-290872561287.png',
              'Screenshot (7)-693665549884.png',
              'Screenshot (9)-299026984294.png',
              'Screenshot (10)-891551681687.png',
            ],
          },
          {
            nationalCodeUser: '1111111111',
            codeDescriptionComplaint: '023376169517',
            price: 2345654,
            date: 1700425800000,
            fileImage: [
              'Screenshot (3)-201882378186.png',
              'Screenshot (7)-512662241234.png',
              'Screenshot (9)-376994084901.png',
              'Screenshot (10)-754280965621.png',
            ],
          },
          {
            nationalCodeUser: '1111111111',
            codeDescriptionComplaint: '023376169517',
            price: 2345654,
            date: 1700425800000,
            fileImage: [
              'Screenshot (3)-514183043319.png',
              'Screenshot (7)-683139734066.png',
              'Screenshot (9)-558592572318.png',
              'Screenshot (10)-146544586299.png',
            ],
          },
          {
            nationalCodeUser: '1111111111',
            codeDescriptionComplaint: '023376169517',
            price: 2345654,
            date: 1700425800000,
            fileImage: [
              'Screenshot (3)-207395950439.png',
              'Screenshot (7)-773124665168.png',
              'Screenshot (9)-899291501310.png',
              'Screenshot (10)-812270388674.png',
            ],
          },
          {
            nationalCodeUser: '1111111111',
            codeDescriptionComplaint: '023376169517',
            price: 2345654,
            date: 1700425800000,
            fileImage: [
              'Screenshot (3)-367937008697.png',
              'Screenshot (7)-216420744281.png',
              'Screenshot (9)-255045550076.png',
              'Screenshot (10)-757874561921.png',
            ],
          },
          {
            nationalCodeUser: '1111111111',
            codeDescriptionComplaint: '023376169517',
            price: 2345654,
            date: 1700425800000,
            fileImage: [
              'Screenshot (3)-280182939928.png',
              'Screenshot (7)-593382186118.png',
              'Screenshot (9)-922488783683.png',
              'Screenshot (10)-313104387426.png',
            ],
          },
          {
            nationalCodeUser: '1111111111',
            codeDescriptionComplaint: '023376169517',
            price: 15505464560,
            date: 1699993800000,
            fileImage: [
              '_89b394dc-2bfb-4553-8a48-4f7af518e0f5-643490897670-357734954210.jpg',
              'aa-237657423453 (1)-826645300709.jpg',
              'logo2-013504214809.png',
            ],
          },
          {
            nationalCodeUser: '1111111111',
            codeDescriptionComplaint: '023376169517',
            price: 15505464560,
            date: 1699993800000,
            fileImage: [
              '_89b394dc-2bfb-4553-8a48-4f7af518e0f5-643490897670-726451305553.jpg',
              'aa-237657423453 (1)-756258316284.jpg',
              'logo2-446101400562.png',
            ],
          },
        ];

        if (radioVal == 'payment') {
          if (response.finaneialPayments.length == 0) {
            noData.value = true;
          }
        } else {
          if (response == undefined) {
            noData.value = true;
          }
        }
      });
    });

    return {
      mainData,
      myFile: ref(),
      fullscreen: ref(false),
      dialog: ref(false),
      slide: ref(1),
      noData,
      radioVal,
      convertADToSolar,
    };
  },
});
</script>
