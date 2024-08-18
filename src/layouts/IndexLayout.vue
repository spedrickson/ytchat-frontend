<template>
  <q-layout class="main-layout" view="hHh lpR fFf" style="display: flex">
    <q-header height-hint="98">
      <q-toolbar class="toolbar">
        <q-btn
          dense
          flat
          round
          icon="mdi-menu"
          @click="drawerLeft = !drawerLeft"
        />
        <q-toolbar-title
          >ytchat-index <q-icon name="mdi-comment-search"
        /></q-toolbar-title>
        <api-key-input ref="apiKeyInput" />
      </q-toolbar>
    </q-header>
    <q-drawer
      :width="400"
      :breakpoint="600"
      show-if-above
      v-model="drawerLeft"
      side="left"
      :persistent="false"
    >
      <better-user-search style="max-height: 100%" ref="authorSearch" />
    </q-drawer>
    <q-page-container style="flex-grow: 1; display: flex">
      <q-list class="index-list row">
        <q-btn
          padding="sm"
          push
          color="info"
          to="/filtered"
          class="index-btn col-12"
          icon="mdi-filter"
          >Filtered Chat</q-btn
        >
        <q-btn
          push
          color="info"
          to="/sentiment"
          class="index-btn col-12"
          icon="mdi-vote"
        >
          Chat Sentiment<br />
          <q-btn-group class="col-12 self-end" push style="text-align: center">
            <q-btn
              color="light-blue-8"
              push
              to="/sentiment?m=yes&m=no"
              class="index-btn"
              >Yes/No</q-btn
            >
            <q-separator vertical />
            <q-btn
              color="light-blue-8"
              class="sub-btn"
              padding="md"
              push
              label="0-"
              disable
              style="flex-shrink: 1; flex-grow: 0"
            />
            <template v-for="index in 9" :key="index">
              <q-btn
                color="light-blue-8"
                class="sub-btn"
                padding="md"
                push
                :label="index + 1"
                :to="sentimentCount(index + 1)"
              />
            </template>
          </q-btn-group>
        </q-btn>
        <q-btn
          push
          color="info"
          to="/randommessage?test=true"
          class="index-btn col-12"
          icon="mdi-dice-multiple"
          >Random Message</q-btn
        >
        <q-btn
          push
          color="info"
          to="/frequency"
          class="index-btn col-12"
          icon="mdi-sine-wave"
          >Chat Frequency</q-btn
        >
      </q-list>
    </q-page-container>
  </q-layout>
</template>

<script>
import ApiKeyInput from "components/ApiKeyInput.vue";
import BetterUserSearch from "components/BetterUserSearch.vue";
import { defineComponent, ref } from "vue";
const test = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export default defineComponent({
  name: "IndexLayout",
  components: { ApiKeyInput, BetterUserSearch },
  setup() {
    return {
      drawerLeft: ref(true),
    };
  },
  methods: {
    sentimentCount(number) {
      return `/sentiment?m=${test.slice(0, number + 1).join("&m=")}`;
    },
  },
});
</script>
<style scoped lang="sass">
.index-list
  display: flex
  flex-grow: 1

.index-btn
  justify-content: center
  align-content: center
  max-height: 150px

.sub-btn
  flex-grow: 1
</style>
