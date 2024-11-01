<template>
  <h1>Report Page</h1>

  <div class="flex flex-row justify-between gap-4">
    <div></div>
    <div class="flex flex-row justify-center mb-8 gap-4 items-center">
      <div class="select-dropdown">
        <select id="campaign" class="resize-none focus:outline-none" v-model="campaign_id" name="list of prizes">
          <option value="" disabled>Select campaign</option>
          <option v-for="(item, index) in campaigns" :key="index" :value="item.id">
            {{ item.campaign_name }}
          </option>
        </select>
      </div>

      <div class="date">
        <input type="date" v-model="from_date" />
      </div>
      <span class="material-symbols-outlined" style="color: #009639"> arrow_forward </span>
      <div class="date">
        <input type="date" v-model="to_date" :min="minStartDate" />
      </div>
      <BaseButton type="secondary-btn" @click="getData">Search</BaseButton>
    </div>
    <BaseButton type="primary-btn" @click="exportDataToCsv">Export all</BaseButton>
  </div>
  <div>
    <table style="width: 100%; min-width: 56rem">
      <thead>
        <tr>
          <th>No.</th>
          <th>Prize name</th>
          <th>Prize image</th>
          <th>Phone number</th>
          <th>Won date</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="myData" v-for="(item, index) in myData" :key="item.id">
          <td>{{ index + 1 }}</td>

          <td>{{ item.khmer_name }}({{ item.english_name }})</td>
          <td>
            <div class="imge_prize flex flex-row justify-center">
              <img :src="item.prize_image" alt="" />
            </div>
          </td>
          <td>{{ item.msisdn }}</td>
          <td>
            {{ new Date(item.created_at).toLocaleDateString() }}
          </td>
        </tr>
      </tbody>
    </table>
    <div v-if="myData.length == 0" class="report-not-found flex flex-col items-center justify-center h-96 w-auto">
      <p>No report</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import BaseButton from "@/components/widget/BaseButton.vue";
import type { ICampaign } from "@/types";

useSeoMeta({
  title: "Reports > Smart | Lucky Draw",
});

const myData: any = ref<any[]>([]);
const campaign_id = ref("");
const from_date = ref("");
const to_date = ref("");
const campaigns = ref<ICampaign[]>([]);
const getData = async () => {
  let body = {
    from_date: from_date.value,
    to_date: to_date.value,
  };

  const res = await callAPI("/report/listWonUsers/" + campaign_id.value, "POST", body);
  myData.value = res.data || [];
};
const getCampaigns = async () => {
  const res = await callAPI("/campaign/getAllCampaigns");
  campaigns.value = res.data || [];
};

const exportDataToCsv = () => {
  const csvContent = convertToCSV(myData.value);
  // const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8,\\uFEFF" });
  const url = encodeURI(csvContent);
  // const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", "data:text/csv;charset=utf-8,\uFEFF" + url);
  link.setAttribute("download", "export_data.csv");
  link.click();
};

const convertToCSV = (myData: any) => {
  const headers = ["Campaign Name", "Phone number", "Prize Name", "Won Date"];
  const rows = [headers.join(",")];
  myData.forEach((row: any) => {
    const r = [
      row["campaign_name"],
      row["msisdn"],
      row["khmer_name"] + `(${row["english_name"]})`,
      new Date(row["created_at"]).toDateString(),
    ];
    rows.push(r.join(","));
  });
  return rows.join("\n");
};
const date = ref("");
onMounted(() => {
  getCampaigns();
  const currentDate = new Date().toISOString().split("T")[0];
  date.value = currentDate;
});

const minStartDate = computed(() => {
  if (from_date.value) {
    const fromDate = new Date(from_date.value);
    return fromDate.toISOString().split("T")[0];
  }
});
</script>

<style scoped>
h1 {
  text-align: center;
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 5rem;
  margin-top: 2rem;
}

#export {
  background: #cecbcb;
  text-transform: none;
  box-shadow: none;
  color: #000000 !important;
}

.imge_prize img {
  width: 50px;
  height: 50px;
  object-fit: cover;
}

th,
td {
  padding: 0.5rem;
  text-align: center;
}

table {
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
}

td,
th {
  border-right: 1px solid rgb(202, 195, 195);
}

tbody td:nth-child(5) {
  border-right: 1px solid rgba(202, 195, 195, 0);
}

tr:nth-child(odd) {
  background: #d5dcda;
}

th:nth-child(5),
td:nth-child(2),
td:nth-child(5) {
  width: 15rem;
  padding-left: 15px;
  padding-right: 15px;
}

th:nth-child(1),
td:nth-child(1) {
  width: 8rem;
}

th {
  background: #009639;
  color: #ffff;
}

/* ============================ */

.select-dropdown,
.select-dropdown * {
  margin: 0;
  padding: 0;
  position: relative;
  box-sizing: border-box;
}

.select-dropdown {
  position: relative;
  border: 2px solid #009639;
  background: #fff;
  width: 200px;
}

.select-dropdown select {
  font-size: 1rem;
  font-weight: normal;
  width: 200px;
  padding: 0.25rem;
  border: none;
  background-color: transparent;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}

.select-dropdown select:active,
.select-dropdown select:focus {
  outline: none;
  box-shadow: none;
}

.select-dropdown:after {
  content: "";
  position: absolute;
  top: 50%;
  right: 8px;
  width: 0;
  height: 0;
  margin-top: -2px;
  border-top: 5px solid #009639;
  border-right: 5px solid transparent;
  border-left: 5px solid transparent;
}

.date input {
  padding: 0.25rem;
  border: 2px solid #009639;
  width: 12rem;
}

.report-not-found {
  background: #00000025;
}

.report-not-found p {
  font-size: 2rem;
  font-weight: 600;
  color: #0000007e;
}
</style>
