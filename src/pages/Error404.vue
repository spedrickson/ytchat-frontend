<template>
  <div
    class="fullscreen bg-blue text-white text-center q-pa-md flex flex-center"
  >
    <div>
      <div style="font-size: 30vh">404</div>

      <div class="text-h2" style="opacity: 0.4">Oops. Nothing here...</div>

      <q-btn
        class="q-mt-xl"
        color="white"
        text-color="blue"
        unelevated
        to="/"
        label="Go Home"
        no-caps
      />
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import {useRouter} from "vue-router";

export default defineComponent({
  name: "Error404",

  mounted() {
    if (this.$store.state.apikey.apikey.length === 0) {
      console.log("api key was empty on load")
      useRouter().push("/apikey")
    }
  }
});
</script>
