<template>
  <div class="main-container">
    <NuxtLink to="/campaigns/new" :style="authStore.role == 'guest' ? 'pointer-events: none; user-select:none' : ''">
      <div class="card">
        <div class="icon-info flex flex-row">
          <span class="material-symbols-outlined"> brand_awareness </span>
          <span class="material-symbols-outlined plus"> add </span>
        </div>
        <div class="info">
          <p>Add Campaign</p>
        </div>
      </div>
    </NuxtLink>
    <NuxtLink to="/prizes?isAddPrize=true">
      <div class="card">
        <div class="icon-info flex flex-row">
          <span class="material-symbols-outlined"> rewarded_ads </span>
          <span class="material-symbols-outlined plus"> add </span>
        </div>
        <div class="info">
          <p>Add Prize</p>
        </div>
      </div>
    </NuxtLink>
    <NuxtLink to="/reports">
      <div class="card">
        <div class="icon-info">
          <span class="material-symbols-outlined report"> problem </span>
        </div>
        <div class="info">
          <p>Reports</p>
        </div>
      </div>
    </NuxtLink>
  </div>
  <CampaignCards></CampaignCards>
</template>

<script setup lang="ts">
import CampaignCards from "@/components/widget/CampaignCards.vue";
import { useAuthStore } from "@/store/auth";

const authStore = useAuthStore();
</script>

<style scoped>
.main-container {
  display: flex;
  flex-direction: row;
  gap: 4rem;
  justify-content: center;
  align-items: center;
  margin: auto;
  padding-top: 50px;
  margin-bottom: 100px;
}

.main-container .card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: #ffffff;
  cursor: pointer;
  height: 290px;
  width: 300px;
  box-shadow: rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em;
  /* box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px; */

  align-items: center;
}

.material-symbols-outlined {
  font-size: 7rem;
  margin-top: 40px;
  color: #00953a;
  /* font-weight: 1000; */
}

.icon-info {
  display: flex;
  flex-direction: column;
}

.info {
  background: #f4c300;
  transition: all 0.1s;
  text-align: center;
  height: 80px;
  color: #00953a;
  width: 100%;
  height: 100px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.info p {
  font-size: 1.5rem !important;
  font-weight: 900;
}

.main-container .card:hover .info {
  background: #00953a;
  color: #ffff;
  cursor: pointer;
  transition: all 0.1s;
}

.plus {
  font-size: 3rem;
  font-weight: bold;
  margin-left: -15px;
}

@media (max-width: 1366rem) {
  .main-container .card {
    height: 13rem;
    width: 15rem;
  }

  .info {
    height: 70px;
  }

  .info p {
    padding-top: -4rem !important;
    font-size: 1rem;
    font-weight: 900;
  }

  .icon-info .material-symbols-outlined:nth-child(1) {
    margin-top: 30px;
    margin-right: -20px;
    font-size: 4.5rem;
  }

  .icon-info .material-symbols-outlined:nth-child(2) {
    margin-top: 20px;
    margin-left: 10px;
    font-size: 2rem;
  }

  .report {
    margin-left: -20px;
  }
}

@media (max-width: 968px) {
  .main-container {
    gap: 1rem;
  }

  .main-container .card {
    height: 12rem;
    width: 13rem;
  }

  .info {
    height: 70px;
  }

  .info p {
    padding-top: -4rem !important;
    font-size: 1rem;
    font-weight: 900;
  }

  .icon-info .material-symbols-outlined:nth-child(1) {
    font-size: 4rem;
  }
}
</style>
