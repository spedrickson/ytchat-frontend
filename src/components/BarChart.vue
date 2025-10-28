<template>
  <Bar
    :chart-options="chartOptions"
    :chart-data="chartData"
    :chart-id="chartId"
    :responsive="true"
    :dataset-id-key="datasetIdKey"
  />
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
    chartId: { type: String, default: "bar-chart" },
    datasetIdKey: { type: String, default: "label" },
  },
  data() {
    return {
      chartData: {
        labels: [],
        datasets: [
          {
            data: [],
            backgroundColor: [
              "rgba(255, 127, 128, 1)",
              "rgba(255, 192, 127, 1)",
              "rgba(255, 223, 128, 1)",
              "rgba(255, 255, 127, 1)",
              "rgba(191, 255, 127, 1)",
              "rgba(127, 255, 127, 1)",
              "rgba(128, 255, 255, 1)",
            ],
          },
        ],
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        responsiveAnimationDuration: 0,
        plugins: { legend: { display: false }, tooltips: { enabled: false } },
      },
    };
  },
};
</script>
