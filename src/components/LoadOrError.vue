<template>
  <div class="text-center" v-if="!loading && count === 0">
    <h2>{{ noMessageLabel ?? "No messages :(" }}</h2>
  </div>
  <div class="text-center" v-if="loading && count === 0">
    <h2>Loading...</h2>
    <q-spinner-tail size="xl" />
  </div>
</template>

<script setup>
const props = defineProps(["loading", "count", "noMessageLabel"]);
</script>
