<template>
  <div class="update-create-campaign pb-8">
    <h2 class="cursor-not-allowed">Update Campaign</h2>
    <p class="desc">
      This page we can see all informations about campaign that we can update somthing on it.
    </p>
    <h3>Campaign Details</h3>
    <form action="" ref="form">
      <div class="input-g1">
        <div :style="isReadOnly ? 'pointer-events: none;cursor:not-allowed !important;' : ''
          ">
          <div>
            <label for="">Campaign Name:
              <span class="text-red" v-if="pathName == 'campaign_name'">{{ invalidMessage }}.</span></label>
            <input type="text" id="campaign-name" class="resize-none focus:outline-none"
              :style="pathName == 'campaign_name' ? 'border:2px solid red' : ''" placeholder="Campaign Name*"
              v-model="campaign_name" />
          </div>
          <div>
            <label for="">Start Date:
              <span class="text-red" v-if="pathName == 'start_date'">{{ invalidMessage }}.</span></label>
            <input type="date" id="start-date" class="resize-none focus:outline-none cursor-pointer"
              v-model="start_date" :style="pathName == 'start_date' ? 'border:2px solid red' : ''" />
          </div>
        </div>
        <div>
          <div :style="isReadOnly ? 'pointer-events: none;cursor:not-allowed !important;' : ''
          ">
            <label for="">Participant:
              <span class="text-red" v-if="pathName == 'participant'">{{ invalidMessage }}.</span></label>
            <input name="participants" id="participants" class="resize-none focus:outline-none cursor-pointer"
              type="file" :style="pathName == 'participant' ? 'border:2px solid red' : ''"
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              @change="handleFileParticipants" />
          </div>

          <UploadFileCSV></UploadFileCSV>
          <div :style="isReadOnly ? 'pointer-events: none;cursor:not-allowed !important;' : ''
          ">
            <label for="">End Date:
              <span class="text-red" v-if="pathName == 'end_date'">{{ invalidMessage }}.</span></label>
            <input type="date" id="end-date" class="resize-none focus:outline-none" v-model="end_date"
              :style="pathName == 'end_date' ? 'border:2px solid red' : ''" :min="minStartDate" />
          </div>
        </div>
      </div>
      <div class="flex flex-col gap-2 mt-5 items-start" style="width: 700px"
        :style="isReadOnly ? 'pointer-events: none;cursor:not-allowed !important;' : ''">
        <label class="check-box-label" for="number-of-chance">Number of chance:
          <span class="text-red" v-if="pathName == 'number_of_chance'">{{ invalidMessage }}</span></label>
        <div class="check-box flex flex-row gap-5 justify-start">
          <div class="flex items-center">
            <input @change="handleRadioSingle" id="default-radio-1" type="radio" value="single" name="default-radio"
              v-model="single" class="w-4 h-4 cursor-pointer" checked />
            <label for="default-radio-1" class="ms-2">Single</label>
          </div>
          <div class="check-box flex items-center">
            <input @change="handleRadioMultiple" id="default-radio-2" type="radio" value="multiple" name="default-radio"
              v-model="multiple" class="w-4 h-4 cursor-pointer" />
            <label for="default-radio-2" class="ms-2">Multiple</label>
          </div>
        </div>
        <input class="number-of-chance resize-none focus:outline-none" type="number"
          :style="single ? 'display: none;' : ''" v-model="number_of_chance" min="1" @input="checkValue" />
      </div>
      <div class="input-g2">
        <label for="">Background Campaign (1920 x 1080)Pixel:
          <span class="text-red" v-if="pathName == 'campaign_image'">{{ invalidMessage }}.</span></label>
        <div v-if="!campaign_image || campaign_image === defaultCampaignBGURL" class="flex">
          <input type="file" id="bg-campaign" v-on:change="handleFileCampaignImage" />
          <div class="icon-selec-file" :style="pathName == 'campaign_image' ? 'border:2px solid red' : ''">
            <span class="material-symbols-outlined"> add_circle </span>
            <img src="/images/icone-d-image-grise.png" alt="" />
          </div>
        </div>
        <div v-else class="image-show">
          <img class="image-show-img p-5" :src="campaign_image" alt="" width="200" />
          <v-dialog transition="dialog-bottom-transition" width="auto">
            <template v-slot:activator="{ props }">
              <span class="material-symbols-outlined select-none  image-show-span" v-bind="props"> close </span>
            </template>

            <template v-slot:default="{ isActive }">
              <div class="delete-image-campaign">
                <img src="/images/smart-logo2.png" alt="" />
                <h1 class="dialog-title pb-10 pt-2 text-center">
                  Are you sure to delete this campaign image?
                </h1>
                <div class="d-flex flex-row justify-between ml-20 mr-20">
                  <BaseButton type="secondary-btn" class="btn-login text-white mr-5" @click="isActive.value = false">
                    No</BaseButton>
                  <BaseButton type="primary-btn" @click="isActive.value = false; clearImage()"
                    class="btn-login text-white ml-5">
                    Yes</BaseButton>
                </div>
              </div>
            </template>
          </v-dialog>
        </div>
      </div>
    </form>
    <h3 class="mb-2">Edit & Add Prizes Pool</h3>
    <p style="width: 700px" class="text-center">Edit and add more prizes to put on your campaign.</p>
    <span class="text-red" v-if="pathName == 'prize'">{{ invalidMessage }}.</span>
    <ClientOnly>
      <table :style="isReadOnly ? 'pointer-events: none;cursor:not-allowed !important;' : ''">
        <tr>
          <th>Name</th>
          <th>Quantity</th>
          <th>Used Quantity</th>
          <th>Action</th>
        </tr>
        <tr v-for="(prize, index) in prizeInCampaigns" :key="index">
          <td>
            <div class="select-dropdown">
              <select id="prizes" class="resize-none focus:outline-none" name="list of prizes" v-model="prize.prize_id">
                <option v-for="item in prizes" :key="item.id" :value="item.id">
                  {{ item.english_name }} ({{ item.khmer_name }})
                </option>
              </select>
            </div>
          </td>
          <td>
            <div class="text-start">
              <label for="" v-if="pathName == 'quantity' && numberIndex == index" class="text-red">{{
          invalidMessage
        }}</label>
              <input id="number-prize" type="number" class="resize-none focus:outline-none" placeholder="15"
                v-model="prize.quantity" min="1" @input="checkeQuantity(prize.quantity, index)"
                :style="pathName == 'quantity' && numberIndex == index ? 'border:2px solid red' : ''" />
            </div>
          </td>
          <td>{{ prize.used_quantity }}</td>
          <td>
            <v-dialog transition="dialog-bottom-transition" width="auto">

              <template v-slot:activator="{ props }">
                <div id="action-prize" v-bind="props">
                  <span class="material-symbols-outlined"> delete </span>
                  <span>Delete</span>
                </div>
              </template>

              <template v-slot:default="{ isActive }">
                <div class="delete-prize">
                  <img src="/images/smart-logo2.png" alt="" />
                  <h1 class="dialog-title pb-10 pt-2 text-center">
                    Do you want to delete this prize from campaign?
                  </h1>
                  <div class="d-flex flex-row justify-between ml-20 mr-20">
                    <BaseButton type="secondary-btn" class="btn-login text-white mr-5" @click="isActive.value = false">
                      No</BaseButton>
                    <BaseButton type="primary-btn" @click="deleteRow(index); isActive.value = false"
                      class="btn-login text-white ml-5">
                      Yes</BaseButton>
                  </div>
                </div>
              </template>
            </v-dialog>
          </td>
        </tr>
      </table>
    </ClientOnly>
    <button id="add-edit-prize-row" @click="addRow"
      :style="isReadOnly ? 'pointer-events: none;cursor:not-allowed !important;' : ''">
      <span class="material-symbols-outlined"> add_circle </span>
    </button>

    <!-- =============================Invite User======================================== -->
    <h3 class="mb-2">Edit & Add Collaborator</h3>
    <p style="width: 700px" class="text-center">
      Edit Add more with your collaborators to view your campaign and provide them with some permissions to do
      on the campaign.
    </p>
    <ClientOnly>
      <table :style="isReadOnly ? 'pointer-events: none;cursor:not-allowed !important;' : ''">
        <tr>
          <th>Email</th>
          <th>Permission</th>
          <th>Action</th>
        </tr>
        <tr v-for="(invite, index) in arrEmailInvites" :key="index">
          <td>
            <SearchEmail :email="invite" :index="index" @custom-event="handleCustomEvent"></SearchEmail>
          </td>
          <td>
            <div class="select-dropdown">
              <select id="invite" class="resize-none focus:outline-none" name="list of email invite"
                v-model="invite.permission">
                <!-- <option value="" disabled>Choose permission</option> -->
                <option value="read only">Read only</option>
                <option value="read and write">Read and write</option>
              </select>
            </div>
          </td>
          <td>
            <v-dialog transition="dialog-bottom-transition" width="auto">

              <template v-slot:activator="{ props }">
                <div id="action-prize" v-bind="props">
                  <span class="material-symbols-outlined"> delete </span>
                  <span>Delete</span>
                </div>
              </template>

              <template v-slot:default="{ isActive }">
                <div class="delete-image-campaign">
                  <img src="/images/smart-logo2.png" alt="" />
                  <h1 class="dialog-title pb-10 pt-2 text-center">Do you want to delete this email?</h1>
                  <div class="d-flex flex-row justify-between ml-20 mr-20">
                    <BaseButton type="secondary-btn" class="text-white mr-5"
                      @click="isActive.value = false">
                      No</BaseButton>
                    <BaseButton type="primary-btn" @click="deleteRowEmailInvite(index); isActive.value = false"
                      class="text-white ml-5">
                      Yes</BaseButton>
                  </div>
                </div>
              </template>
            </v-dialog>
          </td>
        </tr>
      </table>
    </ClientOnly>
    <button id="add-edit-email-invite-row" @click="addRowEmailInvite"
      :style="isReadOnly ? 'pointer-events: none;cursor:not-allowed !important;' : ''">
      <span class="material-symbols-outlined"> add_circle </span>
    </button>
    <div id="update-create-campaign-action">
      <BaseButton type="secondary-btn" id="cancel" class="btn-login text-white mr-5" @click="$router.go(-1)">Cancel
      </BaseButton>
      <BaseButton v-if="!isReadOnly" id="submit" type="primary-btn" class="btn-login text-white ml-5"
        @click="updateCampaign">
        Submit
      </BaseButton>
    </div>

    <Loading :show="isLoading" :title="loadingTitle" :indefinite="!hasProgressbar" :text="loadingText"
      :progress="uploadProgress" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { validateCampaignName, validateDate } from "@/validation";
import { useAuthStore } from "@/store/auth";
import type { IPrize, IEmailInvite, ICampaign } from "@/types";
import BaseButton from "@/components/widget/BaseButton.vue";
import Loading from "@/components/dialog/Loading.vue";
import SearchEmail from "@/components/widget/SearchEmail.vue";
import UploadFileCSV from "@/components/UploadFileCSV.vue";
import dayjs from "dayjs";
import { defaultCampaignBGURL } from "~/configs";

useSeoMeta({
  title: "Update Campaign > Smart | Lucky Draw",
});

// Reference variables
const isLoading = ref<boolean>(false);
const loadingTitle = ref<string>("Updating a campaign...");
const hasProgressbar = ref<boolean>(true);
const uploadProgress = ref<number>(0);
const loadingText = ref<string>("Sending a request to the server...");

const invalidMessage = ref<string>("");
const pathName = ref<string>("");
const campaign_name = ref<string>("");
const campaign_image = ref<string>();
const start_date = ref<string>("");
const end_date = ref<string>("");

const number_of_chance = ref<number>(1);
const participantsFile = ref<File>();
const closeImage = ref(false);
const arrEmailInvites = ref<IEmailInvite[]>([]);
const prizes = ref<IPrize[]>([]);
const prizeInCampaigns = ref<IPrize[]>([]);
const single = ref<string>("single");
const multiple = ref<string>("");
const numberIndex = ref<number>(0);

const authStore = useAuthStore();
let isReadOnly: boolean = false;
let originalImage: string;

// =========== Get meta data ==============

// Get all prizes for selection

const res = await callAPI("/prize/getAllPrizes");
if (res.code !== 200) {
  throw createError({
    statusCode: res.code,
    statusMessage: res.error || 'Unable to get all prizes',
    fatal: true
  });
}
prizes.value = res.data.data;

const campaignId = useRoute().params.id;
const detailRes = await callAPI('/campaign/getDetailsOfCampaigns/' + campaignId);
if (detailRes.code !== 200) {
  throw createError({
    statusCode: res.code,
    statusMessage: res.error || `Unable to get detail of campaign "${campaignId}"`,
    fatal: true
  });
}
const { campaign, prize_pools, invited_emails } = detailRes.data;
const c = <ICampaign>campaign;
campaign_name.value = c.campaign_name;
campaign_image.value = c.campaign_image;
start_date.value = dayjs(campaign.start_date).format("YYYY-MM-DD");
end_date.value = dayjs(campaign.end_date).format("YYYY-MM-DD");
number_of_chance.value = c.number_of_chance;
if (c.number_of_chance > 1) {
  multiple.value = "multiple";
  single.value = "";
}
else {
  single.value = "single";
  multiple.value = "";
}
arrEmailInvites.value = invited_emails;
prizeInCampaigns.value = prize_pools;
originalImage = c.campaign_image;

if (authStore.role !== 'admin') {
  const email = authStore.email;
  const emailAccess = arrEmailInvites.value.find(e => e.email === email);
  if (emailAccess) {
    isReadOnly = emailAccess.permission === 'read only';
  }
}


// ============= Check invalide number======================
function checkeQuantity(quantity: number, index: number) {
  if (quantity < 1) {
    pathName.value = "quantity";
    invalidMessage.value = "Qty must be more than 0";
    numberIndex.value = index;
  } else {
    resetInvalid();
  }
}

function resetInvalid() {
  pathName.value = "";
  invalidMessage.value = "";
}

function handleRadioMultiple() {
  number_of_chance.value = 2;
  multiple.value = multiple.value;
  single.value = "";
  resetInvalid();
}

function handleRadioSingle() {
  multiple.value = "";
  single.value = "single";
  number_of_chance.value = 1;
  resetInvalid();
}

function checkValue() {
  if (number_of_chance.value < 1) {
    pathName.value = "number_of_chance";
    invalidMessage.value = "Please enter number more than 1";
    number_of_chance.value = 1;
  } else {
    resetInvalid();
  }
}
// ==========================

// ======================Get image and check invalide===============
const handleFileCampaignImage = async (event: any) => {
  const file = event.target.files[0];
  const { base64, error } = await readImageFile(file, 1920, 1080);
  if (error) {
    pathName.value = 'campaign_image';
    invalidMessage.value = error;
    closeImage.value = false;
    return;
  }
  campaign_image.value = base64;
  resetInvalid();
  closeImage.value = true;
};
// =======================================

const handleFileParticipants = (event: any) => {
  const file = event.target.files[0];
  participantsFile.value = file;
};


// ===================== Update campaign=============================
const updateCampaign = async () => {
  const errCampaignName = validateCampaignName(campaign_name.value);
  const errStartDate = validateDate(start_date.value);
  const errEndDate = validateDate(end_date.value);
  if (errCampaignName) {
    pathName.value = "campaign_name";
    invalidMessage.value = errCampaignName;
    return;
  }
  if (errStartDate) {
    pathName.value = "start_date";
    invalidMessage.value = errStartDate;
    return;
  }
  if (errEndDate) {
    pathName.value = "end_date";
    invalidMessage.value = errEndDate;
    return;
  }
  const prizePool = prizeInCampaigns.value || [];
  if (prizePool.length === 0) {
    invalidMessage.value = "Prize pool is empty";
    pathName.value = "prize";
    return;
  } else {
    resetInvalid();
  }

  const formData = new FormData();
  formData.set("campaign_name", campaign_name.value);
  // Only update if has changes
  if (originalImage !== campaign_image.value)
    formData.set("campaign_image", campaign_image.value || defaultCampaignBGURL);
  formData.set("start_date", start_date.value);
  formData.set("end_date", end_date.value);
  if (participantsFile.value) {
    formData.set("participants", participantsFile.value);
  }
  formData.set("number_of_chance", number_of_chance.value.toString());
  formData.set("prizes", JSON.stringify(prizeInCampaigns.value));
  formData.set("invited_email", JSON.stringify(arrEmailInvites.value));

  isLoading.value = true;
  hasProgressbar.value = true;
  let timeout: any;
  loadingText.value = 'Uploading your request to server...'
  const res = await callAPIProgress(`/campaign/updateCampaign/${campaignId}`, "PUT", formData, (progress: number) => {
    uploadProgress.value = progress;
    if (progress === 1) {
      timeout = setTimeout(() => {
        loadingText.value = 'Processing your request...';
        hasProgressbar.value = false;
      }, 1000);
    }
  });
  clearTimeout(timeout);
  isLoading.value = false;
  if (res.status == 200) {
    window.location.href = "/campaigns";
  } else {
    const error: any = res.error;
    pathName.value = error.details[0].path[0];
    invalidMessage.value = error.details[0].message;
  }

};
// =================================

// ============== Add row and Delete Update row of prize==================

const addRow = () => {
  if (prizes.value && prizeInCampaigns.value.length < prizes.value.length) {
    const freePrize = prizes.value.find((prize) => !prizeInCampaigns.value.find((ap) => ap.prize_id === prize.id));
    if (freePrize)
      prizeInCampaigns.value.push(<IPrize>{ prize_id: freePrize.id, quantity: 0, used_quantity: 0 });
  }
};

const deleteRow = (index: number) => {
  prizeInCampaigns.value.splice(index, 1);
};

const addRowEmailInvite = () => {
  arrEmailInvites.value.push({ email: "", permission: "" });
  return;
};

const deleteRowEmailInvite = (index: number) => {
  arrEmailInvites.value.splice(index, 1);
};

const handleCustomEvent = (email: string, index: number) => {
  arrEmailInvites.value[index] = { email: email, permission: "read only" };
};

const clearImage = () => {
  campaign_image.value = '';
};

// ================================================

// ==============Valide Date=================
const minStartDate = computed(() => {
  if (start_date.value) {
    const startDate = new Date(start_date.value);
    return startDate.toISOString().split("T")[0];
  }
});

</script>

<style scoped src="../../../assets/css/index.css">
/* ====================================== */
</style>
