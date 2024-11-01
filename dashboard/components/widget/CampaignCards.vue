<template>
  <div class="page-campaign pb-8">
    <div class="mt-20">
      <h2>Active Campaigns</h2>
    </div>
    <div class="campaign-card overflow-auto">
      <div v-for="(item, index) in activeCampaign" :key="index" class="mx-2">
        <NuxtLink class="parent-card" :to="`/campaigns/edit/${item.id}`">
          <div class="name-campaign">
            <h3>{{ item.campaign_name }}</h3>
          </div>
          <div class="card-image">
            <img :src="item.campaign_image || defaultCampaignBGURL" :alt="item.campaign_name" />
          </div>
          <div class="card-action-info">
            <div class="name-date">
              <p>Start Date: {{ new Date(item.start_date).toLocaleDateString() }}</p>
              <p>End Date: {{ new Date(item.end_date).toLocaleDateString() }}</p>
            </div>
            <div class="action flex flex-row items-center"></div>
          </div>
        </NuxtLink>
      </div>
    </div>
    <div class="w-full flex flex-row justify-center mt-15">
      <NuxtLink to="/campaigns">
        <BaseButton type="primary-btn">View All</BaseButton>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import BaseButton from "@/components/widget/BaseButton.vue";
import type { ICampaign } from "@/types";
import { defaultCampaignBGURL } from "~/configs";
const campaigns = ref<ICampaign[]>([]);
const activeCampaign = ref<ICampaign[]>([]);

const isActive = (item: any) => {
  const today = new Date();
  const startDate = new Date(item.start_date);
  const endDate = new Date(item.end_date);
  return today >= startDate && today <= endDate;
};

const res = await callAPI("/campaign/getAllCampaigns");
campaigns.value = res.data;
for (let i = 0; i < campaigns.value.length; i++) {
  if (isActive(campaigns.value[i]) && campaigns.value[i].is_archived == false) {
    activeCampaign.value.push(campaigns.value[i]);
  }
}
</script>

<style scoped>
h2 {
  color: #00953a;
  width: 100% !important;
  text-align: center;
  padding: 1rem;
  font-size: 1.7rem;
  font-weight: bold;
  margin-top: 50px;
}

.campaign-card {
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: 40px;
  overflow-x: scroll;
  overflow-y: hidden;
}

.campaign-active {
  display: flex;
  flex-direction: row;
  margin-top: 50px;
  align-items: center;
}

.campaign-card .parent-card {
  /* flex-wrap: wrap; */
  height: 330px;
  width: 300px !important;
  margin: 15px;
  box-shadow: rgba(14, 30, 37, 0.12) 0px 2px 4px 0px, rgba(14, 30, 37, 0.32) 0px 2px 16px 0px;
  /* border: 2px solid #ffffff00; */
  /* border: 2px solid #ddd9d9; */
  margin-bottom: 60px;
  margin-right: 40px;
}

.parent-card:hover {
  /* border: 2px solid #00953A; */
  cursor: pointer;
}

.name-campaign {
  background: #00953a;
  color: #fffffe;
  padding: 0.5rem;
  text-align: center;
  white-space: nowrap;
  /* width: 50px;  */
  overflow: hidden;
  text-overflow: ellipsis;
  /* border: 1px solid #000000; */
  font-weight: 600;
}

.name-campaign h3 {
  font-size: 1.3rem !important;
}

.card-image {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.card-image img {
  height: 200px;
  width: 100%;
  object-fit: cover;
}

.card-action-info {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-left: 1.5rem;
  padding-top: 0.75rem;
  padding-bottom: 0.5rem;
  background: #00953a;
  width: 100%;
}

.action .material-symbols-outlined {
  font-size: 1.6rem;
  color: #ffffff;
  transition: all 0.5s;
}

.action .material-symbols-outlined {
  color: #ffffff;
  margin-right: 0.5rem;
  font-size: 3.5rem;
}

.action .material-symbols-outlined:hover {
  cursor: pointer;
  color: #f4c300;
  transition: all 0.5s;
}

.name-date p {
  font-size: 1rem;
  margin-bottom: 5px;
  color: #fffffe;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.parent-card:hover .name-campaign,
.parent-card:hover .card-action-info,
.parent-card:hover .name-date p {
  cursor: pointer;
  background: #f4c300;
  color: #00953a;
}

.name-date h3 {
  font-size: 1.5rem;
  margin-bottom: 5px;
  color: #fffffe;
  white-space: nowrap;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
}

.see-more {
  margin-top: 50px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.line {
  border: 1px solid #000000;
  height: 2px;
  width: 45%;
}

.see-more p {
  background: #f4c300;
  width: 150px;
  text-align: center;
  font-size: 1rem;
  font-weight: bold;
  color: #00953a;
  transition: all 1s;
  padding: 0.5rem;
}

.see-more p:hover {
  background: #00953a;
  color: #fffffe;
  transition: all 1s;
}

.page-campaign a {
  text-decoration: none;
}

@media (max-width: 1366rem) {
  h2 {
    font-size: 1rem;
    width: 30%;
    margin-left: 10px;
  }

  hr {
    margin-left: 10px;
  }

  .campaign-card .parent-card {
    height: 258px;
    width: 245px !important;
    margin-top: 0px;
    margin-bottom: 55px;
  }

  .card-image img {
    height: 150px;
    width: 100%;
  }

  .name-campaign h3 {
    font-size: 1rem;
  }

  .card-action-info .name-date p {
    font-size: 0.8rem !important;
    width: 140px;
  }

  .action .material-symbols-outlined {
    font-size: 2rem;
  }

  h2 {
    margin-top: -40px;
    font-size: 1.5rem;
  }
}

@media (max-width: 51.25rem) {
  h2 {
    font-size: 1.5rem;
    width: 45%;
    margin-left: 10px;
  }

  .campaign-card .parent-card {
    height: 208px;
    width: 225px !important;
    margin-top: 0px;
    margin-bottom: 55px;
  }

  .card-image img {
    height: 110px;
    width: 100%;
  }

  .name-campaign h3 {
    font-size: 0.8rem;
  }

  .card-action-info .name-date p {
    font-size: 0.7rem !important;
    width: 140px;
  }
}
</style>
