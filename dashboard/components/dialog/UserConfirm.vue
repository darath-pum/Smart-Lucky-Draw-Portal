<template>
  <v-col cols="auto">
    <v-dialog transition="dialog-bottom-transition" width="auto" v-model="isActive">
      <template v-slot:activator="{ props }">
        <BaseButton v-if="btnName == 'Logout'" class="logout" type="primary-btn" v-bind="props">
          <span class="material-symbols-outlined">
            {{ nameIcon }}
          </span>
          <p>{{ btnName }}</p>
        </BaseButton>
        <div v-else class="user-confirm flex flex-row text-center justify-center items-center"
          :id="nameIcon == 'unarchive' ? 'unarchive' : 'archive'" v-bind="props">
          <i class="material-symbols-outlined">
            {{ nameIcon }}
          </i>
          <span id="btn-name" class="text-black">{{ btnName }}</span>
        </div>
      </template>

      <template v-slot:default="{ isActive }">
        <div class="delete-form p-5">
          <img src="/images/smart-logo2.png" alt="" />
          <h1 class="dialog-title pb-6 text-center">{{ title }}</h1>
          <div class="d-flex flex-row justify-between ml-20 mr-20">
            <BaseButton type="secondary-btn" class="btn-login text-white" @click="isActive.value = false">
              No
            </BaseButton>
            <BaseButton type="primary-btn" @click="handleButtonClick" class="btn-login text-white" :loading="loading">
              Yes
            </BaseButton>
          </div>
        </div>
      </template>
    </v-dialog>
  </v-col>
</template>

<script setup lang="ts">
import { ref } from "vue";
import BaseButton from "../widget/BaseButton.vue";
import { getAPIURL } from "../../configs";

const props = defineProps([
  "campaignId",
  "getCampaigns",
  "userId",
  "prizeId",
  "title",
  "btnName",
  "nameIcon",
  "functionName",
  "getUsers",
  "getPrizes",
]);

const loading = ref(false);
const isActive = ref(false);

const handleButtonClick = async () => {
  loading.value = true;

  const endpoints: any = {
    lockUser: `/user/updateLockUser/${props.userId}`,
    unLockUser: `/user/updateLockUser/${props.userId}`,
    archiveUser: `/user/updateArchiveUser/${props.userId}`,
    unarchiveUser: `/user/updateArchiveUser/${props.userId}`,
    archivePrize: `/prize/updateArchivePrize/${props.prizeId}`,
    unarchivePrize: `/prize/updateArchivePrize/${props.prizeId}`,
    archiveCampaign: `/campaign/updateArchiveCampaign/${props.campaignId}`,
    unArchiveCampaign: `/campaign/updateArchiveCampaign/${props.campaignId}`,
    logout: "/auth/logout",
  };

  const payloads: any = {
    lockUser: { is_locked: true },
    unLockUser: { is_locked: false },
    archiveUser: { is_archived: true },
    unarchiveUser: { is_archived: false },
    archivePrize: { is_archived: true },
    unarchivePrize: { is_archived: false },
    archiveCampaign: { is_archived: true },
    unArchiveCampaign: { is_archived: false },
    logout: {},
  };

  const endpoint = getAPIURL(endpoints[props.functionName]);

  const payload = payloads[props.functionName];

  let method = "put";
  if (props.functionName == "logout") {
    method = "post";
  }

  let res = await callAPI(endpoints[props.functionName], method, payload);
  if (res.status === 200) {
    isActive.value = false;
    loading.value = false;
    if (props.functionName === "logout") {
      window.location.href = "/login";
    }
    if (props.functionName == "archiveCampaign" || props.functionName == "unArchiveCampaign") {
      props.getCampaigns();
    }
    if (
      props.functionName == "archiveUser" ||
      props.functionName == "unarchiveUser" ||
      props.functionName == "lockUser" ||
      props.functionName == "unLockUser"
    ) {
      props.getUsers();
    }
    if (props.functionName == "unarchivePrize" || props.functionName == "archivePrize") {
      props.getPrizes();
    }
  }
};
</script>

<style scoped>
input,
textarea {
  border: 1px solid rgb(36, 90, 31);
  color: white;
  margin: 2%;
  padding: 2%;
}

h1 {
  color: #ffff;
  font-size: 1.5rem;
  margin-bottom: 5%;
}

.delete span {
  font-family: sans-serif;
  font-size: 0.7rem;
  position: absolute;
  z-index: 1000;
  display: flex;
  color: #000000;
  margin: 0.1rem 1rem;
  opacity: 0;
  visibility: hidden;
  border-bottom: 1px solid #ffff;
  background-color: #ffffff;
  width: auto;
  transition: all 0.2s;
  padding: 1%;
  gap: 20px;
}

.delete:hover .span {
  opacity: 1;
  visibility: visible;
}

#unachive,
#archive {
  margin: auto;
  /* width: 100px; */
  padding: 0.5rem;
  transition: all 0.1s;
}

#unachive:hover,
#archive:hover {
  transition: all 0.1s;
  background: #a7a1a1;
  cursor: pointer;
}

.delete-form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: #ffff;
  width: 400px;
  padding-bottom: 50px;
}

.delete-form img {
  width: 200px;
  margin: auto;
  padding: 0px 20px 20px 20px;
}

span {
  color: #ffff;
}

.dialog-title {
  color: #009639;
  font-weight: 600;
}

.action-user {
  display: flex;
  flex-direction: row;
  gap: 1rem;
  justify-content: center;
}

.action-user div {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.2rem;
  transition: 0.1s;
}

.action-user div:hover {
  cursor: pointer;
  transition: 0.1s;
}

.archived-user {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.1s;
}

.archived-user .material-symbols-outlined {
  font-size: 2.5rem;
}

.logout p {
  padding-left: 0.5rem;
}

.logout {
  padding: 0.5rem;
  width: 250px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  gap: 0.5rem;
  color: #ffff;
  cursor: pointer;
  transition: 0.1s;
}


@media (max-width: 1000px) {
  .user-confirm #btn-name {
    opacity: 0;
    position: absolute;
    background: #686464;
    margin-top: -4.6rem;
    padding: 0.2rem 0.1rem;
    color: white !important;
    border-radius: 0.5rem;
    width: 5rem;
  }

  .user-confirm:hover #btn-name {
    opacity: 1;
    color: #ffffff;
  }
}

@media (max-width: 48rem) {
  .play {
    width: 100%;
    height: 200px;
  }

  img {
    width: 140px;
  }
  .button p {
    font-size: 10px;
  }

  form {
    width: 90%;
  }

}
</style>
