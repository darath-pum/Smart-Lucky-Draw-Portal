<template>
  <transition id="transition" name="alert" mode="out-in">
    <slot></slot>
  </transition>
</template>

<style scoped>
.alert-enter-active {
  transition: all 0.3s ease-out;
}

.alert-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.alert-enter-from,
.alert-leave-to {
  transform: translateX(20px);
  opacity: 0;
}

#transition {
  position: sticky;
  top: 0;
  z-index: 100000;
}
</style>
