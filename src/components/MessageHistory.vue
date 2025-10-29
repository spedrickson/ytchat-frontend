<template><filtered-history ref="history" /></template>

<script>
import { defineComponent } from "vue";
import FilteredHistory from "pages/FilteredHistory";

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
