<template>
  <div class="text-center" v-if="!loading && count === 0">
    <h2>No messages :(</h2>
  </div>
  <div class="text-center" v-if="loading && count === 0">
    <h2>Loading...</h2>
    <q-spinner-tail size="xl" />
  </div>
</template>

<script setup>
import { defineProps } from "vue";
const props = defineProps(["loading", "count"]);
</script>
