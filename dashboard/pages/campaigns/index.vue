<template>
  <!-- <div class="container"> -->
  <section style="width: 100%;">
    <h2>All Campaigns</h2>
    <p id="campaign-desc" class="text-center mt-5">
      The Campaign page allows users to view and manage campaigns efficiently. Users can access a list of
      campaigns, create new ones, edit existing campaigns, and archive or unarchive them as needed, all
      within a user-friendly interface.
    </p>
    <div class="create-campaign">
      <NuxtLink to="/campaigns/new">
        <BaseButton type="primary-btn" class="btn-add-campaign" v-if="authStore.role !== 'guest'">
          <i class="material-symbols-outlined"> add </i>
          Add Campaigns
        </BaseButton>
      </NuxtLink>
    </div>
    <table class="all-campaigns">
      <thead>
        <tr>
          <th>No.</th>
          <th>Background picture</th>
          <SortingTable :data="campaigns" :pageSize="pageSize" :name="'Campaign Name'"
            v-model:sortedColumn="sortedColumnName" :columnName="'campaign_name'"></SortingTable>
          <SortingTable :data="campaigns" :page="currentPage" :pageSize="pageSize" :name="'Start Date'"
            v-model:sortedColumn="sortedColumnName" :columnName="'start_date'"></SortingTable>
          <SortingTable :data="campaigns" :page="currentPage" :pageSize="pageSize" :name="'End Date'"
            v-model:sortedColumn="sortedColumnName" :columnName="'end_date'"></SortingTable>
          <SortingTable :data="campaigns" :page="currentPage" :pageSize="pageSize" :name="'Status'"
            v-model:sortedColumn="sortedColumnName" :columnName="'status'"></SortingTable>

          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in paginationCampaigns" :key="item.id">
          <td class="number_order">
            <div class="flex flex-row justify-center">
              <span></span> <span>{{ index + 1 }}</span>
            </div>
          </td>
          <td>
            <div class="flex flex-row justify-center">
              <img class="image-campaign" :src="(item.campaign_image == 'undefined' ? defaultCampaignBGURL : item.campaign_image) ||
                defaultCampaignBGURL
                " alt="" />
            </div>
          </td>
          <td>{{ item.campaign_name }}</td>
          <td>{{ new Date(item.start_date).toLocaleDateString() }}</td>
          <td>{{ new Date(item.end_date).toLocaleDateString() }}</td>
          <td>{{ item.status }}</td>
          <td>
            <div class="action-icon">
              <NuxtLink :to="`/campaigns/edit/${item.id}`" class="edit flex">
                <span class="material-symbols-outlined"> edit </span>
                <p id="edit-content">Edit</p>
              </NuxtLink>

              <div class="copy" @click="copyLink(item.id, index)"
                :style="isCopy == true && numberIndex == index ? '' : ''">
                <span class="material-symbols-outlined"> content_copy </span>
                <p id="content">Link</p>
                <p :id="isCopy == true && numberIndex == index ? 'copied' : 'copy'" class="flex flex-row">
                  <span class="material-symbols-outlined"> done </span><span>Copied</span>
                </p>
              </div>

              <UserConfirm :campaignId="item.id" :title="'Do you want to archive this campaign?'" :btnName="'Archive'"
                :nameIcon="'archive'" :getCampaigns="getCampaigns" :functionName="'archiveCampaign'">
              </UserConfirm>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="loader" v-if="loading == true"></div>

    <div v-if="campaigns.length == 0 && loading == false" class="empty-campaign">
      <span class="title-empty">Empty</span>
    </div>
    <div class="container-pagination mt-5">
      <v-pagination v-if="campaigns.length > pageSize" :total-visible="pageSize"
        :length="Math.ceil(campaigns.length / pageSize)" v-model="currentPage" size="35px">
      </v-pagination>
    </div>
  </section>
  <section style="width: 100%;">
    <h2 class="archieved" v-if="!isShowArchieved" @click="showArchieved">
      <span class="material-symbols-outlined">arrow_drop_down</span>
      Archived Campaigns
    </h2>
    <h2 v-else @click="closeArchieved" class="archieved">
      <span class="material-symbols-outlined">arrow_drop_up</span>Archived Campaigns
    </h2>
    <table :class="isShowArchieved == true ? 'archieved-campaign' : 'archieved-campaign archieved-none'">
      <thead>
        <tr>
          <th>No.</th>
          <th>Background picture</th>
          <SortingTable :data="archivedCampaigns" :page="currentArchivedPage" :pageSize="pageSize"
            :name="'Campaign Name'" v-model:sortedColumn="sortedColumnArchiveName" :columnName="'campaign_name'">
          </SortingTable>
          <SortingTable :data="archivedCampaigns" :page="currentArchivedPage" :pageSize="pageSize" :name="'Start Date'"
            v-model:sortedColumn="sortedColumnArchiveName" :columnName="'start_date'">
          </SortingTable>
          <SortingTable :data="archivedCampaigns" :page="currentArchivedPage" :pageSize="pageSize" :name="'End Date'"
            v-model:sortedColumn="sortedColumnArchiveName" :columnName="'end_date'">
          </SortingTable>
          <SortingTable :data="archivedCampaigns" :page="currentArchivedPage" :pageSize="pageSize" :name="'Status'"
            v-model:sortedColumn="sortedColumnArchiveName" :columnName="'status'"></SortingTable>

          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in paginationArchivedCampaigns" :key="item.id">
          <td>{{ index + 1 }}</td>
          <td>
            <div class="flex flex-row justify-center">
              <img class="image-campaign" :src="(item.campaign_image == 'undefined' ? defaultCampaignBGURL : item.campaign_image) ||
                defaultCampaignBGURL
                " alt="campaign_bg" />
            </div>
          </td>
          <td>{{ item.campaign_name }}</td>
          <td>{{ item.start_date.substring(0, 10) }}</td>
          <td>{{ item.end_date.substring(0, 10) }}</td>
          <td>{{ item.status }}</td>
          <td>
            <div class="action-icon">
              <UserConfirm :campaignId="item.id" :title="'Do you want to unarchive this campaign?'"
                :btnName="'Unarchive'" :nameIcon="'unarchive'" :getCampaigns="getCampaigns"
                :functionName="'unArchiveCampaign'">
              </UserConfirm>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="archivedCampaigns.length == 0 && isShowArchieved" class="empty-campaign">
      <span class="title-empty">Empty</span>
    </div>
    <div v-if="isShowArchieved" class="container-pagination mt-5">
      <v-pagination v-if="archivedCampaigns.length > pageSize" :total-visible="pageSize"
        :length="Math.ceil(archivedCampaigns.length / pageSize)" v-model="currentArchivedPage" size="35px">
      </v-pagination>
    </div>
  </section>
  <!-- </div> -->
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import UserConfirm from "@/components/dialog/UserConfirm.vue";
import BaseButton from "@/components/widget/BaseButton.vue";
import SortingTable from "@/components/widget/SortingTable.vue";
import { useAuthStore } from "@/store/auth";
import type { ICampaign } from "@/types";
import { defaultCampaignBGURL, gameURL } from "@/configs";

useSeoMeta({
  title: "Campaigns > Smart | Lucky Draw",
});

const authStore = useAuthStore();
const loading = ref(true);
const pageSize = 10;
// List of all active users
const campaigns = ref<ICampaign[]>([]);
// List of all archived users
const archivedCampaigns = ref<ICampaign[]>([]);
// Current page of active users
const currentPage = ref(1);
// Current page of archived users
const currentArchivedPage = ref(1);
// Current sorted column's name of active users
const sortedColumnName = ref("");
const sortedColumnArchiveName = ref("");
// Current sorted column's name of archived users

const paginationCampaigns = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  const end = start + pageSize;
  return campaigns.value.slice(start, end);
});

const paginationArchivedCampaigns = computed(() => {
  const start = (currentArchivedPage.value - 1) * pageSize;
  const end = start + pageSize;
  return archivedCampaigns.value.slice(start, end);
});

const isShowArchieved = ref(false);

const showArchieved = () => {
  isShowArchieved.value = true;
};

function closeArchieved() {
  isShowArchieved.value = false;
}

// Find condition status

const checkCampaignStatus = (item: ICampaign) => {
  const today = new Date();
  const startDate = new Date(item.start_date);
  const endDate = new Date(item.end_date);
  if (today > endDate) {
    item.status = "Expired";
  } else if (today >= startDate) {
    item.status = "Active";
  } else {
    item.status = "Upcoming";
  }
};

const getCampaigns = async () => {
  archivedCampaigns.value = [];
  campaigns.value = [];
  loading.value = true;
  const res = await callAPI("/campaign/getAllCampaigns");
  loading.value = false;
  if (res.code === 200) {
    let allCampsign = <ICampaign[]>res.data;
    for (let i = 0; i < allCampsign.length; i++) {
      checkCampaignStatus(allCampsign[i]);
      if (allCampsign[i].is_archived == true) {
        archivedCampaigns.value.push(allCampsign[i]);
      } else {
        campaigns.value.push(allCampsign[i]);
      }
    }
  } else {
    console.error("Error getting all campaigns: ", res);
  }
};

onMounted(() => {
  getCampaigns();
});

const isCopy = ref(false);
const numberIndex = ref<number>();
const copyLink = (campaignId: string, index: number) => {
  const link = `${gameURL}?cid=${campaignId}`;

  if (navigator.clipboard) {
    // Use the Clipboard API if available
    navigator.clipboard.writeText(link)
      .then(() => {
        isCopy.value = true;
        numberIndex.value = index;
        setTimeout(() => {
          isCopy.value = false;
        }, 800);
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  } else {
    // Fallback for browsers that do not support the Clipboard API
    const textarea = document.createElement('textarea');
    textarea.value = link;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);

    isCopy.value = true;
    numberIndex.value = index;
    setTimeout(() => {
      isCopy.value = false;
    }, 800);
  }
};
</script>

<style scoped>
.action .material-symbols-outlined {
  position: relative;
}

#copy {
  position: absolute;
  color: #000000;
  visibility: hidden;
  font-weight: 500;
  transform: translateY(30px);
  transition: 0s;
  background: #ffffff;
  border: 1px solid #0000006b;
  margin-left: 30px;
}

#copied {
  margin-left: 30px;
  position: absolute;
  background: #ffffff;
  border: 1px solid #00000069;
  padding: 0.2rem;
  width: 6rem;
  font-weight: 500;
  color: #413d3d;
  transform: translateY(-30px);
  transition: 0.5s;
}

.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: auto;
  padding-bottom: 100px;
}

.archieved {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.archieved .material-symbols-outlined {
  font-size: 2.5rem;
  cursor: pointer;
}

.btn-add-campaign {
  margin-top: 3rem;
  color: white;
  padding: 25px 25px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  font-size: 1rem;
}

.btn-add-campaign i {
  font-weight: 500;
  font-size: 1.5rem;
}

h2 {
  text-align: center;
  margin-bottom: 0%;
  margin-top: 3%;
  font-size: 2rem;
  font-weight: 600;
  cursor: pointer;

}

.image-campaign {
  width: 100px;
}

.create-campaign {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 10px;
}

#btn-add_campaign {
  background-color: green;
  color: white;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  padding: 0.5rem;
}

table {
  border-collapse: collapse;
  margin-top: 40px;
  margin-bottom: 50px;
  text-align: center;
  font-family: Arial, Helvetica, sans-serif;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  width: 100%;
}

td {
  border-right: 1px solid rgba(202, 195, 195, 0.507);
}

th {
  border-right: 1px solid rgba(202, 195, 195, 0.507);
}

tbody td:nth-child(7) {
  border-right: 1px solid rgba(202, 195, 195, 0);
}

tr td:nth-child(2) img {
  margin: auto;
}

.all-campaigns thead th {
  background-color: rgb(18, 142, 18);
  color: white;
  padding: 0.6rem;
}

.archieved-campaign thead th {
  background-color: gray;
  color: white;
  padding: 10px;
}

.archieved-campaign {
  width: 100%;
  opacity: 1;
  transition: all 0.1s;
}

.archieved-none {
  opacity: 0;
  transition: all 0.1s;
}

tbody td {
  padding: 10px;
}

.id {
  width: 5%;
}

.archieved-campaign tr:nth-child(odd) {
  background-color: #d5dcda;
}

.all-campaigns tr:nth-child(odd) {
  background-color: #d5dcda;
}

.action-icon {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  height: 90px;
  user-select: none;
}

.action-icon div,
.action-icon a {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 0.5rem;
  transition: all 0.1s;
}

.action-icon .edit:hover,
.action-icon .copy:hover {
  background: #a7a1a1;
  transition: all 0.1s;
  cursor: pointer;
}

th:nth-child(1) {
  width: 400px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

th .material-symbols-outlined {
  position: absolute;
  justify-content: flex-end;
  user-select: none;
  cursor: pointer;
}

th {
  user-select: none;
  cursor: pointer;
}

th:nth-child(1),
td:nth-child(1) {
  width: 5rem;
}

th:nth-child(2),
td:nth-child(2) {
  width: 10rem;
}

th:nth-child(7),
td:nth-child(7) {
  width: 25rem;
}

th:nth-child(3),
td:nth-child(3),
th:nth-child(5),
td:nth-child(5),
th:nth-child(6),
td:nth-child(6),
th:nth-child(4),
td:nth-child(4) {
  width: 15rem;
}

.empty-campaign {
  margin-top: -50px;
  background-color: #b5b2b2;
  padding: 15%;
  height: 60px;
}

.title-empty {
  display: flex;
  justify-content: center;
  font-size: x-large;
  color: rgb(118, 113, 113);
  margin-top: -4%;
}

/* =========================================== */

.icon-change {
  z-index: 100;
  cursor: pointer;
  margin-top: 20px;
}

.change {
  position: fixed;
  background: rgb(174, 168, 168);
  padding: 0.2rem;
  opacity: 0;
  visibility: hidden;
  transition: 0.1s;
  color: #ffff;
}

.icon-change:hover .change {
  opacity: 1;
  visibility: visible;
  transition: 0.1s;
  z-index: 100;
}

.icon-change span {
  font-size: 2rem;
}

/* =========================================== */
.copy-link .copy-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  background: #009639;
  padding: 5px 10px 10px 20px;
  color: #f1c400;
  font-weight: 500;
  font-size: 1.5rem;
}

.copy-header i {
  cursor: pointer;
  transition: all 0.1s linear;
}

.copy-header i:hover {
  background: #ffff;
  transition: all 0.1s linear;
  color: red;
  border-radius: 100px;
}

.copy-link div {
  background: #ffff;
  width: 600px;
  /* height: 100px; */
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.copy-link div input {
  margin: 20px;
  width: 500px;
  padding: 5px;
  border: 1px solid #009639;
}

textarea:focus,
.copy-link div input:focus {
  outline: none;
}

.loader {
  top: 0;
  left: 0;
  width: auto;
  margin-top: -50px;
  height: 20rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #33333393;
}

.loader::after {
  content: "";
  width: 75px;
  height: 75px;
  border: 10px solid #dddddd;
  border-top-color: #009639;
  border-radius: 50%;
  animation: loading 0.5s ease infinite;
}

@keyframes loading {
  from {
    transform: rotate(0turn);
  }

  to {
    transform: rotate(1turn);
  }
}

/* ================================== */

@media (max-width: 1000px) {
  .copy #content {
    opacity: 0;
    position: absolute !important;
    background: #686464;
    margin-top: -4.6rem;
    padding: 0.2rem 1rem;
    color: white;
    border-radius: 0.5rem;
  }

  .copy:hover #content {
    opacity: 1;
  }

  .edit #edit-content {
    opacity: 0;
    position: absolute !important;
    background: #686464;
    margin-top: -4.6rem;
    padding: 0.2rem 0.1rem;
    color: white !important;
    border-radius: 0.5rem;
    width: 5rem;
  }

  .edit:hover #edit-content {
    opacity: 1;
    color: #ffffff;

  }
}
</style>
