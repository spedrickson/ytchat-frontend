<template>
  <router-view class="main-layout"/>
</template>
<script>
import {defineComponent} from "vue";
import {useQuasar} from "quasar";


export default defineComponent({
  name: "App",
  setup() {
    const $q = useQuasar()
    $q.dark.set(true)
  }

});
</script>
