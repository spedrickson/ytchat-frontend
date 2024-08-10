<template>
  <span v-for="(item, index) in messageEx" :key="index">
    <q-icon
      class="msg-img"
      :name="`img:${item.url}`"
      :alt="item.txt"
      size="1.4rem"
      v-if="item.hasOwnProperty('url')"
    >
      <q-tooltip>{{ item.txt }}</q-tooltip>
    </q-icon>
    <span v-else class="wrap">{{ item }}&nbsp;</span>
  </span>
</template>

<script>
import { defineComponent } from "vue";
// TODO: re-enable emoji
export default defineComponent({
  name: "MessageContent",
  props: ["messageEx"],
});
</script>

<style scoped lang="sass">
//.msg-img
  //padding: 0
</style>
