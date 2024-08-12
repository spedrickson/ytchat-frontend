<template>
  <q-btn-dropdown icon="fas fa-lock" label="apikey">
    <q-input label="API Key:" v-model="apikey" type="password" />
  </q-btn-dropdown>
  <q-dialog v-model="showDialog" persistent ref="overlay">
    <q-card class="bg-negative">
      <q-card-section>
        <q-input label="API Key:" v-model="apikey" type="password" />
      </q-card-section>
      <q-card-section>
        <div class="text-h2">not authenticated >:(</div>
      </q-card-section>
      <q-card-actions stretch>
        <q-btn @click="testApiKey" label="test" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, ref } from "vue";
import { api } from "boot/axios";
import { debounce } from "quasar";

export default defineComponent({
  name: "ApiKeyInput",
  created() {
    if (this.$store.state.apikey.apikey.length === 0) {
      const localKey = localStorage.getItem("apikey");
      if (localKey) this.$store.commit("apikey/setApikey", localKey);
      else console.log("api key was empty on load");
    }
  },
  setup() {
    return {
      apikey: ref(""),
      showDialog: ref(false),
    };
  },
  watch: {
    apikey(val) {
      this.$store.commit("apikey/setApikey", val);
    },
  },
  mounted() {
    this.apikey = this.$store.state.apikey.apikey;
  },
  methods: {
    show() {
      this.showDialog = true;
    },
    hide() {
      this.showDialog = false;
    },
    testApiKey() {
      const url = `/auth/view?key=${this.$store.state.apikey.apikey}`;
      api
        .get(url)
        .then((data) => {
          this.showDialog = false;
        })
        .catch((data) => {
          console.log("api key test failed");
          this.showDialog = true;
          this.$refs.overlay.shake();
        });
    },
  },
});
</script>

<style scoped></style>
