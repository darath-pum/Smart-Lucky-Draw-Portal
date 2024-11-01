<template>
  <div class="input-email">
    <input @click="inputSelect()" class="resize-none focus:outline-none" type="email" v-model="email"
      placeholder="Enter email" @input="sendDataToParent(email, index)" :style="{
        border:
          userEmail.length === 0 && email !== '' && email !== authStore.email
            ? '2px solid red'
            : '2px solid #009639',
      }" />
  </div>
  <div class="list-user-email">
    <div v-for="(invite, index) in userEmail" :key="index">
      <div @click="selectListUser(invite.email)" v-show="showUserEmail" class="listUserEmail">
        <p>{{ invite.first_name }} {{ invite.last_name }}</p>
        <p class="email">{{ invite.email }}</p>
      </div>
    </div>
    <div v-show="notFoundTitle" v-if="userEmail.length === 0 && email !== '' && email !== authStore.email">
      <p>No user email</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { useAuthStore } from "@/store/auth";
import type { IAccountSearchInfo } from "~/types";
const authStore = useAuthStore();
const props = defineProps(["email", "index"]);
const emit = defineEmits(["custom-event"]);
const email = ref(props.email.email);
const index = ref(props.index);
const userEmail = ref<IAccountSearchInfo[]>([]);
const showUserEmail = ref(true);
const notFoundTitle = ref(true);

const getUserEmail = async (emailValue: string) => {
  if (!emailValue || emailValue.trim() === '') return;
  const response = await callAPI(`/user/searchUserByInput/${emailValue}`);
  let listEmails = response.data;
  userEmail.value = [];
  for (let i = 0; i < listEmails.length; i++) {
    if (authStore.email !== listEmails[i].email) {
      userEmail.value.push(listEmails[i]);
    }
  }
};

let delay: any;
watch(email, () => {
  if (delay) {
    clearTimeout(delay);
    delay = null;
  }
  delay = setTimeout(() => {
    getUserEmail(email.value);
  }, 1000);
});

onMounted(async () => {
  if (email.value !== "") {
    showUserEmail.value = false;
    await getUserEmail(email.value);
  }
  window.addEventListener("click", (event) => {
    if (!(event.target as HTMLElement).closest("input")) {
      showUserEmail.value = false;
      notFoundTitle.value = false;
    }
  });
});

function selectListUser(valueEmail: any) {
  email.value = valueEmail;
  showUserEmail.value = false;
  sendDataToParent(email.value, index.value);
}
function inputSelect() {
  showUserEmail.value = true;
  notFoundTitle.value = true;
}

const sendDataToParent = (email: string, index: number) => {
  emit("custom-event", email, index);
};
</script>

<style scoped>
.list-user-email {
  background-color: rgb(240, 237, 237);
  width: 15.3rem;
  z-index: 1;
  box-shadow: rgba(14, 30, 37, 0.12) 0px 2px 4px 0px, rgba(14, 30, 37, 0.32) 0px 2px 16px 0px;
  position: absolute;
  max-height: 200px;
  overflow-y: auto;
}

.list-user-email p {
  margin: 7px;
  display: flex;
  justify-content: flex-start;
}

.list-user-email .email {
  font-size: small;
}

.input-email input {
  border: 2px solid #009639;
  padding: 0.5rem;
  width: 15rem;
}

.listUserEmail:hover {
  background-color: #fff;
  cursor: pointer;
}
</style>
