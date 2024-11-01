<template>
  <TheTransition id="transition">
    <v-alert class="mr-5" width="40%" type="error" title="Error Invalid !" v-if="errLogin"
      :text="invalidMessage"></v-alert>
  </TheTransition>
  <TheTransition id="transition">
    <v-alert class="mr-5" width="40%" type="success" title="Login Success !" v-if="isLogin">You login success.</v-alert>
  </TheTransition>
  <div class="login-page">
    <div class="login">
      <img src="/images/smart-logo2.png" alt="" />
      <h1>Login</h1>
      <form @submit.prevent="login()" class="login-form">
        <input type="email" id="email" class="resize-none focus:outline-none" placeholder="Enter your email*"
          :style="pathName == 'email' ? 'border:3px solid red' : ''" v-model="email"
          @input="validateUserEmail(email)" />
        <span :class="pathName == 'email'
      ? 'mt-2 validation-message'
      : 'mt-2 validation-message-none'
      ">{{ invalidMessage }}.</span>
        <div class="pass">
          <input v-if="showPassword" type="text" class="resize-none focus:outline-none" v-model="password"
            @click="inputPassword" :min="minPasswordLength" @input="validatePass(password)"
            :style="pathName == 'password' ? 'border:3px solid red' : ''" placeholder="Enter your password*" />
          <input v-else type="password" class="resize-none focus:outline-none" v-model="password"
            :min="minPasswordLength" @input="validatePass(password)" @click="inputPassword"
            :style="pathName == 'password' ? 'border: 3px solid red' : ''" placeholder="Enter your password*" />
          <button>
            <span class="material-symbols-outlined" @click.prevent="toggleShow" v-if="!showPassword">visibility</span>
            <span class="material-symbols-outlined" @click.prevent="toggleShow"
              v-if="showPassword">visibility_off</span>
          </button>
        </div>
        <span :class="pathName == 'password'
      ? 'mt-2 mb-3 validation-message'
      : 'mt-2 validation-message-none'
      ">{{ invalidMessage }}.</span>
        <BaseButton type="primary-btn" @click="login"  :class="isLogin?'disable-btn':'btn-login'"  :loading="loading" @keydown.enter="login">
          LOGIN</BaseButton>


      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import BaseButton from "@/components/widget/BaseButton.vue";
import TheTransition from "@/components/widget/TheTransition.vue";
import { validateEmail } from "@/validation";
import { minPasswordLength } from "@/configs";

useSeoMeta({
  title: "Login > Smart | Lucky Draw",
});

definePageMeta({
  layout: "no-app-bar",
});

const invalidMessage = ref<string | null>(null);
const router = useRouter();
const pathName = ref("");
const password = ref("");
const email = ref("");
const loading = ref(false);
const isLogin = ref(false);
const errLogin = ref(false);
const showPassword = ref(false);

const toggleShow = () => {
  showPassword.value = !showPassword.value;
};

const inputPassword = () => {
  if (password.value == '') {
    pathName.value = "password";
    invalidMessage.value = "Password is required";
  }
}

const validatePass = (password: string) => {
  if (!password) {
    pathName.value = "password";
    invalidMessage.value = "Password is required";
    return;
  } else {
    pathName.value = "";
    invalidMessage.value = "";
  }
};
const validateUserEmail = (email: string) => {
  if (!email) {
    pathName.value = "email";
    invalidMessage.value = "Email is required";
    return;
  } else {
    pathName.value = "";
    invalidMessage.value = "";
  }
};

const login = async () => {
  const errEmail = validateEmail(email.value);
  if (errEmail) {
    pathName.value = "email";
    invalidMessage.value = errEmail;
    return;
  }
  if (!password.value) {
    pathName.value = "password";
    invalidMessage.value = "Password is required";
    return;
  }
  if (!password.value) {
    pathName.value = "password";
    invalidMessage.value = 'is required';
    return;
  } else {
    pathName.value = "";
  }
  loading.value = true;
  const res = await callAPI("/auth/login", "POST", {
    email: email.value,
    password: password.value,
  });
  loading.value = false;
  if (res.status == 200) {
    isLogin.value = true;
    setTimeout(() => {
      isLogin.value = false;
      router.push("/");
    }, 2000);
  } else {
    invalidMessage.value = res.error || "Unknown Error";
    loading.value = false;
    errLogin.value = true;
    setTimeout(() => {
      errLogin.value = false;
    }, 2000);
  }
};
</script>

<style scoped>
h1 {
  text-align: center;
  width: 500px;
  padding: 20px;
  font-size: 3rem;
  color: white;
  background: #009639;
  z-index: 10;
  font-weight: 600;
}

.disable-btn {
    background: rgb(158, 231, 161);
    color: rgb(165, 164, 164);
    font-weight: 600;
    padding: 0.5rem 1.5rem;
    border-radius: 5px;
    cursor: pointer;
    pointer-events: none;
    height: 2.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
.login-form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: #e4dfdf;
  align-items: center;
  margin-top: -50px;
  padding: 100px 50px 50px 50px;
}

.login-page a {
  font-size: 1.5rem;
  color: black;
  transition: all 0.5s;
}

.login-page a:hover {
  color: #f1c400;
  transition: all 0.5s;
}

.login-page {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.login {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: white;
}

.login-page input {
  width: 600px;
  margin-top: 20px;
  padding: 10px 0px 10px 10px;
  border: 2px solid #009639;
  font-size: 1.5rem;
  background: rgb(255, 255, 255);
}

.login-page .btn-login {
  width: 200px;
  height: 60px;
  margin-top: 30px;
  font-size: 1.5rem;
  color: white;
}

.btn:hover {
  background: #f1c400;
  color: #009639;
  transition: all 0.5s;
}

.login-page img {
  width: 300px;
  margin-bottom: 30px;
}

input::placeholder {
  color: rgba(0, 0, 0, 0.719);
  font-size: 1.3rem;
}

.pass {
  text-align: center;
}

.pass button {
  position: sticky;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  z-index: 200;
  text-align: end;
  position: absolute;
  margin-top: -40px;
  margin-right: 20px;
  margin-left: 550px;
  color: #009639;
}

.pass button:hover {
  color: #f1c400;
  transition: 0.5s;
}

.validation-message {
  color: red;
  opacity: 1;
}

.validation-message-none {
  opacity: 0;
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
  h1 {
    width: 300px;
    font-size: 2rem;
  }

  .login-page img {
    width: 150px;
    margin-bottom: 30px;
    margin-top: -30px;
  }

  .login-form {
    width: 500px;
    height: 400px;
  }

  .login-page input {
    width: 400px;
    margin-top: 15px;
    padding: 8px 0px 8px 8px;
    font-size: 1rem;
  }

  input::placeholder {
    font-size: 1rem;
  }

  .login-page .btn-login {
    width: 100px;
    height: 40px;
    margin-top: 20px;
    padding: 0.5rem;
    font-size: 1rem;
    color: white;
  }

  .btn-rest.btn-rest {
    font-size: 1rem;
  }

  .pass button {
    margin-top: -34px;
    margin-left: 360px;
  }
}
</style>
