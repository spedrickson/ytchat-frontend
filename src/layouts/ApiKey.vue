<template>
  <div>
    <q-header>Enter API key</q-header>
    <api-key-input/>
    <q-btn @click="$router.go(-1)">back</q-btn>
  </div>
</template>

<script>
import ApiKeyInput from "components/ApiKeyInput";

export default {
  name: "ApiKey",
  components: {ApiKeyInput}
}
</script>

<style scoped>

</style>
