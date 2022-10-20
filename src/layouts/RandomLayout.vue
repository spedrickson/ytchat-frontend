<template>
  <q-layout class="main-layout" view="hHh LpR fFf">
    <api-key-dialog ref="apiKeyDialog"/>
    <q-header elevated height-hint="98">
      <q-toolbar>
        <q-btn dense flat round icon="fas fa-theater-masks" @click="this.leftDrawerOpen = !this.leftDrawerOpen"/>
        <q-toolbar-title>ytchat sentiment</q-toolbar-title>
        <q-btn-dropdown icon="fas fa-lock" label="apikey">
          <api-key-input/>
        </q-btn-dropdown>
      </q-toolbar>
    </q-header>
    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered class="overflow-hidden">
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
          <q-input dense class="col-12 q-pa-xs" v-model="messageString" standout/>
        </div>

        <div>
          <q-btn @click="fetchMessages">
            New Random Question
          </q-btn>
        </div>
      </div>
    </q-drawer>

    <q-page-container >
      <message v-if="message" :message="message" ></message>
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
  setup() {return { leftDrawerOpen: ref(false)}},
  created() {
    if (this.$store.state.apikey.apikey.length === 0) {
      const localKey = localStorage.getItem('apikey')
      if (localKey) this.$store.commit('apikey/setApikey', localKey)
      else console.log("api key was empty on load")
    }
  },

  data() {
    return {
      drag: false,
      delaySeconds: 30,
      val: null,
      messageString: "",
      lastResponse: {},
      loaded: false,
      chartData: {},
      message: null,
    };
  },


  methods: {

    fetchMessages() {
      if (this.loading) return
      this.loading = true
      const url = `/messages?key=${this.apikey()}`
      const filters = {
        filters: {
          message: {$regex: `^${this.messageString}`},
          timestamp: {
            $gt: (new Date().getTime() - (this.delaySeconds * 1000))
          }
        },
        sort: {timestamp: -1}
      };

      api.post(url, filters).then((data) => {
        console.log(`received some data: ${data.data.length}`)
        if (data.data.length > 0) {
          this.message = data.data[Math.floor(Math.random() * data.data.length)]
          // this.messages = this.messages.concat(data.data.reverse());
          // this.trimMessages();
          // if (this.autoScroll) this.scrollToBottom()
        }
      }).catch(reason => {
        console.log(`error when trying to query filtered messages info: ${reason}`);
        if (reason?.response?.status === 401) this.$emit('auth-error')
      }).finally(() => this.loading = false);
    },

    apikey() {return this.$store.state.apikey.apikey},
  },

  mounted() {
    this.loaded = false
  },
})
</script>

<style lang="sass">
.expand-header
  background: $grey-9
</style>
