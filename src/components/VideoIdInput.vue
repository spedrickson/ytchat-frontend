<template>
  <q-input
    v-model="localModel"
    debounce="300"
    label="URL or VideoID"
    @update:model-value="parseUrlOrVideoId"
  />
</template>

<script setup>
import { ref } from "vue";

const model = defineModel();
const localModel = ref(model.value);

function parseUrlOrVideoId(value) {
  const extracted = getId(value);
  console.log("new value", value, extracted);
  model.value = extracted ? extracted : value;
}

// from https://stackoverflow.com/a/8260383
function getId(url) {
  let regex =
    /(youtu.*be.*)\/(watch\?v=|embed\/|v|shorts|)(.*?((?=[&#?])|$))/gm;
  return regex.exec(url)[3];
}
</script>
