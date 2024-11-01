<template>
  <v-btn :class="type" outlined rounded="md" class="">
    <slot></slot>
  </v-btn>
</template>

<script setup lang="ts">

defineProps({
  type: String,
})

</script>

<style scoped>
.secondary-btn {
  border-radius: 0px;
  background: #F1C400;
  transition: all 0.1s;
  margin-left: 2px;
  font-weight: 700;
  color: #009639 !important;
  font-size: 1.1rem !important;
  text-transform: none;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 5px 0px, rgba(0, 0, 0, 0.1) 0px 0px 1px 0px;
}

.primary-btn {
  border-radius: 0px;
  background: #009639;
  transition: all 0.1s;
  font-weight: 700;
  color: #ffff !important;
  text-transform: none;
  font-size: 1.1rem !important;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 5px 0px, rgba(0, 0, 0, 0.1) 0px 0px 1px 0px;

}

.primary-btn:hover {
  background: #E0457B;
  transition: all 0.1s;
}

.secondary-btn:hover {
  background: #E0457B;
  transition: all 0.1s;
  /* color:#F1C400 !important; */
  color: #ffff !important;
}

.v-btn--disabled.primary-btn {
  background: #5c7064 !important;
  opacity: 0.8;
}

.v-btn--disabled.secondary-btn {
  background: #F1C400 !important;
  opacity: 0.8;
}
</style>