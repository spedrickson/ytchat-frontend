<template>
  <q-layout class="main-layout" view="hHh LpR fFf">
    <q-header height-hint="98">
      <q-toolbar class="toolbar">
        <q-btn
          dense
          flat
          round
          icon="mdi-menu"
          @click="this.leftDrawerOpen = !this.leftDrawerOpen"
        />
        <q-toolbar-title
          >ytchat frequency <q-icon name="mdi-sine-wave"
        /></q-toolbar-title>
        <api-key-input ref="apiKeyInput" />
      </q-toolbar>
    </q-header>
    <q-banner class="bg-red" v-if="!timer" dense>
      <template v-slot:avatar>
        <q-icon name="signal_wifi_off" color="primary" />
      </template>
      Error: disconnected from API
      <template v-slot:action>
        <q-btn
          flat
          color="primary"
          label="Reconnect"
          @click="runAndResetPolling"
        />
      </template>
    </q-banner>

    <q-page-container>
      <router-view></router-view>
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from "vue";
import ApiKeyInput from "components/ApiKeyInput";

import { api } from "boot/axios";

export default defineComponent({
  name: "SentimentLayout",
  components: {
    ApiKeyInput,
  },
  setup() {
    return { leftDrawerOpen: ref(false) };
  },

  data() {
    return {
      drag: false,
      timer: null,
      val: null,
      messageStrings: [],
      loaded: false,
      chartData: {},
      pollFrequency: 1000,
    };
  },

  methods: {
    // setChartLabels() {
    // console.log('setting chart labels')
    // this.$refs.barChart.chartData.labels = this.messageStrings;
    // this.setChartData();
    // },

    setChartData(data) {
      // const totalVotes = Object.values(this.lastResponse).reduce(
      // (partialSum, a) => partialSum + parseInt(a),
      // 0,
      // );
      // console.log('setting chart data')
      // console.log(`total votes: ${totalVotes}`)
      // const sortedValues = [];
      // const sortedLabels = [];
      // for (const item of this.messageStrings) {
      // const votes = parseFloat(this.lastResponse[item.toLowerCase()]);
      // const percent = (votes / totalVotes) * 100;
      // sortedValues.push(this.lastResponse[item.toLowerCase()]);
      // sortedLabels.push(`${item} - ${votes} - ${percent.toFixed(1)}%`);
      // }
      // const now = Math.floor(new Date().getTime() / 1000);
      // this.$refs.barChart.chartData.labels = data.map(
      // (x) => `-${now - x._id}s`,
      // );
      // this.$refs.barChart.chartData.datasets[0].data.push(
      // data[data.length - 1].count,
      // );
      // this.$refs.barChart.chartData.datasets[0].data.shift();
    },

    apikey() {
      return this.$store.state.apikey.apikey;
    },
  },

  mounted() {
    this.loaded = false;
    this.runAndResetPolling();
  },
  beforeUnmount() {
    clearInterval(this.timer);
  },
});
</script>

<style lang="sass"></style>
