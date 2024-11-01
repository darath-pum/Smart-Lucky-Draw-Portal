<template>
  <div class="grid-container">
    <div :class="show == true ? 'dashboard green sidebar-left' : 'dashboard green sidebar-left-dialog'">
      <span id="menu" v-if="!show" class="material-symbols-outlined text-white" @click="() => (show = true)">menu</span>
      <span v-else class="material-symbols-outlined close" @click="() => (show = false)">close</span>
      <NuxtLink to="/" v-if="show"><img src="/images/smart-logo.png" alt="home" /></NuxtLink>
      <hr />
      <div>
        <NuxtLink v-if="authStore.role == 'admin'" :class="show == true ? 'manage-user active mt-16' : 'active icon'"
          to="/users">
          <span class="material-symbols-outlined dashboard-categorires-icon">person</span>
          <p v-if="show">Manage users</p>
        </NuxtLink>

        <NuxtLink :class="(show == true ? 'compaigns active' : 'active icon')" to="/campaigns">
          <span class="material-symbols-outlined">brand_awareness</span>
          <p v-if="show">Campaigns</p>
        </NuxtLink>
        <NuxtLink :class="show == true ? 'prizes active' : 'active icon'" to="/prizes">
          <span class="material-symbols-outlined dashboard-categorires-icon">rewarded_ads</span>
          <p v-if="show">Prizes</p>
        </NuxtLink>
        <NuxtLink :class="show == true ? 'reports active' : 'active icon'" to="/reports">
          <span class="material-symbols-outlined dashboard-categorires-icon">problem</span>
          <p v-if="show">Reports</p>
        </NuxtLink>
      </div>
    </div>
    <div class="nav green z-auto" :class="show == true ? 'nav green' : 'nav green nav-two'">
      <div class="nav-left">
        <NuxtLink to="/" v-if="show == false"><img src="/images/smart-logo.png" alt="home" /></NuxtLink>
      </div>
      <div class="nav-center">
        <p>Smart Lucky Draw Portal</p>
      </div>
      <div class="nav-right">
        <DialogProfile></DialogProfile>
        <span class="user-name">{{ authStore.first_name }}</span>
      </div>
    </div>
    <div :class="show == true ? 'main-expand' : 'main-collapse'">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import DialogProfile from "@/components/dialog/Profile.vue";
import { useAuthStore } from "@/store/auth";
const authStore = useAuthStore();
const show = ref(false);
useSeoMeta({
  title: "Admin Home > Smart | Lucky Draw",
});
</script>

<style scoped>
.grid-container {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-template-rows: auto auto auto;
  gap: 10px;
}

.grid-container>.green {
  background-color: #009639;
  text-align: center;
  padding: 20px 0;
  font-size: 30px;
}

.nav-center p {
  font-weight: 700;
  font-size: 2rem !important;
}

hr {
  margin-top: 76px;
  border: 2px solid white;
  width: 100%;
}

.dashboard {
  background-color: #009639;
  z-index: 1;
  position: fixed;
  height: 100%;
  bottom: 0;
  /* width: 320px; */

  box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px,
    rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
}

.sidebar-left-dialog {
  width: 100px;
}

.sidebar-left-dialog .material-symbols-outlined {
  font-size: 2rem;
  cursor: pointer;
}

.close {
  display: flex;
  margin-left: 20px;
  text-align: start;
  font-size: 2rem;
  color: white;
  cursor: pointer;
  width: 32px;
}

a.active.icon {
  margin-bottom: -10px;
}

.dashboard img {
  margin-top: -50px;
  position: absolute;
  display: flex;
  text-align: center;
  margin-left: 75px;
  width: 180px;
}

#menu {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  position: absolute;
  font-size: 3rem;
  top: 0;
  height: 100px;
}

.dashboard .active {
  padding-bottom: 50px;
  padding-left: 5%;

  display: flex;
  flex-direction: row;
  align-items: center;
  text-decoration: none;
  transform: 0.1s;
  /* width: 200px; */
}

.active p a {
  color: white;
  text-decoration: none;
}

.dashboard .icon {
  width: 100px;
}

.icon .material-symbols-outlined {
  margin: 30px 0 10px 0;
}

.active {
  color: white;
  text-align: start;
  font-size: 1.7rem;
  white-space: nowrap;
  width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: 0.1s;
}

.active .material-symbols-outlined {
  color: white;
  font-weight: 600;
  font-size: 2.5rem;
  margin-right: 1rem;
  margin-left: 1.5rem;
}

.active:hover p,
.active:hover .material-symbols-outlined {
  color: #f1c400;
}

.router-link-active p,
.router-link-active .material-symbols-outlined {
  color: #f1c400;
}

/* ======================================================= */
.nav {
  z-index: 1;
  left: 325px;
  width: calc(100% - 325px);
  position: fixed;
  height: 100px;
  transition: all 0.1s;
  display: flex;
  justify-content: space-between;
  box-shadow: rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px;
}

.nav-left {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 10px;
}

.nav-left img {
  width: 150px;
  /* background: #000; */
}

.nav-two {
  left: 105px;
  width: calc(100% - 105px);
}

.nav p {
  color: rgb(255, 255, 255);
}

.nav {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  top: 0;
}

h2 {
  color: white;
}

.nav-left {
  margin-left: 30px;
}

.nav-right {
  margin-top: 6px;
  width: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  margin-right: 30px;
}

.user-name {
  font-size: 1rem;
  color: #ffff;
  margin-right: 0.5rem;
  margin-right: -1px;
  width: 100px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ==================================================================== */
.main-expand {
  position: absolute;
  left: 370px;
  width: calc(100% - 420px);
  padding-top: 130px;
  transition: all 0.1s;
  height: 100vh;
}

.main-collapse {
  position: absolute;
  left: 150px;
  width: calc(100% - 200px);
  padding-top: 130px;
  transition: all 0.1s;
  height: 100vh;
}

.sidebar-left-dialog .active {
  text-align: center;
  padding-bottom: 50px;
}

@media (max-width: 1366rem) {
  .nav-center p {
    font-size: 1.5rem;
  }

  .dashboard {
    width: 200px;
  }

  .home {
    margin-top: 35px !important;
  }

  .nav {
    left: 205px;
    width: calc(100% - 205px);
  }

  .sidebar-left-dialog .active {
    text-align: center;
    /* padding-left: 0.6rem; */
  }

  .active .material-symbols-outlined {
    font-size: 2rem;
    margin-left: 1rem;
  }

  a.active.icon {
    margin-bottom: -40px;
  }

  .close {
    margin-left: 10px;
    font-size: 1.5rem;
    margin-top: -10px;
  }

  .user-name {
    margin-right: -4px;
  }

  .active p {
    font-size: 1rem;
  }

  .dashboard img {
    margin-top: -35px;
    width: 130px;
    margin-left: 40px;
  }

  #menu {
    font-size: 2rem;
    height: 80px;
  }

  .sidebar-left-dialog {
    width: 80px;
  }

  hr {
    margin-top: 58px;
  }

  .nav {
    height: 80px;
  }

  .nav-two {
    left: 85px;
    width: calc(100% - 85px);
  }

  .main-expand {
    left: 230px;
    width: calc(100% - 260px);
  }

  .main-collapse {
    position: absolute;
    left: 120px;
    width: calc(100% - 160px);
  }

  .nav-left {
    margin-top: -10px;
  }

  .nav-left img {
    width: 120px;
    /* background: #000; */
  }

  .manage-user {
    margin-top: 40px !important;
  }
}
</style>
