<script setup lang="ts">
// App.vue 现在只负责路由容器
</script>

<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style>
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
}

#app {
  margin: 0;
  padding: 0;
  height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  background-color: #1e1e1e;
  color: #ffffff;
}
</style>
