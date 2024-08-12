<!-- <template>
<q-page>
  <filtered-history ref="history" />
</q-page>
</template>

<script>
import FilteredHistory from "src/components/FilteredHistory.vue";

export default {
components: {
  FilteredHistory,
},
methods: {
  updateFilter() {
    this.$refs.history.newFilters({
      filters: { "author.channelId": this.$route.params.channelID },
      sort: { timestamp: -1 },
    });
  },
},
mounted() {
  console.log("mounted user messages");

  this.updateFilter();
},
watch: {
  "route.params.channelID"(newValue) {
    this.updateFilter();
  },
},
};
</script> -->
