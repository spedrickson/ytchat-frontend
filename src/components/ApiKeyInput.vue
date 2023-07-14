<template>
<!--  <api-key-dialog ref="apiKeyDialog"/>-->
  <q-btn-dropdown icon="fas fa-lock" label="apikey">
    <q-input label="API Key:" v-model="apikey" type="password"/>
  </q-btn-dropdown>
</template>

<script>
import {defineComponent, ref} from "vue";
// import ApiKeyDialog from "layouts/ApiKeyDialog.vue";

export default defineComponent({

  name: "ApiKeyInput",
  // components: {ApiKeyDialog},
  created() {
    if (this.$store.state.apikey.apikey.length === 0) {
      const localKey = localStorage.getItem('apikey')
      if (localKey) this.$store.commit('apikey/setApikey', localKey)
      else console.log("api key was empty on load")
    }
  },
  setup() {
    return {
      apikey: ref('')
    }
  },
  watch: {
    apikey(val) {
      this.$store.commit('apikey/setApikey', val)
    }
  },
  mounted() {
    this.apikey = this.$store.state.apikey.apikey
  },
})
</script>

<style scoped>

</style>
