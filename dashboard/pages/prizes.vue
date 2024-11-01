<template>
  <!-- List Prize -->
  <!-- <div class="container"> -->
  <h1 class="text-header">All Prizes</h1>
  <div class="paragraph">
    <p>
      The Prize page is where users can view a list of available prizes and
      perform actions such as creating, editing, archiving, and unarchiving.
      It provides an intuitive interface with buttons for each action,
      allowing users to efficiently manage the prizes. Users can easily create
      new prizes, modify existing ones, and control their visibility by
      archiving or unarchiving them as needed.
    </p>
  </div>
  <section class="prize-list">
    <div class="button-create">
      <div class="create-prize">
        <BaseButton type="primary-btn" @click="createPrize" id="btn-add-prize">
          <i class="material-symbols-outlined"> add </i><span>Add Prize</span>
        </BaseButton>
      </div>
      <dialogCreateEditPrize :for-edit="false" />
      <dialogCreateEditPrize ref="editDialog" :for-edit="true" />
      <dialogCreateEditPrize ref="createDialog" :for-create="true" />
    </div>
    <table>
      <thead>
        <tr>
          <th>No.</th>
          <th>
            <span>Prize image</span>
          </th>
          <SortingTable :data="prizes" :name="'Prize Name (English)'" :columnName="'english_name'" :page="currentPage"
            :pageSize="pageSize" v-model:sortedColumn="sortedColumnName">
          </SortingTable>
          <SortingTable :data="prizes" :name="'Prize Name (Khmer)'" :columnName="'khmer_name'" :page="currentPage"
            :pageSize="pageSize" v-model:sortedColumn="sortedColumnName">
          </SortingTable>
          <th>
            <span>Action</span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(prize, index) in paginationPrize" :key="index">
          <td>{{ index + 1 }}</td>
          <td>
            <div class="img">
              <img :src="prize.prize_image" alt="" />
            </div>
          </td>
          <td>{{ prize.english_name }}</td>
          <td>{{ prize.khmer_name }}</td>
          <td>
            <div class="action-container">
              <div class="edit-action" @click="editPrize(prize)">
                <span class="material-symbols-outlined">edit_square</span>
                <span class="edit-text">Edit</span>
              </div>
              <div class="action-container">
                <UserConfirm :prizeId="prize.id" :title="'Do you want to archive this prize?'" :btnName="'Archive'"
                  :nameIcon="'archive'" :getPrizes="getPrizes" :functionName="'archivePrize'">
                </UserConfirm>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="loader" v-if="loading == true"></div>
    <div v-if="prizes.length == 0 && loading == false" class="empty-prize">
      <span class="title-empty">Empty</span>
    </div>
    <div class="container-pagination flex-row justify-center">
      <v-pagination v-if="prizes.length > pageSize" :total-visible="pageSize"
        :length="Math.ceil(prizes.length / pageSize)" v-model="currentPage" size="35px">
      </v-pagination>
    </div>
  </section>

  <!-- Archived Prize-->

  <section class="prize-archived">
    <h2 v-if="!showArchievPrize" @click="showArchieve" class="header">
      <span class="material-symbols-outlined"> arrow_drop_down </span>Archived
      Prizes
    </h2>
    <h2 v-if="showArchievPrize" @click="UnshowArchieve" class="header">
      <span class="material-symbols-outlined"> arrow_drop_up </span>
      Archived Prizes
    </h2>
    <table :class="showArchievPrize == true ? 'archive-prize-show' : 'archive-prize-none'
          ">
      <thead>
        <tr>
          <th>No.</th>
          <th>
            <span>Prize image</span>
          </th>
          <SortingTable :data="archivePrizes" :name="'Prize Name (English)'" :columnName="'english_name'"
            :page="currentArchivedPage" :pageSize="pageSize" v-model:sortedColumn="sortedArchiveColumnName">
          </SortingTable>
          <SortingTable :data="archivePrizes" :name="'Prize Name (Khmer)'" :columnName="'khmer_name'"
            :page="currentArchivedPage" :pageSize="pageSize" v-model:sortedColumn="sortedArchiveColumnName">
          </SortingTable>
          <th>
            <span>Action</span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(prize, index) in paginationArchivedPrize" :key="index">
          <td>{{ index + 1 }}</td>
          <td>
            <div class="img">
              <img :src="prize.prize_image" alt="" />
            </div>
          </td>
          <td>{{ prize.english_name }}</td>
          <td>{{ prize.khmer_name }}</td>
          <td>
            <div class="action-container">
              <UserConfirm :prizeId="prize.id" :title="'Do you want to unarchive this prize?'" :btnName="'Unarchive'"
                :nameIcon="'unarchive'" :getPrizes="getPrizes" :functionName="'unarchivePrize'">
              </UserConfirm>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-if="archivePrizes.length == 0 && showArchievPrize" class="empty-prize">
      <span class="title-empty">Empty</span>
    </div>
    <div class="container-pagination" v-if="showArchievPrize">
      <v-pagination v-if="archivePrizes.length > pageSize" :total-visible="pageSize"
        :length="Math.ceil(archivePrizes.length / pageSize)" v-model="currentArchivedPage" size="35px">
      </v-pagination>
    </div>
  </section>
  <!-- </div> -->
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import UserConfirm from "@/components/dialog/UserConfirm.vue";
import dialogCreateEditPrize from "@/components/dialog/CreateAndEditPrize.vue";
import SortingTable from "@/components/widget/SortingTable.vue";
import BaseButton from "@/components/widget/BaseButton.vue";
import { useRoute } from "vue-router";

useSeoMeta({
  title: "Prizes > Smart | Lucky Draw",
});

const loading = ref(false);
const route = useRoute();
const showArchievPrize = ref(false);
const editDialog = ref<any>(null);
const createDialog = ref<any>(null);
const isAddPrize: any = ref(false);

const showArchieve = () => {
  showArchievPrize.value = true;
};
const UnshowArchieve = () => {
  showArchievPrize.value = false;
};

// Number of prizes to be displayed
const pageSize = 10;
// List of all active prizes
const prizes = ref<any[]>([]);
// List of all archived prizes
const archivePrizes = ref<any[]>([]);
// Current page of active prizes
const currentPage = ref(1);
// Current page of archived prizes
const currentArchivedPage = ref(1);
// Current sorted column's name of active prizes
const sortedColumnName = ref("");
// Current sorted column's name of archived prizes
const sortedArchiveColumnName = ref("");

const paginationPrize = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  const end = start + pageSize;
  return prizes.value.slice(start, end);
});

const paginationArchivedPrize = computed(() => {
  const start = (currentArchivedPage.value - 1) * pageSize;
  const end = start + pageSize;
  return archivePrizes.value.slice(start, end);
});
// Get all prizes api
const getPrizes = async () => {
  archivePrizes.value = [];
  prizes.value = [];
  loading.value = true;
  const res = await callAPI("/prize/getAllPrizes");
  loading.value = false;
  if (res.status == 200) {
    const listPrize = res.data.data;
    for (let i = 0; i < listPrize.length; i++) {
      if (listPrize[i].is_archived == true) {
        archivePrizes.value.push(listPrize[i]);
      } else {
        prizes.value.push(listPrize[i]);
      }
    }
  }
};

onMounted(() => {
  isAddPrize.value = route.query.isAddPrize;
  if (isAddPrize.value) {
    createPrize();
  }
  getPrizes();
});

//show edit prize form
const editPrize = (prize: any) => {
  try {
    if (editDialog) editDialog.value.showDialogEdit(prize);
  } catch (error) { }
};
//show create prize form
const createPrize = () => {
  try {
    if (createDialog) createDialog.value.showDialogCreate();
  } catch (error) { }
};
</script>

<style scoped>
.create-prize {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}

#btn-add-prize {
  margin-top: 3rem;
  color: white;
  padding: 25px 20px;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  font-size: 1rem;
}

#btn-add-prize i {
  font-weight: 500;
  font-size: 1.5rem;
}

.text-header {
  text-align: center;
  font-size: 2rem;
  font-weight: 600;
  margin: 20px;
}

.paragraph {
  text-align: center;
}

.container {
  margin: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.header {
  font-size: 2rem;
}

.prize-list,
.prize-archived {
  width: 100%;
}

.prize-list table {
  border-collapse: collapse;
  margin-top: 3%;
  text-align: center;
  font-family: Arial, Helvetica, sans-serif;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  width: 100%;
}

.prize-archived table {
  border-collapse: collapse;
  margin-top: 6%;
  text-align: center;
  font-family: Arial, Helvetica, sans-serif;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  width: 100%;
}

h2 {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  text-align: center;
  margin-bottom: 1rem;
  margin-top: 3%;
  font-size: 1.5rem;
  font-weight: 700;
  cursor: pointer;
  user-select: none;
}

.prize-archived .material-symbols-outlined {
  font-size: 2.5rem;
}

thead th {
  width: 300px;
}

td img {
  width: 60px;
  height: 60px;
  object-fit: cover;
}

.img {
  justify-content: center;
  display: flex;
  margin: 10px;
}

.prize-list thead th {
  background-color: #00953a;
  color: white;
  padding: 10px;
}

.prize-archived thead th {
  background-color: #545050;
  color: white;
  padding: 10px;
}

tbody td {
  /* padding: 10px; */
  border-right: 1px solid #b8b3b39d;
}

tbody td:nth-child(5) {
  /* padding: 10px; */
  border-right: 1px solid #ffffff00;
}

th {
  border-right: 1px solid #b8b3b3b2;
}

.archive-prize-none {
  opacity: 0;
}

.archive-prize-show {
  opacity: 1;
}

.id {
  width: 70px;
}

tr:nth-child(odd) {
  background-color: #d5dcda;
}

#delete {
  font-size: 32px;
  color: red;
}

#unarchive {
  font-size: 32px;
}

.action-container {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}

input {
  cursor: pointer !important;
}

.edit-action {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 2px 5px;
  height: 40px;
  margin-left: 0.5rem;
  transition: all 0.1s;
}

.edit-action:hover {
  transition: all 0.1s;
  background: #a7a1a1;
  cursor: pointer;
}

.edit-action .edit-text {
  font-size: 1rem;
}

.unarchiev-action {
  display: flex;
  align-items: center;
}

.container-pagination {
  margin-top: 40px;
}

/* th,
td {
  border-right: 1px solid rgba(202, 195, 195, 0.623);
} */

.empty-prize {
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

/* ======================== loading ====================== */
.loader {
  top: 0;
  left: 0;
  width: auto;

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

th:nth-child(1),
td:nth-child(1) {
  width: 5rem;
}

th:nth-child(2),
td:nth-child(2) {
  width: 15rem;
}

@keyframes loading {
  from {
    transform: rotate(0turn);
  }

  to {
    transform: rotate(1turn);
  }
}

@media (max-width: 1000px) {
  .edit-action .edit-text {
    opacity: 0;
    position: absolute;
    background: #686464;
    margin-top: -4.6rem;
    padding: 0.2rem 0.1rem;
    color: white !important;
    border-radius: 0.5rem;
    width: 5rem;
  }

  .edit-action:hover .edit-text {
    opacity: 1;
    color: #ffffff;
  }
}


/* =============================== */
</style>
