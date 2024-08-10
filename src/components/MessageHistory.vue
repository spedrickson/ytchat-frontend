<template><filtered-history ref="history" class="column col-grow" /></template>

<script>
import { defineComponent } from "vue";
import FilteredHistory from "components/FilteredHistory";

export default defineComponent({
  name: "MessageHistory",
  components: { FilteredHistory },
  watch: {
    "$route.params.channelID"(newVal, oldVal) {
      if (oldVal)
        this.$refs.history.newFilters({
          filters: { "author.channelId": newVal },
          sort: { timestamp: -1 },
        });
    },
  },
  mounted() {
    this.$refs.history.newFilters({
      filters: { "author.channelId": this.$route.params.channelID },
      sort: { timestamp: -1 },
    });
  },
});
</script>
