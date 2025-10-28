<template>
  <q-page class="flex flex-center">
    <vue-apex-charts
      class="col-grow"
      height="60%"
      :options="chartOptions"
      :series="series"
    ></vue-apex-charts>
  </q-page>
</template>

<script>
// import VueApexCharts from "vue3-apexcharts";

export default {
  name: "FrequencyPage",
};
</script>

<script setup>
import { ref } from "vue";

console.log("setup freq page");

var lastTimestamp = new Date();

const step = ref(5000);
const stepCount = ref(5000);

const chartOptions = ref({
  chart: {
    id: "vuechart-example",
  },
  // xaxis: {
  // categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998],
  // },
  yaxis: {
    min: 0,
    max: 100, // youtube chat almost never goes over 100 messages a second, seems to be a hardcoded limit
  },
  tooltip: {
    theme: "dark",
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    width: 2,
    curve: "smooth",
    lineCap: "round",
  },
  colors: [
    function ({ value, seriesIndex, w }) {
      console.log("color func", value);
      if (value < 50) {
        return "#FF0000";
      } else {
        return "#02DFDE";
      }
    },
  ],
  grid: {
    show: false, // you can either change hear to disable all grids
  },
});

const series = ref([
  {
    name: "series-1",
    type: "bar",
    data: [30, 40, 35, 90, 30, 35, 30, 30],
  },
]);

function getFrequency() {
  const upper = 1723946704595;
  // const upper = Date.now()
  const url = `/frequency?key=${this.apikey()}&upper=${upper}`;
  console.log("querying frequency", url);
  api
    .get(url)
    .then((data) => {
      if (!data.data) {
        return;
      }
      // console.log(data.data);
      // this.lastResponse = data.data;
      this.setChartData(data.data);
    })
    .catch((reason) => {
      clearInterval(this.timer);
      this.timer = false;
      console.log(`error when fetching frequency: ${reason.message}`);
      if (reason?.response?.status === 401) this.$refs.apiKeyInput.show();
    });
}
getFrequency();
const timer = setInterval(() => {
  this.getFrequency();
}, this.pollFrequency);
</script>
