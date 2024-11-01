<template>
    <div class="pass">
        <label for="" class="ml-5 mt-2"> Password: <span class="input-label"
                v-if="pathName == 'password' && invalidMessage == 'is required'">{{
                    invalidMessage }}.</span>
        </label>
        <input v-if="showNewPassword" type="text" class="resize-none focus:outline-none" v-model="password"
            @click="inputPassword" @input="validatePass(password)"
            :style="pathName == 'password' ? 'border:2px solid red' : ''" :placeholder="placeholder" />
        <input v-else type="password" class="resize-none focus:outline-none" v-model="password" @click="inputPassword"
            @input="validatePass(password)" :style="pathName == 'password' ? 'border:2px solid red' : ''"
            :placeholder="placeholder">
        <button>
            <span id="button" class="material-symbols-outlined" @click.prevent="toggleShowNewPassword"
                v-if="!showNewPassword">visibility</span>
            <span id="button" class="material-symbols-outlined" @click.prevent="toggleShowNewPassword"
                v-if="showNewPassword">visibility_off</span>
        </button>

        <div id="card-pass-validate" v-if="pathName == 'password' && invalidMessage !== 'is required'">
            <div>
                <p style="font-size: 1.2rem;">Password Rule:</p>
            </div>
            <div class="message-confirm">
                <div class="flex flex-row">
                    <span v-if="isNumberLength" class="material-symbols-outlined text-white">check_circle</span>
                    <span v-else class="material-symbols-outlined error-icon"><span class="material-symbols-outlined"
                            id="error-icon">
                            error
                        </span></span>
                </div>
                <span class="text-message"><span id="first">Must be</span> <span id="key-word">8
                        characters or
                        more.</span> </span>
            </div>
            <div class="message-confirm">
                <div class="flex flex-row">
                    <span v-if="isLowercase" class="material-symbols-outlined text-white">check_circle</span>
                    <span v-else class="material-symbols-outlined "><span class="material-symbols-outlined"
                            id="error-icon">
                            error
                        </span></span>
                </div>
                <span class="text-message"><span id="first">At least </span><span id="key-word">one
                        Lowercase</span>
                    <span id="first"> letter.</span></span>
            </div>
            <div class="message-confirm">
                <div class="flex flex-row">
                    <span v-if="isUppercase" class="material-symbols-outlined text-white">check_circle</span>
                    <span v-else class="material-symbols-outlined "><span class="material-symbols-outlined"
                            id="error-icon">
                            error
                        </span></span>
                </div>
                <span class="text-message"><span id="first">At least </span><span id="key-word">one
                        Uppercase</span>
                    <span id="first"> letter.</span></span>
            </div>
            <div class="message-confirm">
                <div class="flex flex-row">
                    <span v-if="isNumber" class="material-symbols-outlined text-white">check_circle</span>
                    <span v-else class="material-symbols-outlined "><span class="material-symbols-outlined"
                            id="error-icon">
                            error
                        </span></span>
                </div>
                <span class="text-message"> <span id="first">At least </span><span id="key-word">One
                        Number</span>.</span>
            </div>
            <div class="message-confirm">
                <div class="flex flex-row">
                    <span v-if="isSpecialChar" class="material-symbols-outlined text-white">check_circle</span>
                    <span v-else class="material-symbols-outlined "><span class="material-symbols-outlined"
                            id="error-icon">
                            error
                        </span></span>
                </div>
                <span class="text-message"><span id="first"> At least one special character </span><span
                        id="key-word">(@$!%*?&)</span>.</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { validatePassword } from '@/validation';
const isNumberLength = ref(false);
const isLowercase = ref(false);
const isUppercase = ref(false);
const isNumber = ref(false);
const isSpecialChar = ref(false);
const pathName = ref("");
const invalidMessage = ref("");
const showNewPassword = ref(false);
const password = ref<string>("");
const emit = defineEmits(["custom-event"]);
const props = defineProps(["placeholder"])
const inputPassword = () => {

    if (password.value == "") {
        pathName.value = "password"
        invalidMessage.value = "is required"
    }
}

const validatePass = (password: string) => {
    const passwordErr = validatePassword(password);
    // console.log(passwordErr);

    if (passwordErr) {
        pathName.value = "password";
        invalidMessage.value = passwordErr;
    }

    isNumberLength.value = passwordErr?.passwordlength || false;
    isLowercase.value = passwordErr?.lowercaseRegex || false;
    isUppercase.value = passwordErr?.uppercaseRegex || false;
    isNumber.value = passwordErr?.numberRegex || false;
    isSpecialChar.value = passwordErr?.specialCharRegex || false;

    if (isLowercase.value && isUppercase.value && isNumber.value && isSpecialChar.value && isNumberLength.value) {
        pathName.value = "";
        invalidMessage.value = "";
    }
    sendDataToParent(password)
};

const sendDataToParent = (password: string) => {
    emit("custom-event", password);
};
const toggleShowNewPassword = () => {
    showNewPassword.value = !showNewPassword.value;
}
</script>

<style scoped>
span {
    color: #ff0000;
    margin: auto;
}

.pass input {
    margin: 0px 20px 0px 20px;
    padding: 9px 0px 9px 5px;
    border: 2px solid #009639;
    background: #fff;
    font-size: 1rem;
}

label {
    font-weight: 600;
    padding-bottom: 0.1rem;
    font-size: 1rem !important;

}

.input-label {
    font-weight: 600;
    color: #ff0000;
}

.register-form img {
    width: 250px;
    margin-bottom: 30px;
}


input::placeholder {
    font-size: 1rem !important;
    color: rgba(0, 0, 0, 0.466);
}


.pass {
    display: flex;
    flex-direction: column;
    width: 500px;
}

.validation-message {
    color: red;
    opacity: 1;
}

.passConfirm {
    color: red;
}

.validation-message-none {
    opacity: 0;
}

/* ============================================ */

#card-pass-validate {
    width: 25rem;
    height: 232px;
    padding: 1.3rem 1.6rem;
    background: #009639;
    position: relative;
    -moz-border-radius: 10px;
    -webkit-border-radius: 10px;
    border-radius: 10px;
    position: absolute;
    margin-left: 31rem;
    margin-top: -3.5rem;
    transition: all 0.1s;
    z-index: 2;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;


}

#key-word {
    color: #fff;
    font-weight: 600 !important;

}

#first {
    color: #fff;
    font-weight: 500 !important;

}

#card-pass-validate div div {
    width: 2.5rem;
    /* font-weight: 600; */
}

#card-pass-validate .message-confirm .text-message {
    text-align: start;
    width: 29rem;
    color: #ffffff;
    /* font-size: 400; */
}

#card-pass-validate div {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    color: #ffffff;
    font-weight: 600;
    width: 29rem;


}

#error-icon {
    color: #F1C400 !important;
    /* background: #000; */
}

#card-pass-validate:before {
    z-index: 2;
    content: "";
    position: absolute;
    /* right: 100%; */
    margin-top: 4.3rem;
    margin-left: -2.2rem;
    top: 26px;
    width: 0;
    height: 0;
    border-top: 19px solid transparent;
    border-right: 20px solid #009639;
    border-bottom: 19px solid transparent;
}

/* ======================================= */
#button {
    position: sticky;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    z-index: 200;
    text-align: end;
    position: absolute;
    margin-top: -35px;
    /* margin-right: 20px; */
    margin-left: 440px;
    color: #009639 !important;
}

#button:hover {
    color: #F1C400 !important;
    transition: 0.5s;
}

/* ================================ */
</style>
