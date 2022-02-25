<template>
  <q-layout class="main-layout" view="lHr lpR fFf">

    <!--    <q-header bordered class="bg-primary text-white" height-hint="98">-->
    <!--      <q-toolbar>-->
    <!--        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer"/>-->

    <!--        <q-toolbar-title>-->
    <!--          <q-avatar>-->
    <!--            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg" alt="avatar">-->
    <!--          </q-avatar>-->
    <!--          YTChat Mod Tools-->
    <!--        </q-toolbar-title>-->
    <!--      </q-toolbar>-->

    <!--      <q-tabs align="left">-->
    <!--        <q-route-tab to="/user" label="User"/>-->
    <!--        <q-route-tab to="/page2" label="Page Two"/>-->
    <!--        <q-route-tab to="/page3" label="Page Three"/>-->
    <!--      </q-tabs>-->
    <!--    </q-header>-->

    <q-drawer v-model="leftDrawerOpen" side="left" bordered>

      <!-- drawer content -->
    </q-drawer>

    <q-page-container>
      <router-view/>
    </q-page-container>

  </q-layout>
</template>

<script>
import {defineComponent, ref} from "vue";

export default defineComponent({
  name: "MainLayout",

  components: {},

  created() {
    console.log("creating mains layout")
  },

  setup() {
    const leftDrawerOpen = ref(false)

    return {
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value
      },
    }
  },
});
</script>
<style lang="sass">

</style>
