<template>
  <q-input v-model="apikey" type="password"/>
</template>

<script>
import {defineComponent, ref} from "vue";

export default defineComponent({

  name: "ApiKeyInput",
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
