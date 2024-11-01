<template>
  <v-menu v-model="isActive">
    <template v-slot:activator="{ props }">
      <img v-if="!authStore.isAuthenticated" class="user_icon btn" :src="defaultAvatarURL" alt="avatar"
        v-bind="props" />
      <div v-else v-bind="props">
        <img class="w-[2.5rem] h-[2.5rem] object-cover rounded-full" :src="authStore.profile || defaultAvatarURL" alt="avatar" />
      </div>
    </template>

    <template v-slot:default="{ isActive }">
      <div class="dialog" @click.stop>
        <div v-if="authStore.isAuthenticated" class="user-logouted">
          <div class="user-info">
            <div id="image-login">
              <img :src="authStore.profile || defaultAvatarURL" alt="avatar" />
            </div>
            <span id="close-profile" class="material-symbols-outlined" @click="isActive.value = false">close</span>
            <p class="name">{{ authStore.first_name }} {{ authStore.last_name }}</p>
            <p class="email">{{ authStore.email }}</p>
          </div>
          <NuxtLink class="change-profile mt-10" to="/user-profile">
            <BaseButton class="btn-change-profile" type="primary-btn">
              <span class="material-symbols-outlined"> assignment_ind </span>
              <p>My Profile</p>
            </BaseButton>
          </NuxtLink>
          <UserConfirm :title="'Do you want to sign out?'" :btnName="'Logout'" :nameIcon="'logout'"
          :functionName="'logout'" />
        </div>
        <div v-else class="user-loged">
          <div class="img-header">
            <img src="/images/smart-logo2.png" />
          </div>
          <span id="close-profile" class="material-symbols-outlined" @click="isActive.value = false">close</span>
          <NuxtLink to="/login">
            <BaseButton class="btn-login" type="primary-btn">
              <span class="material-symbols-outlined"> how_to_reg </span>
              <p>Login</p>
            </BaseButton>
          </NuxtLink>
          <NuxtLink to="/register">
            <BaseButton class="btn-register" type="primary-btn">
              <span class="material-symbols-outlined"> how_to_reg </span>
              <p>Register</p>
            </BaseButton>
          </NuxtLink>
        </div>
      </div>
    </template>

  </v-menu>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import BaseButton from "@/components/widget/BaseButton.vue";
import UserConfirm from "./UserConfirm.vue";
import { useAuthStore } from "@/store/auth";
import { defaultAvatarURL } from "~/configs";
const isActive = ref(false)
const authStore = useAuthStore();
const menu = ref(null);

</script>

<style scoped>
.dialog {
  background: #fafcfa;
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
  height: 400px;
  width: 300px;
  border-radius: 10px;
  margin-top: 1.5rem;
  margin-right: -2rem;
}

#close-profile {
  position: absolute;
  margin-left: 15rem;
  margin-top: -9rem;
  padding: 0.1rem;
}

#close-profile:hover {
  color: #ffffff;
  background: #0096399d;
  border-radius: 100%;
  cursor: pointer;
}

.user_icon {
  width: 60px;
  text-align: end;
}

a {
  text-decoration: none;
}

#image {
  position: relative;
  width: 50px;
  height: 50px;
  overflow: hidden;
  border-radius: 50%;
  background: white;
  display: flex;
  flex-direction: column;
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
  justify-content: center;
}

#image img {
  width: 100%;
  height: auto;
  cursor: pointer;
}

#image:hover {
  opacity: 0.8;
}

#image-login {
  position: relative;
  margin-top: 10px;
  width: 90px;
  height: 90px;
  overflow: hidden;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
  justify-content: center;
}

#image-login img {
  width: 100%;
  height: auto;
}

.active p a {
  color: white;
  text-decoration: none;
}

.user-loged,
.user-logouted {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 1rem;
}

.change-profile {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 300px;
  margin: 0.5rem 0 1.5rem 0;
  cursor: pointer;
}

.change-profile input {
  position: absolute;
  padding: 0.5rem;
  opacity: 0;
  width: 250px;
  z-index: 100;
  cursor: pointer;
}

.change-profile .btn-change-profile {
  padding: 0.5rem;
  width: 250px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  gap: 0.5rem;
  color: #ffff;
  cursor: pointer;
}

.user-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.user-info .name {
  margin-top: 5px;
  font-size: 1.5rem;
  font-weight: 600;
}

.user-info .email {
  margin-top: 5px;
  font-size: 1.2rem;
}

.btn-register p,
.btn-login p,
.logout p,
.btn-change-profile p {
  padding-left: 0.5rem;
}

.dialog .logout {
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

.logout p,
.logout .material-symbols-outlined {
  color: #ffffff;
}

.btn-login,
.btn-register {
  display: flex;
  flex-direction: row;
  padding: 0.5rem;
  width: 250px;
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  color: #ffff;
  margin-top: 1.5rem;
  cursor: pointer;
  transition: 0.1s;
  text-decoration: none;
  justify-content: flex-start;
}

.btn-register p,
.btn-register .material-symbols-outlined {
  color: #ffffff !important;
}

.manage-user {
  padding: 1rem;
  font-size: 1.3rem;
  display: flex;
  transition: 0.1s;
  color: #009639;
}

.manage-user:hover {
  color: #fdc400;
  transition: 0.1s;
}

@media (max-width: 1366rem) {
  #image {
    width: 40px;
    height: 40px;
  }
}
</style>
