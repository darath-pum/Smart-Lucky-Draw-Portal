<template>
    <div class="update-create-campaign pb-8">
        <h2>Add Campaign</h2>
        <p class="desc">This page we can create new campaign and select prizes to put on campaign.</p>
        <h3>Campaign Details</h3>
        <form action="" ref="form">
            <div class="input-g1">
                <div>
                    <label for="">Campaign Name:
                        <span class="text-red" v-if="pathName == 'campaign_name'">{{ invalidMessage }}.</span></label>
                    <input type="text" id="campaign-name" class="resize-none focus:outline-none"
                        placeholder="Campaign Name*" v-model="campaign_name" required
                        :style="pathName == 'campaign_name' ? 'border:2px solid red' : ''" />

                    <label for="">Start Date:
                        <span class="text-red" v-if="pathName == 'start_date'">{{ invalidMessage }}.</span></label>
                    <input type="date" id="start-date" v-model="start_date" required
                        :style="pathName == 'start_date' ? 'border:2px solid red' : ''" />
                </div>
                <div>
                    <label for="">Participant:
                        <span class="text-red" v-if="pathName == 'participant'">{{ invalidMessage }}.</span></label>

                    <input name="participants" id="participants" class="resize-none focus:outline-none cursor-pointer"
                        type="file"
                        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                        @change="handleFileParticipants"
                        :style="pathName == 'participant' ? 'border:2px solid red' : ''" />
                    <UploadFileCSV></UploadFileCSV>
                    <label for="">End Date:
                        <span class="text-red" v-if="pathName == 'end_date'">{{ invalidMessage }}.</span></label>
                    <input type="date" id="end-date" v-model="end_date" required
                        :style="pathName == 'end_date' ? 'border:2px solid red' : ''" :min="minStartDate" />
                </div>
            </div>
            <div class="flex flex-col gap-2 mt-5 items-start" style="width: 650px">
                <label class="check-box-label" for="number-of-chance">Number of chance:
                    <span class="text-red" v-if="pathName == 'number_of_chance'">{{ invalidMessage }}</span></label>
                <div class="check-box flex flex-row gap-5 justify-start">
                    <div class="flex items-center">
                        <input @change="handleRadioSingle" id="default-radio-1" type="radio" value="single"
                            name="default-radio" v-model="single" class="w-4 h-4 cursor-pointer" checked />
                        <label for="default-radio-1" class="ms-2">Single</label>
                    </div>
                    <div class="check-box flex items-center">
                        <input @change="handleRadioMultiple" id="default-radio-2" type="radio" value="multiple"
                            name="default-radio" v-model="multiple" class="w-4 h-4 cursor-pointer" />
                        <label for="default-radio-2" class="ms-2">Multiple</label>
                    </div>
                </div>
                <input class="number-of-chance resize-none focus:outline-none" type="number"
                    :style="single ? 'display: none;' : ''" v-model="number_of_chance" required min="2"
                    @blur="handleChanceInput" />
            </div>

            <div class="input-g2">
                <label for="">Background Campaign (1920 x 1080)Pixel:
                    <span class="text-red" v-if="pathName == 'campaign_image'">{{ invalidMessage }}.</span>
                </label>
                <input v-if="!closeImage" type="file" accept="image/*" class="cursor-pointer" id="bg-campaign"
                    v-on:change="handleFileCampaignImage" />
                <div v-if="!closeImage" class="icon-selec-file"
                    :style="pathName == 'campaign_image' ? 'border:2px solid red' : ''">
                    <span class="material-symbols-outlined"> add_circle </span>
                    <img src="/images/icone-d-image-grise.png" alt="" />
                </div>
                <div v-if="closeImage == true" class="image-show">
                    <img :src="campaign_image" alt="" class="p-5 image-show-img" width="200" />
                    <span class="material-symbols-outlined image-show-span" @click="closeImage = false"> close </span>
                </div>
            </div>
        </form>
        <h3 class="mb-2">Add Prizes Pool</h3>
        <p style="width: 650px; text-decoration-line: inherit" class="text-center">
            Add prizes to put on your campaign with the amount of each prize you want to place.
        </p>
        <span class="text-red" v-if="pathName == 'prize'">{{ invalidMessage }}.</span>
        <ClientOnly>
            <table>
                <tr>
                    <th>Name</th>
                    <th>Quantity</th>
                    <th>Action</th>
                </tr>
                <tr v-for="(prize, index) in arrPrizes" :key="index">
                    <td>
                        <div class="select-dropdown select-prize">
                            <select id="prizes" class="resize-none focus:outline-none" name="list of prizes"
                                v-model="prize.prize_id">
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
                            <input id="number-prize" type="number" class="resize-none focus:outline-none"
                                placeholder="15" v-model="prize.quantity" required min="1"
                                @input="checkeQuantity(prize.quantity, index)"
                                :style="pathName == 'quantity' && numberIndex == index ? 'border:2px solid red' : ''" />
                        </div>
                    </td>
                    <td @click="deleteRow(index)">
                        <div id="action-prize">
                            <span class="material-symbols-outlined"> delete </span>
                            <span>Delete</span>
                        </div>
                    </td>
                </tr>
            </table>
        </ClientOnly>

        <button id="add-edit-prize-row" @click="addRow">
            <span class="material-symbols-outlined"> add_circle </span>
        </button>
        <!-- =============================Invite User======================================== -->
        <h3 class="mb-2">Add Collaborator</h3>
        <p style="width: 650px" class="text-center">
            Edit Add more with your collaborators to view your campaign and provide them with some permissions to do
            on the campaign.
        </p>
        <ClientOnly>
            <table class="invite-email">
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
                                <option value="read only">Read only</option>
                                <option value="read and write">Read and write</option>
                            </select>
                        </div>
                    </td>
                    <td @click="deleteRowEmailInvite(index)">
                        <div id="action-prize">
                            <span class="material-symbols-outlined"> delete </span>
                            <span>Delete</span>
                        </div>
                    </td>
                </tr>
            </table>
        </ClientOnly>

        <button id="add-edit-email-invite-row" @click="addRowEmailInvite">
            <span class="material-symbols-outlined"> add_circle </span>
        </button>

        <div id="update-create-campaign-action">
            <BaseButton type="secondary-btn" id="cancel" class="btn-login text-white mr-5" @click="$router.go(-1)">
                Cancel
            </BaseButton>
            <BaseButton type="primary-btn" id="submit" class="btn-login text-white ml-5" @click="addCampaign">Submit
            </BaseButton>
        </div>
    </div>
    <Loading :show="isLoading" :title="loadingTitle" :indefinite="!hasProgressbar" :text="loadingText"
        :progress="uploadProgress" />
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import Loading from "@/components/dialog/Loading.vue";
import { validateCampaignName, validateFile, validateDate } from "@/validation";
import BaseButton from "@/components/widget/BaseButton.vue";
import SearchEmail from "@/components/widget/SearchEmail.vue";
import type { IPrize, IEmailInvite } from "@/types";
import UploadFileCSV from "@/components/UploadFileCSV.vue";
import { defaultCampaignBGURL } from "~/configs";

useSeoMeta({
    title: "New Campaign > Smart | Lucky Draw",
});

// Reference variables
const isLoading = ref<boolean>(false);
const loadingTitle = ref<string>("Creating Campaigns...");
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
const arrPrizes = ref<IPrize[]>([]);
const email = ref<string>("");
const single = ref<string>("single");
const multiple = ref<string>("");
const numberIndex = ref<number>(0);

// Get all prizes for selection

const res = await callAPI("/prize/getAllPrizes");
if (res.code === 200) {
    prizes.value = res.data.data;
}

// ========================Validate type number================================

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

function handleChanceInput() {
    if (number_of_chance.value <= 1) {
        pathName.value = "number_of_chance";
        invalidMessage.value = "Please enter number more than 1";
        number_of_chance.value = Math.max(number_of_chance.value, 1);
    } else {
        resetInvalid();
    }
}

// ================ Close dialog add campaign =================


// ================== Get and validate image=============================
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
// =================================

const handleFileParticipants = (event: any) => {
    const file = event.target.files[0];
    participantsFile.value = file;
};

const addCampaign = async () => {
    const errCampaignName = validateCampaignName(campaign_name.value);
    const errParticipant = validateFile(participantsFile.value);
    const errStartDate = validateDate(start_date.value);
    const errEndDate = validateDate(end_date.value);
    if (errCampaignName) {
        pathName.value = "campaign_name";
        invalidMessage.value = errCampaignName;
        return;
    }
    if (errParticipant) {
        pathName.value = "participant";
        invalidMessage.value = errParticipant;
        return;
    }
    if (errStartDate) {
        pathName.value = "start_date";
        invalidMessage.value = errStartDate;
        return;
    }
    if (errEndDate) {
        pathName.value = "end_date";
        return;
    }
    const prizePool = arrPrizes.value || [];
    if (prizePool.length === 0) {
        invalidMessage.value = "Prize pool is empty";
        pathName.value = "prize";
        return;
    }
    resetInvalid();

    const formData = new FormData();
    formData.set("campaign_name", campaign_name.value);
    formData.set("campaign_image", campaign_image.value || defaultCampaignBGURL);
    formData.set("start_date", start_date.value);
    formData.set("end_date", end_date.value);
    if (participantsFile.value)
        formData.set("participants", participantsFile.value);
    formData.set("prizes", JSON.stringify(arrPrizes.value));
    formData.set("number_of_chance", number_of_chance.value.toString());
    formData.set("invited_email", JSON.stringify(arrEmailInvites.value));

    isLoading.value = true;
    hasProgressbar.value = true;
    let timeout: any;
    loadingText.value = 'Uploading your request to server...'
    const res = await callAPIProgress("/campaign/createCampaign", "POST", formData, (progress: number) => {
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

// ===================== add and remove prize=========================

const addRow = () => {
    if (prizes.value && arrPrizes.value.length < prizes.value.length) {
        const freePrize = prizes.value.find((prize) => !arrPrizes.value.find((ap) => ap.prize_id === prize.id));
        if (freePrize)
            arrPrizes.value.push(<IPrize>{ prize_id: freePrize.id, quantity: 0 });
    }
};

const deleteRow = (index: number) => {
    arrPrizes.value.splice(index, 1);
};

const addRowEmailInvite = () => {
    arrEmailInvites.value.push({
        email: email.value,
        permission: "read only",
    });
};

const deleteRowEmailInvite = (index: number) => {
    arrEmailInvites.value.splice(index, 1);
};

const minStartDate = computed(() => {
    if (start_date.value) {
        const startDate = new Date(start_date.value);
        return startDate.toISOString().split("T")[0];
    }
});

const handleCustomEvent = (email: string, index: number) => {
    arrEmailInvites.value[index] = { email: email, permission: "read only" };
};
</script>

<style scoped src="../../../assets/css/index.css"></style>
