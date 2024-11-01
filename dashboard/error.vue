<template>
  <div class="absolute h-full w-full bg-slate-100 flex flex-col items-center justify-center">
    <h1 class="text-9xl font-extrabold drop-shadow text-red-800">Ooops!</h1>
    <p class="text-xl my-8">It's looks like something went wrong</p>
    <div class="bg-red-400 p-2 rounded-md text-white">Detail: {{ error?.statusMessage || error?.message }}</div>
    <NuxtLink to="/" class="my-8 text-2xl font-bold text-red-500">Back to Home</NuxtLink>
  </div>
</template>

<script lang="ts" setup>
const error = useError();
</script>
