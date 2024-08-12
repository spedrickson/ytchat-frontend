<template>
  <q-select v-model="model" :options="options" label="Select sort...">
  </q-select>
</template>

<script setup>
const model = defineModel();
const options = [
  {
    label: "Newest first",
    value: { publishedAt: -1 },
    description: "Sort by published date, from newest to oldest",
    category: "1",
  },
  {
    label: "Oldest first",
    value: { publishedAt: 1 },
    description: "Sort by published date, from oldest to newest",
    category: "1",
  },
];
</script>
