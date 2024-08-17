<template>
  <q-layout class="main-layout" view="hHh LpR fFf">
    <q-header elevated height-hint="98">
      <q-toolbar class="toolbar">
        <q-btn
          dense
          flat
          round
          icon="mdi-menu"
          @click="drawerOpen = !drawerOpen"
        />
        <q-toolbar-title
          >random message <q-icon name="mdi-dice-multiple"
        /></q-toolbar-title>
        <api-key-input ref="apiKeyInput" />
      </q-toolbar>
    </q-header>
    <q-drawer
      v-model="drawerOpen"
      persistent
      ref="drawer"
      side="left"
      bordered
      class="overflow-hidden"
    >
      <div class="q-pa-md">
        <div class="row">
          <q-input
            dense
            debounce="500"
            standout
            class="col-4 q-pa-xs"
            v-model.number="delaySeconds"
            type="number"
          />
          <q-slider
            class="col-8 q-pa-xs"
            switch-label-side
            v-model="delaySeconds"
            :min="0"
            :max="600"
            :step="10"
            label
            :label-value="'Last ' + delaySeconds + ' seconds'"
            color="purple"
          />
        </div>

        <div class="row">
          <q-input
            dense
            class="col-12 q-pa-xs"
            v-model="searchTerm"
            standout
            label="messages starting with..."
            label-color="grey-7"
          />
        </div>

        <div>
          <q-btn @click="fetchMessages" :loading="loading">
            New Random Message
          </q-btn>
        </div>
      </div>
    </q-drawer>

    <q-page-container>
      <message v-if="messageObj" :message="messageObj" />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from "vue";
import ApiKeyInput from "components/ApiKeyInput";

import { api } from "boot/axios";
import Message from "components/Message";

export default defineComponent({
  name: "RandomLayout",
  components: {
    Message,
    ApiKeyInput,
  },
  setup() {
    return {
      leftDrawerOpen: ref(false),
    };
  },

  data() {
    return {
      drag: false,
      delaySeconds: 30,
      val: null,
      lastResponse: {},
      chartData: {},
      messageObj: null,
      searchTerm: "",
      drawerOpen: true,
      loading: false,
    };
  },

  methods: {
    setFiltersFromUrl() {
      if (this.$route.query.message) {
        this.searchTerm = this.$route.query.message;
      }
    },
    fetchMessages() {
      if (this.loading) return;
      this.loading = true;
      const url = `/randommessage?key=${this.apikey()}`;

      const body = {
        filter: `^${this.searchTerm}`,
        timestamp: new Date().getTime() - this.delaySeconds * 1000,
      };

      api
        .post(url, body)
        .then((data) => {
          if (data.data.length > 0) {
            this.messageObj = data.data[0];
          }
        })
        .catch((reason) => {
          console.log(`error when trying to query random messages: ${reason}`);
          if (reason?.response?.status === 401) this.$refs.apiKeyInput.show();
        })
        .finally(() => (this.loading = false));
    },

    apikey() {
      return this.$store.state.apikey.apikey;
    },
  },

  mounted() {
    this.setFiltersFromUrl();
    this.$refs.drawer.show();
  },
});
</script>

<style lang="sass">
.expand-header
  background: $grey-9
</style>
