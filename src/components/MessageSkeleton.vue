<template>
  <q-tr no-hover style="width: 100%">
    <q-td no-hover>
      <q-skeleton type="rect"/>
    </q-td>
    <q-td >
      <q-skeleton type="QBadge"/>
    </q-td>
    <q-td>
      <q-skeleton type="rect"/>
    </q-td>
  </q-tr>
</template>

<script>
import {defineComponent} from "vue";

export default defineComponent({
  name: "MessageSkeleton"
})
</script>

<style scoped>

</style>
