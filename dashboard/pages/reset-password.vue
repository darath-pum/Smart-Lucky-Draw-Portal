<template>
  <TheTransition id="transition">
    <v-alert class="mr-5" width="40%" type="error" title="Error Invalid !" v-if="errResetPassword"
      :text="invalidMessage"></v-alert>
  </TheTransition>
  <TheTransition id="transition">
    <v-alert class="mr-5" width="40%" type="success" title="Success !" v-if="isChange">
      Change password is successfull.</v-alert>
  </TheTransition>
  <div class="reset-password">
    <img src="/images/smart-logo2.png" alt="" />
    <h1>Reset Password</h1>
    <form @submit.prevent="changePassword()" action="" class="reset-password-form">
      <ValidatePassword id="validate-password" :placeholder="'Enter new password'" @custom-event="handleCustomEvent">
      </ValidatePassword>
      <div class="password-confirm">
        <label for="">Confirm password: <span v-if="pathName == 'confirm_password'" class="text-red">{{ invalidMessage
            }}</span></label>
        <input type="password" class="resize-none focus:outline-none" v-model="confirm_password"
          :style="confirm == true ? 'border:2px solid red' : ''" placeholder="Enter confirm password*" />
      </div>


      <div class="btn-control">
        <router-link to="/login">
          <BaseButton type="secondary-btn" class="btn-reset-password"> Cancel</BaseButton>
        </router-link>
        <BaseButton type="primary-btn" @click="changePassword" class="btn-reset-password"
          @keydown.enter="changePassword">
          Submit</BaseButton>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import BaseButton from "@/components/widget/BaseButton.vue";
import { useRoute, useRouter } from "vue-router";
import TheTransition from "@/components/widget/TheTransition.vue";
import { validatePassword } from "@/validation";
import ValidatePassword from "@/components/ValidatePassword.vue"

useSeoMeta({
  title: "Reset Password > Smart | Lucky Draw",
});

definePageMeta({
  layout: "no-app-bar",
});

const route = useRoute();
const router = useRouter();
const new_password = ref("");
const confirm_password = ref("");
const invalidMessage = ref("");
const pathName = ref("");
const verificationID = route.query.verificationID;
const isChange = ref(false);
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);
const errResetPassword = ref(false);
const confirm = ref(false);

let pass = ("")
const handleCustomEvent = (password: string) => {
  pass = password;
  console.log(pass);

}
const changePassword = async () => {
  if (pass !== confirm_password.value) {
    pathName.value = "confirm_password";
    invalidMessage.value = "is incorrect."
    return;
  } else {
    invalidMessage.value = "";
    pathName.value = "";
  }
  const res = await callAPI("/auth/changePassword", "POST", {
    new_password: pass,
    verification_id: verificationID,
  });
  if (res.status == 200) {
    isChange.value = true;
    setTimeout(() => {
      isChange.value = false;
      router.push("/login");
    }, 2000);
  } else {
    invalidMessage.value = res.error || "Unknown Error";
    errResetPassword.value = true;
    setTimeout(() => {
      errResetPassword.value = false;
    }, 2000);
  }
};

const toggleShowNewPassword = () => {
  showNewPassword.value = !showNewPassword.value;
};
const toggleShowConfirmPassword = () => {
  showConfirmPassword.value = !showConfirmPassword.value;
};
</script>

<style scoped>
h1 {
  text-align: center;
  width: 350px;
  padding: 20px;
  font-size: 2rem;
  color: white;
  background: #04841c;
  z-index: 1;
}

.reset-password-form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 100px 58px;
  width: 36rem;
  background: #e0dcdc;
  margin-top: -50px;
  height: 22rem;
}

label {
  font-weight: 600;
}

#validate-password {
  margin-top: 2rem;
}

.reset-password {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.password-confirm {
  margin: 15px 30px;
  width: 100%;
}

.password-confirm input {
  width: 100%;
  padding: 10px 0px 10px 10px;
  border: 2px solid #04841c;
  font-size: 1rem;
  margin-top: 3px;
}

.reset-password img {
  width: 200px;
  margin-bottom: 30px;
  margin-top: -50px;
}

input::placeholder {
  color: rgba(0, 0, 0, 0.466);
}

.btn-control {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  margin-top: 1rem;
}

.btn-control button {
  font-size: 1rem !important;
  height: 3rem;
}
</style>
