<template>
  <TheTransition id="transition">
    <v-alert class="mr-5" width="40%" type="error" title="Error Invalid !" v-if="alertError"
      :text="invalidMessage"></v-alert>
  </TheTransition>
  <TheTransition id="transition">
    <v-alert class="mr-5" width="40%" type="success" title="Success !" v-if="alertSucess"
      :text="alertMessage"></v-alert>
  </TheTransition>
  <div class="register-form">
    <form action="" class="register" @submit.prevent="register()">
      <img src="/images/smart-logo2.png" alt="" />
      <h1>Register</h1>
      <div class="add-user-form">
        <div class="user-name">
          <div>
            <label for="" class="ml-5">
              <span class="input-label">First Name: </span>
              <span v-if="pathName == 'first_name'">{{ invalidMessage }}.</span></label>
            <input type="text" v-model="first_name" placeholder="Enter first name*"
              :style="pathName == 'first_name' ? 'border:2px solid red' : ''" />

            <!-- <span>fjioeruwtyor</span> -->
          </div>
          <div>
            <label for="" class="ml-5">
              <span class="input-label">Last Name: </span>
              <span v-if="pathName == 'last_name'">{{ invalidMessage }}.</span></label>
            <input type="text" v-model="last_name" placeholder="Enter last name*"
              :style="pathName == 'last_name' ? 'border:2px solid red' : ''" />
          </div>
        </div>
        <!-- <div class="email-role"> -->
        <div class="email-address">
          <label for="" class="mt-2">
            <span class="input-label">Email Address: </span>
            <span v-if="pathName == 'email'">{{ invalidMessage }}.</span></label>
          <input type="email" id="email" class="resize-none focus:outline-none" placeholder="youremail@gmail.com"
            v-model="email" :style="pathName == 'email' ? 'border:2px solid red' : ''" />
        </div>

        <ValidatePassword @custom-event="handleCustomEvent" class="mt-2" :placeholde="'Enter password*'">
        </ValidatePassword>
        <div class="confirm-pass">
          <label for="" class="input-label ml-5 mt-2">Confirm Password: <span class="passConfirm mt-3"
              v-if="pathName == 'confirm_password'">Confirm password is incorrect.</span></label>
          <input type="password" id="confirm_password" class="resize-none focus:outline-none"
            placeholder="Enter confirm password*" v-model="confirm_password" :style="pathName == 'confirm_password' ? 'border:2px solid red' : ''
      " />
        </div>
        <!-- </div> -->

        <BaseButton type="primary-btn" class="btn-register" @click="register" @keydown.enter="register">Submit
        </BaseButton>
        <span id="route-login">Already have an account?
          <router-link to="/login">Login</router-link></span>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import ValidatePassword from '@/components/ValidatePassword.vue'
import {
  validateEmail,
  validFirstName,
  validLastName,
  validatePassword,
} from "@/validation";
import TheTransition from "@/components/widget/TheTransition.vue";
import BaseButton from "@/components/widget/BaseButton.vue";

useSeoMeta({
  title: "Register > Smart | Lucky Draw",
});

definePageMeta({
  layout: "no-app-bar",
});

const router = useRouter();

const first_name = ref("");
const last_name = ref("");
const email = ref("");

const confirm_password = ref("");

const alertMessage = ref("");
const alertSucess = ref(false);
const alertError = ref(false);
const errorCode = ref<number>(-1);
const invalidMessage = ref("");
const pathName = ref("");
const passConfirm = ref(false);

let pass = ("")
const handleCustomEvent = (password: string) => {
  pass = password;



}
const register = async () => {
  const errEmail = validateEmail(email.value);
  const errFirstName = validFirstName(first_name.value);
  const errLastName = validLastName(last_name.value);
  if (errFirstName) {
    pathName.value = "first_name";
    invalidMessage.value = errFirstName;
    return;
  }
  if (errLastName) {
    pathName.value = "last_name";
    invalidMessage.value = errLastName;
    return;
  }
  if (errEmail) {
    pathName.value = "email";
    invalidMessage.value = errEmail;
    return;
  }

  if (pass !== confirm_password.value) {
    pathName.value = "confirm_password";
    invalidMessage.value = "Confirm Password is incorrect.";
    return;
  } else {
    pathName.value = "";
  }

  let data = {
    first_name: first_name.value,
    last_name: last_name.value,
    email: email.value,
    password: pass,
    role: "admin",
  };
  if (pass == confirm_password.value) {
    const res = await callAPI("/user/register", "POST", data);
    if (res.status == 200) {
      alertSucess.value = true;
      alertMessage.value = res.data.message;
      setTimeout(() => {
        alertSucess.value = false;
        router.push("/users");
      }, 3000);
    } else {
      errorCode.value = res.code;
      alertError.value = true;
      invalidMessage.value = res.error || "Unknown Error";
      setTimeout(() => {
        alertError.value = false;
      }, 3000);
    }
  } else {
    passConfirm.value = true;
  }
};

</script>

<style scoped>
h1 {
  text-align: center;
  width: 500px;
  padding: 20px;
  font-size: 3rem;
  font-weight: 600;
  color: white;
  background: #009639;
  z-index: 10;
}

.register-form {
  margin-bottom: 100px;
}

.add-user-form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: #e4dfdf;
  align-items: center;
  margin-top: -35px;
  padding: 50px;
  height: 34rem !important;
  /* width: 40rem !important; */

}

.shap {
  width: 800px;
  margin-bottom: 50px;
}

#triangle-down {
  margin-top: 0;
  text-align: start;
  width: 0;
  height: 0;
  border-left: 0px solid transparent;
  border-right: 50px solid transparent;
  border-top: 50px solid #009639;
}

.register-form a {
  font-size: 1.5rem;
  color: black;
  transition: all 0.5s;
}

.register-form a:hover {
  color: #fdc400;
  transition: all 0.5s;
}

.register-form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

textarea:focus,
input:focus {
  outline: none;
}

.register {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: white;
}

.user-name {
  width: 700px;
  display: flex;
  flex-direction: row;
  margin-top: 3rem;
}

.email-address {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: 0.5rem;
}

.user-name div:nth-child(1),
.user-name div:nth-child(2) {
  display: flex;
  flex-direction: column;
}

.email-address input {
  padding: 10px 0px 10px 5px;
  border: 2px solid #009639;
  font-size: 1rem !important;
  background: #fff;
}

.user-name input {
  margin: 0px 20px 0px 20px;
  padding: 10px 0px 10px 5px;
  border: 2px solid #009639;
  background: #fff;
  font-size: 1rem !important;
}

span {
  color: #ff0000;
  margin: auto;
}

.confirm-pass input {
  margin: 0px 20px 0px 20px;
  padding: 9px 0px 9px 5px;
  border: 2px solid #009639;
  background: #fff;
  font-size: 1rem !important;
}

label {
  font-weight: 600;
  padding-bottom: 0.2rem;
}

.input-label {
  font-weight: 600;
  color: #000000;
  font-size: 1rem !important;

}

.register-form img {
  width: 250px;
  margin-bottom: 30px;
}

input::placeholder {
  color: rgba(0, 0, 0, 0.466);
  font-size: 1rem !important;
}

.confirm-pass {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 0.5rem;
}

.validation-message {
  color: red;
  opacity: 1;
}

.passConfirm {
  color: red;
  font-size: 0.8rem;
}

.validation-message-none {
  opacity: 0;
}





/* ================================ */
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
  /* background-color: #E6E6E6; */
  background: #fff;
  width: 660px;
}

.select-dropdown select {
  font-size: 1rem;
  font-weight: normal;
  width: 660px;
  padding: 10px;
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

.btn-register {
  width: 200px;
  height: 60px;
  margin-top: 30px !important;
  padding: 7px 7px 7px 7px;
  font-size: 1.5rem;
  color: white;
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

#route-login {
  font-size: 1rem;
  color: #000000;
  padding-top: 10px;
}

#route-login a {
  font-size: 1rem;
  color: #009639;
}

@media (max-width: 1366rem) {
  .register-form img {
    width: 150px;
    margin-bottom: 30px;
    margin-top: 30px;
  }

  h1 {
    width: 250px;
    font-size: 1.5rem;
  }

  .add-user-form {
    width: 600px;
    height: 500px;
  }

  .user-name,
  .pass {
    width: 500px;
  }

  input {
    font-size: 0.8rem !important;
    /* padding: 8px !important; */
  }

  .user-name div:nth-child(1),
  .user-name div:nth-child(2) {
    display: flex;
    flex-direction: column;
    width: 250px;
  }

  label {
    font-size: 0.8rem !important;
    font-weight: 600;
  }

  .email-address {
    width: 460px;
  }

  .email-address input {
    width: 460px;
  }

  .select-dropdown {
    width: 460px;
  }

  .select-dropdown select {
    font-size: 0.8rem;
    padding: 8px;
    width: 460px;
  }

  .btn-register {
    width: 150px;
    height: 45px;
    margin-top: 40px;
    padding: 4px 4px 4px 4px;
    font-size: 1rem;
    color: white;
  }
}
</style>
