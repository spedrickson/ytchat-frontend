<template>
  <Bar
    :chart-options="chartOptions"
    :chart-data="chartData"
    :chart-id="chartId"
    :responsive="true"
    :dataset-id-key="datasetIdKey"
  />
  <!--    :plugins="plugins"-->
  <!--    :css-classes="cssClasses"-->
  <!--    :styles="styles"-->
  <!--    :width="width"-->
  <!--    :height="height"-->
</template>

<script>
import { Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
);

export default {
  name: "BarChart",
  components: { Bar },
  props: {
    chartId: {
      type: String,
      default: "bar-chart",
    },
    datasetIdKey: {
      type: String,
      default: "label",
    },
    // width: {
    //   type: Number,
    //   default: 1000
    // },
    // height: {
    //   type: Number,
    //   default: 1000
    // },
    // cssClasses: {
    //   default: '',
    //   type: String
    // },
    // styles: {
    //   type: Object,
    //   default: () => {}
    // },
    // plugins: {
    //   type: Object,
    //   default: () => {}
    // }
  },
  data() {
    return {
      chartData: {
        labels: [],
        datasets: [{ data: [], backgroundColor: "#992323" }],
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        responsiveAnimationDuration: 0,
        plugins: {
          legend: {
            display: false,
          },
          tooltips: {
            enabled: false,
          },
        },
      },
    };
  },
};
</script>
