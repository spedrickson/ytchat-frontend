<template>
  <q-layout class="main-layout" view="hHh LpR fFf">
    <api-key-dialog ref="apiKeyDialog"/>
    <q-header elevated height-hint="98">
      <q-toolbar>
        <q-btn dense flat round icon="fas fa-dice" @click="drawerOpen = !drawerOpen"/>
        <q-toolbar-title>random message</q-toolbar-title>
        <api-key-input/>
      </q-toolbar>
    </q-header>
    <q-drawer v-model="drawerOpen" persistent ref="drawer" side="left" bordered class="overflow-hidden">
      <div class="q-pa-md">
        <div class="row">
          <q-input dense debounce="500" standout class="col-4 q-pa-xs" v-model.number="delaySeconds" type="number"/>
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
          <q-input dense class="col-12 q-pa-xs" v-model="searchTerm" standout label="messages starting with..." label-color="grey-7"/>
        </div>

        <div>
          <q-btn @click="fetchMessages" :loading="loading">
            New Random Message
          </q-btn>
        </div>
      </div>
    </q-drawer>

    <q-page-container >
      <message v-if="messageObj" :message="messageObj"/>
    </q-page-container>
  </q-layout>
</template>

<script>
import {defineComponent, ref} from 'vue'
import ApiKeyInput from "components/ApiKeyInput";
import ApiKeyDialog from "layouts/ApiKeyDialog";

import {api} from "boot/axios";
import Message from "components/Message";

export default defineComponent({
  name: "RandomLayout",
  components: {
    Message, ApiKeyDialog,
    ApiKeyInput
  },
  setup() {return {
    leftDrawerOpen: ref(false)}
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
        this.searchTerm = this.$route.query.message
      }
    },
    fetchMessages() {
      if (this.loading) return
      this.loading = true
      const url = `/randommessage?key=${this.apikey()}`

      const body = {
        filter: `^${this.searchTerm}`,
        timestamp: new Date().getTime() - (this.delaySeconds * 1000)
      }

      api.post(url, body).then((data) => {
        // console.log(`received some data: ${data.data.length}`)
        if (data.data.length > 0) {
          this.messageObj = data.data[0]
        }
      }).catch(reason => {
        console.log(`error when trying to query filtered messages info: ${reason}`);
        if (reason?.response?.status === 401) this.$emit('auth-error')
      }).finally(() => this.loading = false);
    },

    apikey() {return this.$store.state.apikey.apikey},
  },

  mounted() {
    this.setFiltersFromUrl()
    this.$refs.drawer.show()
  },
})
</script>

<style lang="sass">
.expand-header
  background: $grey-9
</style>
