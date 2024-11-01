<template>
  <div class="fixed flex items-center justify-center inset-0" v-if="show">
    <div class="fixed w-full h-full bg-black opacity-80 z-10"></div>
    <!-- <div class="animate-spin flex items-center space-x-4 p-2 bg-white rounded-md shadow-lg">
      <div class="w-1/4 h-4 bg-gray-300 rounded-md"></div>
    </div> -->
    <div class="min-w-96 z-20 bg-white">
      <div class="bg-green-600 p-3 w-full text-center">
        <div class="text-white font-bold text-xl">{{ title || "Loading..." }}</div>
      </div>
      <div class="w-full px-3 py-6 text-gray-500">
        <svg
          v-if="indefinite"
          class="animate-spin h-12 w-12 mx-auto"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="grey" stroke-width="4"></circle>
          <path
            class="opacity-75 fill-green-600"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>

        <p class="text-center my-3" v-if="text">{{ text }}</p>

        <div class="bg-gray-200 h-2 rounded" v-if="!indefinite">
          <div
            class="bg-green-600 h-2 rounded w-full animate-pulse transition-all"
            :style="`width: ${(progress || 0) * 100}%`"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps(["progress", "title", "text", "indefinite", "show"]);
</script>
