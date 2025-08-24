<script setup>
import AppHeader from './components/AppHeader.vue'
</script>

<template>
  <div id="app">
    <AppHeader />
    <router-view />
  </div>
</template>

<style>
@import './assets/main.css';
</style>
