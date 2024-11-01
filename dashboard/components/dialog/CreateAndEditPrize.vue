<template>
  <v-dialog v-model="dialog" width="530" persistent>
    <v-card class="rounded-0">
      <form>
        <div class="card-title">
          <span></span>
          <span class="title-dialog">
            <h3>{{ forEdit ? "Edit Prize" : "Add Prize" }}</h3>
          </span>
          <span class="material-symbols-outlined" @click="cancel"> close </span>
        </div>
        <div class="card-container">
          <div class="input-text mb-3">
            <div>
              <label>
                Prize Name (English):
                <span class="RequireMessage" v-if="pathName == 'english_name'">
                  {{ invalidMessage }}
                </span>
              </label>
              <br />
              <input type="text" class="resize-none focus:outline-none"
                :style="pathName == 'english_name' ? 'border: 2px solid red' : ''" v-model="englishName" />
            </div>
            <div class="khmer-name">
              <label>
                Prize Name (Khmer):
                <span class="RequireMessage" v-if="pathName == 'khmer_name'">
                  {{ invalidMessage }}
                </span>
              </label>
              <br />
              <input type="text" class="resize-none focus:outline-none"
                :style="pathName == 'khmer_name' ? 'border: 2px solid red' : ''" v-model="khmerName" />
            </div>
          </div>
          <label>
            Image 200 x 200:
            <span class="RequireMessage" v-if="pathName == 'prize_image'">
              {{ invalidMessage }}
            </span>
          </label>
          <br />
          <div class="file-input" :style="pathName == 'prize_image' ? 'border: 2px solid red' : ''">
            <div v-if="prize_image" class="image-container">
              <div class="close-img" @click="closeImage">
                <span class="material-symbols-outlined"> close </span>
              </div>
              <img :src="prize_image" />
            </div>
            <div v-if="!prize_image">
              <div>
                <div id="add-prize-image">
                  <p>
                    <span class="material-symbols-outlined"> add_circle </span>
                  </p>
                </div>
                <img id="image-icon" class="img-icon" src="/images/icone-d-image-grise.png" alt="" />
              </div>
              <input type="file" accept="image/*" ref="file" @change="readFile" />
            </div>
          </div>
        </div>
        <v-card-actions class="card-action">
          <div class="button-cancel">
            <BaseButton type="secondary-btn" @click="cancel">Cancel</BaseButton>
          </div>
          <div class="button-comfirm">
            <BaseButton v-if="!forEdit" type="primary-btn" @click.prevent="() => validateAndCallPrizeAPI(false)">
              Comfirm
            </BaseButton>
            <BaseButton v-if="forEdit" type="primary-btn" @click.prevent="() => validateAndCallPrizeAPI(true)">
              Comfirm
            </BaseButton>
          </div>
        </v-card-actions>
      </form>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import BaseButton from "../widget/BaseButton.vue";

defineProps(["forEdit"]);
const isFoundDimensions = ref(true);
const prizeId = ref("");
const englishName = ref("");
const khmerName = ref("");
const pathName = ref("");
const invalidMessage = ref("");
const dialog = ref(false);
const image = ref(false);
const prize_image = ref();
const imageDimensions = ref<{ width: number; height: number } | null>(null);
const readFile = async (event: any) => {
  const file = event.target.files[0];

  if (file) {
    // Convert the image to base64
    const base64String = await getBase64(file);
    // prize_image.value = base64String;
    // Create an Image object to get the image dimensions
    const image = new Image();
    image.src = base64String as string;
    image.onload = () => {
      const width = image.width;
      const height = image.height;
      if ((width != 200 && height != 200) || base64String === null) {
        pathName.value = "prize_image";
        invalidMessage.value = "Require size: 200 x 200";
        isFoundDimensions.value = false;
      } else {
        isFoundDimensions.value = true;
        prize_image.value = base64String;
      }
    };
    pathName.value = "";
    invalidMessage.value = "";
  }
};
async function getBase64(file: any) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

const cancel = () => {
  pathName.value = "";
  dialog.value = false;
  englishName.value = "";
  khmerName.value = "";
  prize_image.value = "";
};
const closeImage = () => {
  image.value = false;
  prize_image.value = "";
};

const validateAndCallPrizeAPI = async (forUpdate: boolean) => {
  // Input validation
  if (englishName.value == "") {
    invalidMessage.value = "Require!";
    pathName.value = "english_name";
    return;
  }
  if (khmerName.value == "") {
    invalidMessage.value = "Require!";
    pathName.value = "khmer_name";
    return;
  }
  if (!isFoundDimensions.value) {
    pathName.value = "prize_image";
    invalidMessage.value = "Require / Dimensions: 200 x 200";
  } else {
    pathName.value = "";
  }

  if (isFoundDimensions.value) {
    const listPrizes = {
      prize_image: prize_image.value,
      khmer_name: khmerName.value,
      english_name: englishName.value,
    };

    const url = forUpdate ? `/prize/updatePrize/${prizeId.value}` : "/prize/createPrize";
    const method = forUpdate ? "PUT" : "POST";

    const res = await callAPI(url, method, listPrizes);
    if (res.status == 200) {
      dialog.value = false;
      window.location.reload();
    } else {
      console.error(`Failed to ${forUpdate ? "Edit" : "Create"} prize: `, res);
    }
  }
};

//Show dialog create prize
const showDialogCreate = () => {
  dialog.value = true;
};
//Close dialog create prize
const closeDialogCreate = () => {
  dialog.value = false;
};
//Show dialog edit prize
const showDialogEdit = (prize: any) => {
  //Get prize data through showDialogEdit
  englishName.value = prize.english_name;
  khmerName.value = prize.khmer_name;
  prize_image.value = prize.prize_image;
  prizeId.value = prize.id;
  dialog.value = true;
  image.value = true;

  const imageNewObject = new Image();
  imageNewObject.src = prize.prize_image;
  imageNewObject.onload = () => {
    imageDimensions.value = {
      width: imageNewObject.width,
      height: imageNewObject.height,
    };
  };
};
//Close dialog edit prize
const closeDialogEdit = () => {
  dialog.value = false;
  pathName.value = "";
};

defineExpose({
  showDialogCreate,
  closeDialogCreate,
  showDialogEdit,
  closeDialogEdit,
});
</script>

<style scoped>
.title-dialog {
  display: flex;
  justify-content: center;
  color: white;
  font-size: larger;
}

.card-title {
  background-color: #00953a;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: 60px;
}

.card-title .material-symbols-outlined {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  color: white;
  margin-right: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.1s;
  padding: 0.1rem;
}

.card-title .material-symbols-outlined:hover {
  background: #f10000;
  transition: all 0.1s;
  border-radius: 100px;
  padding: 0.1rem;
}

.card-title h3 {
  font-size: 1.5rem;
  font-weight: 600;
}

.card-container {
  margin: 6%;
}

.card-container .input-text {
  display: flex;
  justify-content: center;
  justify-content: space-between;
}

.card-container .RequireMessage {
  font-size: small;
  color: red;
}

.input-text input[type="text"] {
  border: 2px solid #00953a;
  cursor: pointer !important;
}

.file-input {
  border: 2px solid #00953a;
  z-index: 100;
  cursor: pointer !important;
  height: 105px;
}

label {
  font-size: 0.9rem;
  font-weight: 600;
}

input[type="text"] {
  background-color: white;
  width: 225px;
  padding: 4px;
}

input[type="file"] {
  position: absolute;
  background-color: red;
  width: 465px;
  opacity: 0;
  padding-bottom: 60px;
  cursor: pointer;
  z-index: 100;
}

.file-input .material-symbols-outlined {
  user-select: none;
  position: absolute;
  color: #00953a;
  font-size: 34px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 465px;
  height: 100px;
  z-index: 100;
}

.file-input .img-icon {
  width: 110px !important;
  margin-top: -5px !important;
}

.image-container img {
  position: absolute;
  left: 220px;
  width: 100px !important;
  height: 100px;
  object-fit: contain;
}

.close-img .material-symbols-outlined {
  position: absolute;
  margin-left: 215px;
  color: white;
  margin-top: 9%;
  opacity: 0;
  margin-top: 30px;
  background-color: red;
  border-radius: 50%;
  width: 40px;
  height: 40px;
}

#add-prize-image {
  position: absolute;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-left: 215px;
  margin-top: 30px;
}

#add-prize-image p {
  background: red;
  width: 34px;
  height: 34px;
  border-radius: 50px;
  z-index: 100;
  background: #f1c400;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

#add-prize-image p span {
  width: 20px;
  height: 20px;
  border-radius: 100px;
  color: #ffff;
  font-size: 2rem;
  z-index: 100;
  margin-right: 0.01rem;
  margin-top: 0.01rem;
}

.file-input:hover .close-img .material-symbols-outlined {
  opacity: 1;
  transition: 0.8s ease;
  cursor: pointer;
}

.card-action {
  display: flex;
  justify-content: center;
  font-size: medium;
  gap: 20px;
  margin-bottom: 30px;
}

.card-action button {
  width: 100px;
}

#image-icon {
  position: absolute;
  width: 90px;
  margin-left: 175px;
  margin-top: -3px;
}
</style>
