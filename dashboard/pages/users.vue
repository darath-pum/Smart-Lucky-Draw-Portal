<template>
  <!-- <div class="container" > -->
  <section style="width: 100%;">
    <h2 class="header">All Users</h2>
    <p class="desc text-center">
      The User page displays a list of users and offers actions such as
      creating, editing, archiving, and unarchiving users. Additionally, there
      are options to lock or unlock user accounts for efficient user
      management.
    </p>
    <div class="create-user">
      <!-- <router-link to="/register"> -->
      <CreateUser :getUsers="getUsers"></CreateUser>

      <!-- </router-link> -->
    </div>
    <table id="all-user" class="all-user">
      <thead>
        <tr>
          <th class="id">No.</th>
          <th>Profile picture</th>
          <!-- <th>Email</th> -->
          <SortingTable :data="users" :name="'Email'" :columnName="'email'" :page="currentPage" :pageSize="pageSize"
            v-model:sortedColumn="sortedColumnName">
          </SortingTable>
          <SortingTable :data="users" :name="'Username'" :columnName="'first_name'" :page="currentPage"
            :pageSize="pageSize" v-model:sortedColumn="sortedColumnName">
          </SortingTable>
          <SortingTable :data="users" :name="'Role'" :columnName="'role'" :page="currentPage" :pageSize="pageSize"
            v-model:sortedColumn="sortedColumnName"></SortingTable>
          <th>Action</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(item, index) in paginationUsers" :key="item.id">
          <td>{{ index + 1 }}</td>
          <td>
            <div class="profile">
              <img :src="item.profile || defaultAvatarURL" alt="avatar" />
            </div>
          </td>
          <td>
            <p>{{ item.email }}</p>
          </td>
          <td>{{ item.first_name }} {{ item.last_name }}</td>
          <td style="text-transform: capitalize !important">
            {{ item.role }}
          </td>
          <td>
            <div class="action-user pl-2 pr-2" v-if="item.is_locked == false">
              <UpdateUser :userId="item.id" :user="user" :editUser="editUser">
              </UpdateUser>
              <UserConfirm v-if="authStore.email !== item.email" :userId="item.id"
                :title="'Do you want to lock this user?'" :btnName="'Lock user'" :nameIcon="'lock'" :getUsers="getUsers"
                :functionName="'lockUser'">
              </UserConfirm>

              <UserConfirm v-if="authStore.email !== item.email" :userId="item.id"
                :title="'Do you want to archive this user?'" :btnName="'Archive'" :nameIcon="'archive'"
                :getUsers="getUsers" :functionName="'archiveUser'">
              </UserConfirm>
            </div>
            <div class="action-user" v-else>
              <UserConfirm :userId="item.id" :title="'Do you want to unlock this user?'" :btnName="'Unlock user'"
                :nameIcon="'lock_clock'" :getUsers="getUsers" :functionName="'unLockUser'">
              </UserConfirm>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="loader" v-if="loading == true"></div>
    <div v-if="users.length == 0 && loading == false" class="empty-prize">
      <span class="title-empty">Empty</span>
    </div>
    <div class="container-pagination mt-5">
      <v-pagination v-if="users.length > pageSize" :total-visible="pageSize"
        :length="Math.ceil(users.length / pageSize)" v-model="currentPage" size="35px">
      </v-pagination>
    </div>
  </section>

  <section style="width: 100%; margin-bottom: 50px;">
    <h2 v-if="!showArchived" @click="showUserArchived" class="archived-user header">
      <span class="material-symbols-outlined"> arrow_drop_down </span>Archived
      Users
    </h2>
    <h2 v-else="showArchived" @click="closeUserArchived" class="archived-user header">
      <span class="material-symbols-outlined"> arrow_drop_up </span>
      Archived Users
    </h2>

    <table id="archived" :class="showArchived == true
        ? 'tb-user-archived '
        : 'tb-user-archived archieved-none'
        ">
      <thead>
        <tr class="harder-archived">
          <th class="id">No.</th>
          <th>Profile picture</th>
          <th>Email</th>
          <SortingTable :data="archivedUsers" :name="'Username'" :columnName="'first_name'" :page="currentArchivedPage"
            :pageSize="pageSize" v-model:sortedColumn="sortedArchiveColumnName">
          </SortingTable>
          <SortingTable :data="archivedUsers" :name="'Role'" :columnName="'role'" :page="currentArchivedPage"
            :pageSize="pageSize" v-model:sortedColumn="sortedArchiveColumnName">
          </SortingTable>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in paginationArchivedUsers" :key="item.id">
          <td>{{ index + 1 }}</td>
          <td>
            <div class="profile">

              <img :src="item.profile || defaultAvatarURL" alt="avatar" />
            </div>
          </td>
          <td>{{ item.email }}</td>
          <td>{{ item.first_name }} {{ item.last_name }}</td>
          <td style="text-transform: capitalize !important">
            {{ item.role }}
          </td>

          <td>
            <div class="action-user">
              <UserConfirm :userId="item.id" :title="'Do you want to unarchive this user?'" :btnName="'Unarchive'"
                :nameIcon="'unarchive'" :getUsers="getUsers" :functionName="'unarchiveUser'">
              </UserConfirm>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-if="archivedUsers.length == 0 && showArchived" class="empty-prize">
      <span class="title-empty">Empty</span>
    </div>
    <div v-if="showArchived" class="container-pagination mt-5">
      <v-pagination v-if="archivedUsers.length > pageSize" :total-visible="pageSize"
        :length="Math.ceil(archivedUsers.length / pageSize)" v-model="currentArchivedPage" size="35px">
      </v-pagination>
    </div>
  </section>
  <!-- </div> -->
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import UpdateUser from "@/components/dialog/UpdateUser.vue";
import CreateUser from "@/components/dialog/CreateUser.vue";
import UserConfirm from "@/components/dialog/UserConfirm.vue";
import SortingTable from "@/components/widget/SortingTable.vue";
import { defaultAvatarURL } from "@/configs";
import { useAuthStore } from "@/store/auth";
// import { makeAPIRequest } from "~/utils";

const authStore = useAuthStore();

useSeoMeta({
  title: "Manage Users > Smart | Lucky Draw",
});

const loading = ref(false);
// Number of users to be displayed
const pageSize = 10;
// List of all active users
const users = ref<any[]>([]);
// List of all archived users
const archivedUsers = ref<any[]>([]);
// Current page of active users
const currentPage = ref(1);
// Current page of archived users
const currentArchivedPage = ref(1);
// Current sorted column's name of active users
const sortedColumnName = ref("");
// Current sorted column's name of archived users
const sortedArchiveColumnName = ref("");

const paginationUsers = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  const end = start + pageSize;
  return users.value.slice(start, end);
});

const paginationArchivedUsers = computed(() => {
  const start = (currentArchivedPage.value - 1) * pageSize;
  const end = start + pageSize;
  return archivedUsers.value.slice(start, end);
});
const getUsers = async () => {
  loading.value = true;
  archivedUsers.value = [];
  users.value = [];
  const res = await callAPI("/user/getAllUsers");
  loading.value = false;

  const allUsers: any[] = res.data;
  for (let i = 0; i < allUsers.length; i++) {
    if (allUsers[i].is_archived == true) {
      archivedUsers.value.push(allUsers[i]);
    } else {
      users.value.push(allUsers[i]);
    }
  }
};
onMounted(() => {
  getUsers();
});

const user = ref("");
const editUser = (userId: any) => {
  user.value = users.value.find((item) => item.id === userId);
};

const showArchived = ref(false);
const showUserArchived = () => {
  showArchived.value = true;
};
const closeUserArchived = () => {
  showArchived.value = false;
};
</script>

<style scoped>
.header {
  font-size: 2rem;
  font-weight: 600;
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

@keyframes loading {
  from {
    transform: rotate(0turn);
  }

  to {
    transform: rotate(1turn);
  }
}

/* =============================== */
.profile {
  margin: auto;
  height: 50px;
  width: 50px;
}

.profile img {
  margin: auto;
  height: 50px;
  width: 50px;
  border-radius: 100%;
  background: #000;
  object-fit: cover;
}

.all-user {
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  width: 100%;
}

.all-user th,
.all-user td {
  border-right: 1px solid rgba(202, 195, 195, 0.76);
  padding: 0.5rem;
  text-align: center;
}

tbody td:nth-child(6) {
  border-right: 1px solid rgba(255, 255, 255, 0);
}

.all-user th {
  background: #009639;
  color: #ffff;
}

.action-user {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  user-select: none;
}

.action-user div {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.2rem;
  transition: 0.1s;
}

h2 {
  text-align: center;
  margin-bottom: 1rem;
  margin-top: 3%;
  font-size: 1.5rem;
  font-weight: 700;
  cursor: pointer;
}

.create-user {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 2rem;
}

.tb-user-archived thead th {
  background-color: gray;
  color: white;
  padding: 1rem;
  border: 1px solid rgba(202, 195, 195, 0.39);
  padding: 0.5rem;
}

.tb-user-archived {
  transition: all 0.1s;
  opacity: 1;
  margin-top: 60px;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  width: 100%;
}

.archieved-none {
  opacity: 0;
}

.tb-user-archived td {
  border: 1px solid rgba(202, 195, 195, 0.199);
  padding: 0.5rem;
  text-align: center;
}

#all-user tr:nth-child(odd) {
  background-color: #d5dcda;
}

#archived tr:nth-child(odd) {
  background-color: #d5dcda;
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
  cursor: pointer;
}

th:nth-child(3) .material-symbols-outlined {
  position: absolute;
  margin-left: 20px;
  justify-content: flex-end;
}

th:nth-child(3) .material-symbols-outlined:hover {
  user-select: none;
  cursor: pointer;
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

.v-pagination__item--is-active {
  background-color: #00953a;
  color: white;
}

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

th:nth-child(5),
td:nth-child(2),
td:nth-child(5) {
  padding-left: 1rem;
  padding-right: 1rem;
}

th:nth-child(1),
td:nth-child(1) {
  width: 6rem;
}

th:nth-child(2),
td:nth-child(2) {
  width: 10rem;
}


th:nth-child(3),
td:nth-child(3),
th:nth-child(5),
td:nth-child(5),
th:nth-child(4),
td:nth-child(4) {
  width: 20%;
}

th:nth-child(3),
td:nth-child(3) p {
  margin: auto;
  width: auto;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  /* padding: 20px; */

  margin: 0;

}

table {
  width: 100%;
}

@media (max-width: 62.5rem) {

  .action-user {
    gap: 0rem;
  }

}
</style>
