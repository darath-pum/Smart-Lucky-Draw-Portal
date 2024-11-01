<template>
  <v-col cols="auto">
    <v-dialog transition="dialog-bottom-transition" width="auto" v-model="isActive">
      <template v-slot:activator="{ props }">
        <!-- <p >Logout Account</p> -->
        <BaseButton type="primary-btn" v-bind="props" id="btn-add-user">
          <i class="material-symbols-outlined"> add </i>
          Add New User
        </BaseButton>
      </template>

      <template v-slot:default="{ isActive }">
        <TheTransition id="transition">
          <v-alert class="mr-5" width="100%" type="error" title="Error Invalid !" v-if="alertError"
            :text="invalidMessage"></v-alert>
        </TheTransition>
        <TheTransition id="transition">
          <v-alert class="mr-5" width="100%" type="success" title="Success !" v-if="alertSucess"
            :text="alertMessage"></v-alert>
        </TheTransition>
        <form action="" class="register" @submit.prevent="register()">
          <div class="header">
            <h1>CREATE USER</h1>
          </div>

          <div class="user-name">
            <div>
              <label for="">First Name:
                <span class="input-label" v-if="pathName == 'first_name'">{{ invalidMessage }}.</span>
              </label>
              <input type="text" placeholder="Enter first name*" v-model="first_name"
                :style="pathName == 'first_name' ? 'border:2px solid red' : ''" />
            </div>
            <div>
              <label for="last_name">Last Name:
                <span class="input-label" v-if="pathName == 'last_name'">{{ invalidMessage }}.</span>
              </label>
              <input type="text" placeholder="Enter last name*" v-model="last_name"
                :style="pathName == 'last_name' ? 'border:2px solid red' : ''" />
            </div>
          </div>
          <div class="email-address">
            <label for="email">Email Address:
              <span class="input-label" v-if="pathName == 'email'">{{ invalidMessage }}.</span>
            </label>
            <input type="email" id="email" class="resize-none focus:outline-none" v-model="email"
              placeholder="Enter email address" :style="pathName == 'email' ? 'border:2px solid red' : ''" />
          </div>

          <div class="role flex flex-col">
            <label for="role">Role:
              <span class="input-label" v-if="pathName == 'role'">{{ invalidMessage }}.</span>
            </label>
            <div class="select-dropdown" :style="pathName == 'role' ? 'border:2px solid red' : ''">
              <select name="role" id="" v-model="role">
                <option value="" disabled>Select Role</option>
                <option value="admin">Admin</option>
                <option value="standard">Standard</option>
                <option value="guest">Guest</option>
              </select>
            </div>
          </div>
          <ValidatePassword id="validate-password" @custom-event="handleCustomEvent" :placeholde="'Enter password*'">
          </ValidatePassword>
          <div class="pass-confirm mt-4">
            <!-- <div> -->
            <label for="password" class="mt-3">Confirm Password:
              <span class="input-label" v-if="pathName == 'confirm_password'">
                {{ invalidMessage }}
              </span>
            </label>
            <input type="password" id="password" class="resize-none focus:outline-none" v-model="confirm_password"
              placeholder="Enter confirm password*" :style="passConfirm ? 'border:2px solid red' : ''" />
            <!-- </div> -->
          </div>
          <div class="btn flex gap-5">
            <BaseButton type="secondary-btn" class="btn-register" @click="isActive.value = false">
              Cancel
            </BaseButton>
            <BaseButton type="primary-btn" class="btn-register" @click="register">Submit</BaseButton>
          </div>
        </form>
      </template>
    </v-dialog>
  </v-col>
</template>

<script setup lang="ts">
import { ref } from "vue";
import TheTransition from "../widget/TheTransition.vue";
import ValidatePassword from "@/components/ValidatePassword.vue";
import {
  validateEmail,
  validFirstName,
  validLastName,
  validateRole,
  validatePassword,
} from "../../validation";
import BaseButton from "../widget/BaseButton.vue";
const props = defineProps(["getUsers"]);
const first_name = ref("");
const last_name = ref("");
const email = ref("");
// const password = ref("");
const confirm_password = ref("");
const showNewPassword = ref(false);
const role = ref("");
const alertMessage = ref("");
const alertSucess = ref(false);
const alertError = ref(false);
const errorCode = ref<number>(-1);
const invalidMessage = ref("");
const pathName = ref("");
const passConfirm = ref(false);
const isActive = ref(false);


let pass = ("")
const handleCustomEvent = (password: string) => {
  pass = password

}

const register = async () => {
  const errEmail = validateEmail(email.value);
  const errFirstName = validFirstName(first_name.value);
  const errLastName = validLastName(last_name.value);
  const errRole = validateRole(role.value);


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
  if (errRole && role.value == "") {
    pathName.value = "role";
    invalidMessage.value = errRole;
    return;
  } if (pass !== confirm_password.value) {
    pathName.value = "confirm_password";
    invalidMessage.value = "is incorrect."
  }
  else {

    pathName.value = "";
    invalidMessage.value = "";
  }

  let data = {
    first_name: first_name.value,
    last_name: last_name.value,
    email: email.value,
    password: pass,
    role: role.value,
  };
  if (pass == confirm_password.value) {
    const res = await callAPI("/user/register", "POST", data);
    if (res.status == 200) {
      props.getUsers();
      alertSucess.value = true;
      alertMessage.value = res.data.message;
      setTimeout(() => {
        alertSucess.value = false;
        isActive.value = false;
        resetData();
      }, 2000);
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

const resetData = () => {
  first_name.value = "";
  last_name.value = "";
  email.value = "";
  pass = "";
  role.value = "";
  confirm_password.value = "";
};

const toggleShowNewPassword = () => {
  showNewPassword.value = !showNewPassword.value;
};

</script>

<style scoped>
#btn-add-user {
  margin-top: 3rem;
  color: white;
  padding: 25px 20px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  font-size: 1rem;
}

#btn-add-user i {
  font-weight: 500;
  font-size: 1.5rem;
}

.register {
  background: #fff;
  width: 36rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0px 58px 40px;
}

.header {
  background: #009639;
  padding: 20px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 36rem;
  margin-bottom: 2rem;
}

.header h1 {
  color: #ffff;
  font-size: 1.5rem;
  font-weight: 600;
}


textarea:focus,
input:focus {
  outline: none;
}

/* ========================================= */
.user-name {
  margin: 0px 29px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 2rem;
}

.user-name div {
  width: 50%;

}

.user-name div input {
  width: 100%;
  border: 2px solid #009639;
  padding: 8px 5px;

}

.email-address,
.pass-confirm,
.role,
.user-name {
  margin: 8px 29px;
  width: 100%;

}

.email-address input,
.pass-confirm input {
  width: 100%;
  border: 2px solid #009639;
  padding: 9px 5px;
}

/* ================================================== */
/* ===================================================== */

.btn {
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: -1rem;
}

label {
  font-weight: 600;
  padding-bottom: 0.1rem;
  font-size: 1rem !important;

}

.input-label {
  color: red;
  font-size: 1rem;
}

/* ========================================================= */
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

  width: 100%;

}

.select-dropdown select {
  font-size: 1rem;
  font-weight: normal;
  width: 100%;
  ;
  padding: 10px;
  border: none;
  background-color: transparent;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}



.btn-register {
  width: 120px;
  height: 50px;
  margin-top: 40px !important;
  padding: 7px 7px 7px 7px;
  font-size: 1.2rem;
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
</style>
