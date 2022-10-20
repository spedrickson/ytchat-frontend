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
          <q-input dense @change="runAndResetPolling" debounce="500" standout class="col-4 q-pa-xs" v-model.number="delaySeconds" type="number"/>
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
            @change="runAndResetPolling"
          />
        </div>

        <div class="row">
          <q-input dense class="col-12 q-pa-xs" @keydown.enter.prevent="addVal(true)" v-model="val" standout @submit="addVal(true)">
            <slot name="after">
              <q-btn class="justify-end" @click="addVal(true)" icon="add_circle"/>
            </slot>
          </q-input>
        </div>

        <draggable v-model="messageStrings" item-key="id" @change="setChartLabels">
          <template v-slot:item="{element}">
            <q-item>
              {{element}}
              <q-btn @click="removeVal(element)" icon="remove_circle"/>
            </q-item>
          </template>
        </draggable>
      </div>
    </q-drawer>

    <q-page-container >
      <q-banner v-if="!timer" dense>
        <template v-slot:avatar>
          <q-icon name="signal_wifi_off" color="primary" />
        </template>
        Error: disconnected from API
        <template v-slot:action>
          <q-btn flat color="primary" label="Reconnect" @click="runAndResetPolling" />
        </template>
      </q-banner>
      <div class="chart-container col-12">
        <bar-chart ref="barChart"/>
      </div>
    </q-page-container>
  </q-layout>
</template>

<script>
import {defineComponent, ref} from 'vue'
import ApiKeyInput from "components/ApiKeyInput";
import ApiKeyDialog from "layouts/ApiKeyDialog";
import BarChart from "../components/BarChart"
import draggable from 'vuedraggable'

import {api} from "boot/axios";

export default defineComponent({
  name: "SentimentLayout",
  components: { ApiKeyDialog,
    ApiKeyInput,
    BarChart,
    draggable
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
      timer: null,
      val: null,
      messageStrings: [],
      lastResponse: {},
      loaded: false,
      chartData: {}
    };
  },

  watch: {
    delaySeconds() {
      this.setUrlFromFilters()
    },
  },

  methods: {
    addVal: function(repoll) {
      if (this.val) {
        console.log('adding val')
        this.messageStrings.push(this.val);
        this.val = null
        this.setUrlFromFilters()
        this.$refs.barChart.chartData.labels = this.messageStrings
        if (repoll) {
          this.runAndResetPolling()
        }
      }
    },

    removeVal: function(valToRemove) {
      console.log('removing val')
      const index = this.messageStrings.indexOf(valToRemove);
      if (index > -1) { // only splice array when item is found
        this.messageStrings.splice(index, 1); // 2nd parameter means remove one item only
      }
      this.setChartLabels()
      this.setUrlFromFilters()
      this.runAndResetPolling()
    },

    getSentiment() {
      if (this.messageStrings.length < 2) {return;}
      // console.log('querying sentiment')
      const queryParam = Array.from(this.messageStrings).join('&m=')
      let startTime = new Date().getTime() - (this.delaySeconds * 1000);

      const newer_url = `/messagecount?key=${this.apikey()}&m=${queryParam}&start=${startTime}&end=${Date.now()}`
      api.get(newer_url).then((data) => {
        if (!data.data) {
          return
        }
        this.lastResponse = data.data
        this.setChartData()
      }).catch((reason) => {
        clearInterval(this.timer)
        this.timer = false
        console.log(`error when fetching: ${reason.message}`)
      })
    },

    setChartLabels() {
      // console.log('setting chart labels')
      this.$refs.barChart.chartData.labels = this.messageStrings
      this.setChartData()
    },

    setChartData() {
      // console.log('setting chart data')
      const sortedValues = []
      for (const item of this.messageStrings) {
        sortedValues.push(this.lastResponse[item])
      }
      this.$refs.barChart.chartData.datasets[0].data = sortedValues
    },

    runAndResetPolling() {
      // console.log('running and resetting polling')
      clearInterval(this.timer)
      this.getSentiment();
      this.timer = setInterval(() => {
        this.getSentiment();
      }, 3000)
    },

    setFiltersFromUrl() {
      const query = this.$route.query
      if (query.m) {
        try {
          this.messageStrings = Array.from(query.m)
          this.setChartLabels()
        } catch (e) {
          clearInterval(this.timer)
          console.log(e)
        }
      }
      if (query.s) {
        this.delaySeconds = parseInt(query.s)
      }
    },

    setUrlFromFilters() {
      // console.log('setting url from filters')
      this.$router.replace({ 'query': {m: this.messageStrings, s: this.delaySeconds}})
    },

    apikey() {return this.$store.state.apikey.apikey},
  },

  mounted() {
    this.loaded = false
    this.setFiltersFromUrl()
    this.runAndResetPolling()
  },
  beforeUnmount() {
    clearInterval(this.timer)
  }
})
</script>

<style lang="sass">
.expand-header
  background: $grey-9
</style>