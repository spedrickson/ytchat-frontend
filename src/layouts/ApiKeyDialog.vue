<template>
  <q-dialog v-model="showDialog" persistent maximized transition-show="jump-right" transition-hide="jump-left" ref="overlay">
    <q-card class="bg-negative">
      <q-card-section>
        <div class="text-h2">not authenticated >:(</div>
      </q-card-section>
      <q-card-section>
        <api-key-input/>
      </q-card-section>
      <q-card-actions stretch>
        <q-btn @click="testApiKey" label="test"/>
      </q-card-actions>
    </q-card>
  </q-dialog>>
</template>

<script>
import ApiKeyInput from "components/ApiKeyInput";
import {api} from "boot/axios";
import {defineComponent} from "vue";

export default defineComponent({
  name: "ApiKeyDialog",
  components: {ApiKeyInput},
  data() {
    return {
      showDialog: false
    }
  },
  methods: {
    apikey() {
      return this.$store.state.apikey.apikey
    },
    show() {
      this.showDialog = true;
    },
    testApiKey() {
      const url = `/auth/view?key=${this.apikey()}`
      api.get(url).then((data) => {
        console.log("test passed")
        this.showDialog = false;
      }).catch((data) => {
        this.$refs.overlay.shake();
        console.log("test failed")
      })
    }
  }
})
</script>

<style scoped>

</style>
