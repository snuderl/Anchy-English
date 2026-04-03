<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import PublicHeader from '@/components/PublicHeader.vue'

const route = useRoute()
const isAdmin = computed(() => route.path.startsWith('/admin'))
</script>

<template>
  <div id="app">
    <PublicHeader v-if="!isAdmin" />
    <router-view />
  </div>
</template>

<style>
@import './assets/main.css';
</style>
