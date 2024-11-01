<template>
  <v-col cols="auto">
    <v-dialog transition="dialog-bottom-transition" width="auto">
      <template v-slot:activator="{ props }">
        <!-- <p >Logout Account</p> -->
        <div class="action-user" v-bind="props" @click="editUser(userId)">
          <div class="edit">
            <i class="material-symbols-outlined"> edit </i>
            <p class="content">Edit</p>
            <span id="edit-user">Edit
            </span>
          </div>
        </div>
      </template>

      <template v-slot:default="{ isActive }">
        <form action="" ref="form">
          <h1>UPDATE USER</h1>

          <v-dialog transition="dialog-bottom-transition" width="auto">
            <template v-slot:activator="{ props }">
              <BaseButton type="primary-btn" class="mb-8 mt-5" v-bind="props" @click="getResetPasswordLink">Reset
                Password
              </BaseButton>
            </template>

            <template v-slot:default="{ isActive }">
              <div class="copy-link">
                <div class="copy-header">
                  <h1>Link Reset Password</h1>
                  <i class="material-symbols-outlined" @click="isActive.value = false"> close </i>
                </div>
                <div>
                  <input type="text" v-model="link"
                    :style="isCopy ? 'border:2px solid #F1C400' : 'border: 2px solid red'" />
                  <BaseButton type="primary-btn" class="mr-5 text-white" @click="copyText">Copy
                  </BaseButton>
                </div>
              </div>
            </template>
          </v-dialog>
          <div id="user-name">
            <div class="first-name flex flex-col">
              <label for="first_name">First Name:
                <span v-if="pathName == 'first_name'" class="text-red">{{ invalidMessage }}</span></label>
              <input type="text" name="first_name" :value="user.first_name"
                :style="pathName == 'first_name' ? 'border:2px solid red' : ''" />
            </div>
            <div class="last-name flex flex-col">
              <label for="last_name">Last Name:
                <span v-if="pathName == 'last_name'" class="text-red">{{ invalidMessage }}</span></label>
              <input type="text" name="last_name" :value="user.last_name"
                :style="pathName == 'last_name' ? 'border:2px solid red' : ''" />
            </div>
          </div>
          <div id="email-role">
            <div id="email">
              <label for="email">Email Address:</label>
              <input type="email" name="email" :value="user.email" readonly />
            </div>
          </div>
          <div>
            <label for="">Role: <span v-if="pathName == 'role'" class="text-red">{{ invalidMessage }}</span></label>
            <div class="select-dropdown" :style="pathName == 'role' ? 'border:2px solid red' : ''">
              <select :value="user.role" name="role">
                <option value="" disabled>Select Role</option>
                <option value="admin">Admin</option>
                <option value="standard">Standard</option>
                <option value="guest">Guest</option>
              </select>
            </div>
          </div>
          <div class="flex flex-row justify-end gap-5">
            <BaseButton type="secondary-btn" class="text-white font-bold mt-7 text-end" @click="isActive.value = false">
              Cancel</BaseButton>
            <BaseButton @click="updateUser()" type="primary-btn" class="text-white font-bold mt-7 text-end"
              :loading="loading">
              Update</BaseButton>
          </div>
        </form>
      </template>
    </v-dialog>
  </v-col>
</template>

<script setup lang="ts">
import { ref } from "vue";
import BaseButton from "../widget/BaseButton.vue";
import { validFirstName, validLastName, validateRole } from "../../validation";

defineProps(["userId", "user", "editUser"]);
const form = ref<HTMLFormElement>();
const loading = ref(false);
const isCopy = ref(false);
const link = ref("");
const invalidMessage = ref("");
const pathName = ref("");

async function updateUser() {
  var formData = new FormData(form.value);
  const first_name = formData.get("first_name");
  const last_name = formData.get("last_name");
  const role = formData.get("role");
  const email = formData.get("email");
  const errFirstName = validFirstName(first_name);
  const errLastName = validLastName(last_name);
  const errRole = validateRole(role);
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
  if (errRole && role == "") {
    pathName.value = "role";
    invalidMessage.value = errRole;
    return;
  } else {
    pathName.value = "";
  }

  const data = {
    first_name,
    last_name,
    email,
    role,
  };

  loading.value = true;
  const res = await callAPI(`/user/updateUser`, "PUT", data);
  if (res.status == 200) {
    window.location.reload();
  } else {
    console.error("Failed to update user: ", res);
  }
}
// generateLink

const getResetPasswordLink = async () => {
  var formData = new FormData(form.value);
  const email = formData.get("email");
  const res = await callAPI(`/auth/generateLink`, "POST", {
    email: email,
  });
  if (res.status == 200) {
    link.value = res.data;
  } else console.error("Failed to get reset password link: ", res);
};
const copyText = () => {
  if (link.value != "") {
    navigator.clipboard.writeText(link.value);
    isCopy.value = true;
  } else {
    isCopy.value = false;
  }
};
</script>

<style scoped>
form {
  width: 650px;
  height: 550px;
  background: #ffff;
  display: flex;
  flex-direction: column;
  /* justify-content: center; */
  align-items: center;
  padding: 0px 20px 20px 20px;
}

form h1 {
  width: 650px;
  font-size: 2rem;
  /* margin: 20px; */
  font-weight: 600;
  color: #ffff;
  padding: 20px;
  text-align: center;
  background: #009639;
  margin-bottom: 30px;
}

#user-name {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 500px;
  margin-bottom: 1rem;
}

textarea:focus,
input:focus {
  outline: 1px solid #f1c400;
}

#user-name input {
  width: 240px;
  border: 2px solid #009639;
  padding: 0.4rem;
}

#email {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}

label {
  padding-bottom: 0.2rem;
  font-weight: 600;
}

#email input {
  width: 500px;
  border: 2px solid #009639;
  padding: 0.4rem;
}

/* =========================================== */

.icon-change {
  z-index: 100;
  cursor: pointer;
  margin-top: 20px;
}

.change {
  position: fixed;
  background: rgb(174, 168, 168);
  padding: 0.2rem;
  opacity: 0;
  visibility: hidden;
  transition: 0.1s;
  color: #ffff;
}

.icon-change:hover .change {
  opacity: 1;
  visibility: visible;
  transition: 0.1s;
  z-index: 100;
}

.icon-change span {
  font-size: 2rem;
}

/* =========================================== */
.copy-link .copy-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  background: #009639;
  padding: 5px 10px 10px 20px;
  color: #f1c400;
  font-weight: 500;
  font-size: 1.5rem;
}

.copy-header i {
  cursor: pointer;
  transition: all 0.1s linear;
}

.copy-header i:hover {
  background: #ffff;
  transition: all 0.1s linear;
  color: red;
  border-radius: 100px;
}

.copy-link div {
  background: #ffff;
  width: 600px;
  /* height: 100px; */
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.copy-link div input {
  margin: 20px;
  width: 500px;
  padding: 5px;
  border: 1px solid #009639;
}

textarea:focus,
.copy-link div input:focus {
  outline: none;
}

/* ======================================== */

.action-user {
  display: flex;
  flex-direction: row;
  gap: 1rem;
  justify-content: center;
}

.action-user .edit {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem;
  transition: 0.1s;
}

.action-user .edit:hover {
  background: #645f5f65;
  transition: 0.1s;
  cursor: pointer;
}

#edit-user {
  font-size: 1rem;
}

/* ========================================= */

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

  width: 500px;
}

.select-dropdown select {
  font-size: 1rem;
  font-weight: normal;
  width: 500px;
  padding: 6px 24px 6px 10px;
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

.edit .content {
  opacity: 0;
  position: absolute;
}

@media (max-width: 1000px) {
  #edit-user {
    display: none;
  }

  .edit .content {
    opacity: 0;
    position: absolute;
    background: #686464;
    margin-top: -4.6rem;
    padding: 0.2rem 1rem;
    color: white;
    border-radius: 0.5rem;
  }

  .edit:hover .content {
    opacity: 1;
  }
}
</style>
