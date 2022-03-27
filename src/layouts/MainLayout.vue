<!--<template>-->
<!--  <q-layout class="main-layout" view="lHr lpR fFf">-->

<!--    &lt;!&ndash;    <q-header bordered class="bg-primary text-white" height-hint="98">&ndash;&gt;-->
<!--    &lt;!&ndash;      <q-toolbar>&ndash;&gt;-->
<!--    &lt;!&ndash;        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer"/>&ndash;&gt;-->

<!--    &lt;!&ndash;        <q-toolbar-title>&ndash;&gt;-->
<!--    &lt;!&ndash;          <q-avatar>&ndash;&gt;-->
<!--    &lt;!&ndash;            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg" alt="avatar">&ndash;&gt;-->
<!--    &lt;!&ndash;          </q-avatar>&ndash;&gt;-->
<!--    &lt;!&ndash;          YTChat Mod Tools&ndash;&gt;-->
<!--    &lt;!&ndash;        </q-toolbar-title>&ndash;&gt;-->
<!--    &lt;!&ndash;      </q-toolbar>&ndash;&gt;-->

<!--    &lt;!&ndash;      <q-tabs align="left">&ndash;&gt;-->
<!--    &lt;!&ndash;        <q-route-tab to="/user" label="User"/>&ndash;&gt;-->
<!--    &lt;!&ndash;        <q-route-tab to="/page2" label="Page Two"/>&ndash;&gt;-->
<!--    &lt;!&ndash;        <q-route-tab to="/page3" label="Page Three"/>&ndash;&gt;-->
<!--    &lt;!&ndash;      </q-tabs>&ndash;&gt;-->
<!--    &lt;!&ndash;    </q-header>&ndash;&gt;-->

<!--    <q-drawer v-model="leftDrawerOpen" side="left" bordered>-->

<!--      &lt;!&ndash; drawer content &ndash;&gt;-->
<!--    </q-drawer>-->

<!--    <q-page-container>-->
<!--      <router-view/>-->
<!--    </q-page-container>-->

<!--  </q-layout>-->
<!--</template>-->

<!--<script>-->
<!--import {defineComponent, ref} from "vue";-->

<!--export default defineComponent({-->
<!--  name: "MainLayout",-->

<!--  components: {},-->

<!--  created() {-->
<!--    console.log("creating mains layout")-->
<!--  },-->

<!--  setup() {-->
<!--    const leftDrawerOpen = ref(false)-->

<!--    return {-->
<!--      leftDrawerOpen,-->
<!--      toggleLeftDrawer() {-->
<!--        leftDrawerOpen.value = !leftDrawerOpen.value-->
<!--      },-->
<!--    }-->
<!--  },-->
<!--});-->
<!--</script>-->
<!--<style lang="sass">-->

<!--</style>-->
