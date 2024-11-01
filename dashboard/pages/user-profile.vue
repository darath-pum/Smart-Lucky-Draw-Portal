<template>
  <div class="user-information">
    <div id="bg-img"></div>
    <div class="profile">
      <div id="image">
        <ClientOnly>
          <img class="w-[10rem] h-[10rem] object-cover rounded-full" :src="authStore.profile || defaultAvatarURL" alt="avatar" />
        </ClientOnly>
      </div>
      <span class="material-symbols-outlined"> photo_camera </span>
      <input id="input1" type="file" v-on:change="handleFileChange" accept="image/*" />
      <input id="input2" type="file" v-on:change="handleFileChange" accept="image/*" />
    </div>
    <div class="welcome">
      <LazyClientOnly>
        <h1>Welcome, {{ authStore.first_name }} {{ authStore.last_name }}</h1>
      </LazyClientOnly>
    </div>
    <v-dialog transition="dialog-bottom-transition" width="auto">
      <template v-slot:activator="{ props }">
        <BaseButton type="primary-btn" class="btn-change-password" v-bind="props">Change Password</BaseButton>
      </template>

      <template v-slot:default="{ isActive }">
        <div class="password">
          <h1>Change Password</h1>
          <div class="old-pass flex flex-col">
            <label for="">Old Password*:
              <span class="text-red" v-if="errCode == 404">{{
            invalidMessage
          }}</span></label>
            <span class="input-old-pass">
              <input type="password" placeholder="Enter old password*" v-model="old_pass"
                :style="errCode == 404 ? 'border:2px solid red' : ''" /></span>
          </div>

          <ValidatePassword id="validate-password" :placeholder="'Enter new password*'"></ValidatePassword>
          <div class="confirm-pass flex flex-col">
            <label for="">Confirm Password*:
              <span class="text-red" v-if="pathName == 'confirm_pass'">{{
            invalidMessage
          }}</span></label>
            <span class="input-confirm-pass"><input type="password" placeholder="Enter confirm password*"
                v-model="confirm_pass" :style="pathName == 'confirm_pass' ? 'border:2px solid red' : ''
            " /></span>
          </div>
          <div class="ml-12">
            <p class="mb-3 text-slate-600 font-semibold">
              The new password must meet the following guidelines:
            </p>
            <span class="text-red">Does not macth your useraname Is at least 8 characters long and
              have <br />
              contain uppercase lowercase and sign (!@#$)
            </span>
          </div>
          <div class="confirm">
            <BaseButton type="secondary-btn" class="mt-10 text-white w-24" @click="isActive.value = false">
              Cancel</BaseButton>
            <BaseButton type="primary-btn" class="mt-10 text-white w-24" @click.prevent="userChangePassword"
              :loading="loading" :disabled="!old_pass || !new_pass || !confirm_pass">
              save</BaseButton>
          </div>
        </div>
      </template>
    </v-dialog>

    <div class="username">
      <div class="first-name">
        <label for="">First Name<span class="text-red">*</span>:
          <span class="text-red" v-if="pathName == 'first_name'">{{
            invalidMessage
          }}</span></label>
        <div>
          <span><input v-if="isInputFirstName == false" type="text" v-model="first_name" readonly
              class="first-none flex-col" /></span>

          <span><input v-if="isInputFirstName == true" type="text" v-model="first_name" class="first flex-col" :style="pathName == 'first_name' ? 'border-bottom:2px solid red' : ''
            " /></span>
          <span @click="closeInputFirst" v-if="isInputFirstName == true" class="material-symbols-outlined">close</span>
          <span @click="showInputFirstName" v-if="isInputFirstName == false"
            class="material-symbols-outlined">edit</span>
        </div>
      </div>
      <div class="last-name">
        <label for="">Last Name<span class="text-red">*</span>:
          <span class="text-red" v-if="pathName == 'last_name'">{{
            invalidMessage
          }}</span></label>
        <div>
          <span><input v-if="isInputLastName == false" type="text" v-model="last_name" readonly
              class="last-none flex-col" /></span>

          <span><input v-if="isInputLastName == true" type="text" v-model="last_name" class="last flex-col" :style="pathName == 'last_name' ? 'border-bottom:2px solid red' : ''
            " /></span>
          <span @click="closeInputLast" v-if="isInputLastName == true" class="material-symbols-outlined">close</span>
          <span @click="showInputLastName" v-if="isInputLastName == false" class="material-symbols-outlined">edit</span>
        </div>
      </div>
      <div class="email-address">
        <label for="">Email Adress<span class="text-red">*</span>: </label>
        <div>
          <span><input type="text" readonly v-model="authStore.email" class="email flex-col" /></span>
        </div>
      </div>
    </div>

    <div class="button flex flex-row gap-5">
      <BaseButton type="secondary-btn" class="cancel w-24" @click="() => $router.go(-1)">Cancel
      </BaseButton>

      <BaseButton type="primary-btn" class="save w-24" @click.prevent="userChangeUsername" :disabled="first_name == authStore.first_name && last_name == authStore.last_name
            " :loading="loading">
        Save
      </BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import BaseButton from "@/components/widget/BaseButton.vue";
import { validatePassword, validFirstName, validLastName } from "../validation";
import { defaultAvatarURL } from "@/configs";
import { useAuthStore } from "@/store/auth";
import ValidatePassword from "@/components/ValidatePassword.vue";

const authStore = useAuthStore();

useSeoMeta({
  title: "User Manage Account > Smart | Lucky Draw",
});

const router = useRouter();

const isInputFirstName = ref(false);
const isInputLastName = ref(false);

const newProfile: any = ref<File>();
const first_name = ref(authStore.first_name);
const last_name = ref(authStore.last_name);
const old_pass = ref("");
const new_pass = ref("");
const confirm_pass = ref("");
const invalidMessage = ref("");
const pathName = ref("");
const errCode = ref(0);
const loading = ref(false);
const showPassword = ref(false);

const validatePass = (new_pass: string) => {
  const passwordErr = validatePassword(new_pass);
  if (passwordErr) {
    pathName.value = "new_pass";
    invalidMessage.value = passwordErr;
    return;
  } else {
    pathName.value = "";
    invalidMessage.value = "";
  }
};
const userChangeUsername = async () => {
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
  } else {
    pathName.value = "";
  }
  let data = {
    first_name: first_name.value,
    last_name: last_name.value,
    email: authStore.email,
    role: authStore.role,
  };

  loading.value = true;
  const res = await callAPI(`/user/updateUser`, "PUT", data);
  loading.value = false;
  if (res.status == 200) {
    window.location.href = "/user-profile";
  } else {
    errCode.value = res.code;
    invalidMessage.value = res.error || "Unknown Error";
    pathName.value = "api";
  }
};

const userChangePassword = async () => {
  const passwordErr = validatePassword(new_pass.value);
  if (passwordErr) {
    pathName.value = "new_pass";
    invalidMessage.value = passwordErr;
    return;
  }
  if (new_pass.value != confirm_pass.value) {
    pathName.value = "confirm_pass";
    invalidMessage.value = "Confirm password is incorrect";
    return;
  } else {
    pathName.value = "";
  }
  let data = {
    first_name: first_name.value,
    last_name: last_name.value,
    email: authStore.email,
    role: authStore.role,
    password: old_pass.value,
    new_password: new_pass.value,
  };

  loading.value = true;
  const res = await callAPI(`/user/updateUser`, "PUT", data);
  if (res.status == 200) {
    setTimeout(() => {
      loading.value = false;
      router.push("/login");
    }, 2000);
  } else {
    errCode.value = res.code;
    invalidMessage.value = res.error || "Unknown Error";
    pathName.value = "api";
    if (errCode.value == 404) {
      pathName.value = "new_pass";
    }
  }
};

const showInputFirstName = () => {
  isInputFirstName.value = true;
  pathName.value = "";
};
const showInputLastName = () => {
  isInputLastName.value = true;
  pathName.value = "";
};

const closeInputFirst = () => {
  isInputFirstName.value = false;
  first_name.value = authStore.first_name;
  pathName.value = "";
};
const closeInputLast = () => {
  isInputLastName.value = false;
  last_name.value = authStore.last_name;
  pathName.value = "";
};

async function getBase64(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

const handleFileChange = async (event: any) => {
  newProfile.value = await getBase64(event.target.files[0]);

  const res = await callAPI(
    `/user/updateUserImageProfile/${authStore.user_id}`,
    "PUT",
    { profile: newProfile.value }
  );
  if (res.status == 200) {
    window.location.reload();
  } else console.error("Error update image: ", res);
};

const toggleShow = () => {
  showPassword.value = !showPassword.value;
};
</script>

<style scoped>
.user-information {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: rgb(255, 255, 255);
  width: 50%;
  margin: auto;
  height: 900px;
  padding: 3rem;
  box-shadow: rgba(14, 30, 37, 0.12) 0px 2px 4px 0px,
    rgba(14, 30, 37, 0.32) 0px 2px 16px 0px;
}

.btn-change-password {
  margin-top: 20px;
  height: 50px;
}

.profile span {
  position: absolute;
  margin-top: -50px;
  margin-left: 110px;
  background: #8f8888;
  border: 2px solid #ffff;
  border-radius: 100px;
  padding: 5px;
  text-align: end;
  cursor: pointer !important;
}

.save,
.cancel {
  height: 40px;
  margin-top: 50px;
}

#image {
  position: relative;
  overflow: hidden;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
    rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
  justify-content: center;
}



.profile #input1 {
  position: absolute;
  margin-top: -50px;
  margin-left: 110px;
  background: #8f8888;
  width: 40px;
  height: 40px;
  border: 2px solid #ffff;
  border-radius: 100px;
  padding: 5px;
  text-align: end;
  opacity: 0;
  z-index: 100;
  cursor: pointer !important;
}

.profile #input2 {
  position: absolute;
  margin-top: -140px;
  background: #8f8888;
  width: 140px;
  height: 140px;
  z-index: 100;
  border: 2px solid #ffff;
  border-radius: 100px;
  padding: 5px;
  text-align: end;
  cursor: pointer !important;
  opacity: 0;
  /* background: #000; */
}

.welcome h1 {
  font-size: 1.5rem;
  font-weight: 600;
  text-align: center;
  width: 600px;
  padding-bottom: 0.5rem;
  margin-top: 1rem;
}

.username {
  border: 2px solid #009639;
  width: 700px;
  height: 800px;
  padding-bottom: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  gap: 2rem;
  margin-top: 3rem;
}


.first-name div,
.last-name div,
.email-address div {
  width: 580px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.first,
.last {
  border-bottom: 0.12rem solid #009639;
  width: 550px;
  padding-bottom: 0.2rem;
  user-select: none;
  margin-top: 1rem;
}

.first-none,
.last-none,
.email {
  border-bottom: 1px solid #babebc;
  width: 550px;
  padding-bottom: 0.2rem;
  user-select: none;
  margin-top: 1rem;
  color: gray;
}

.first div,
.last div,
.email div {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.first-name label,
.last-name label,
.email-address label {
  font-weight: 600;
}

/* ============================ */
.first-name .material-symbols-outlined,
.last-name .material-symbols-outlined,
.email-address .material-symbols-outlined {
  padding-left: 1rem;
  cursor: pointer;
  color: #009639;
}

.first-name .material-symbols-outlined:hover,
.email-address .material-symbols-outlined:hover,
.last-name .material-symbols-outlined:hover {
  color: #f1c400;
}

.password {
  background: #ffffff;
  height: 38rem;
}

.password h1 {
  margin: auto;
  font-size: 1.4rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #ffff;
  background: #009639;
  padding: 20px;
  margin-bottom: 3rem;
}

.old-pass,
.confirm-pass {
  margin: 0rem 4.5rem 1rem 4.3rem;
  /* background: #000; */
}

#validate-password {
  margin: 0rem 3rem 1rem 3rem;
  /* background: #000; */
}

.password div input {
  width: 100%;
  border: 2px solid #009639;
  padding: 10px 5px;
  color: #8f8888;
}

textarea:focus,
input:focus {
  outline: none;
}

.password div label {
  color: #393d3b;
  padding-bottom: 0.2rem;
  font-weight: 600;
}

.confirm {
  display: flex;
  flex-direction: row;
  width: 600px;
  justify-content: center;
  gap: 2rem;
}

@media (max-width: 1366rem) {
  .user-information {
    width: 800px;
    margin-top: 50px;
    margin-bottom: 50px;
  }
}

@media (max-width: 820px) {
  .user-information {
    width: 98%;
    height: 800px;
    margin-top: 50px;
  }

  .username {
    width: 520px;
  }

  .first-name div,
  .last-name div,
  .email-address div {
    width: 460px;
  }

  .first,
  .last {
    width: 430px;
  }

  .first-none,
  .last-none,
  .email {
    width: 430px;
  }

  .profile span {
    margin-top: -40px;
    margin-left: 75px;
  }

  #image {
    width: 100px;
    height: 100px;
  }

  #image img {
    width: 100%;
    height: auto;
  }

  .profile #input1 {
    margin-top: -50px;
    margin-left: 100px;

    width: 30px;
    height: 30px;
  }

  .profile #input2 {
    margin-top: -100px;
    width: 100px;
    height: 100px;

    /* background: #000; */
  }

  .btn-change-password {
    width: 200px;
  }
}

@media (max-width: 60rem) {
  .user-information {
    width: 85%;
    height: 800px;
    margin-top: 50px;
  }
}

@media (max-width: 50rem) {
  .user-information {
    box-shadow: none !important;
  }
}

</style>
