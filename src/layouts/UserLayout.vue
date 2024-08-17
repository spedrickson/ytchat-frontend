<template>
  <q-layout class="main-layout" view="hHh Lpr lff" style="display: flex">
    <q-header>
      <q-toolbar class="toolbar" shrink>
        <q-btn dense flat round icon="mdi-menu" @click="toggleSearch" />
        <q-toolbar-title>
          <author-header v-bind="author" />
        </q-toolbar-title>
        <q-btn label="ban" icon="mdi-skull" dense flat
          ><q-tooltip>not implemented for obvious reasons</q-tooltip></q-btn
        >
        <q-tabs
          shrink
          inline-label
          v-model="tab"
          no-caps
          class="text-grey"
          active-color="accent"
          indicator-color="primary"
        >
          <q-route-tab
            name="messages"
            label="messages"
            icon="mdi-chat"
            :to="`/user/${$route.params.channelID}/messages`"
            exact
          >
            <q-badge
              class="count-badge"
              color="accent"
              text-color="dark"
              :label="`${author?.messageCount?.toLocaleString() ?? 0}`"
            />
          </q-route-tab>

          <q-route-tab
            name="comments"
            label="comments"
            icon="mdi-comment-text"
            :to="`/user/${$route.params.channelID}/comments`"
            exact
          >
            <q-badge
              color="accent"
              class="count-badge"
              text-color="dark"
              :label="`${author?.commentCount?.toLocaleString() ?? 0}`"
            />
          </q-route-tab>

          <q-route-tab
            name="modComments"
            label="mod comments"
            icon="mdi-shield-sword"
            :to="`/user/${$route.params.channelID}/modcomments`"
            exact
          >
            <q-badge
              class="count-badge"
              :label="`${author?.modcommentCount?.toLocaleString()}`"
              color="negative"
              v-if="author?.modcommentCount"
            />
          </q-route-tab>
        </q-tabs>
        <api-key-input ref="apiKeyInput" />
      </q-toolbar>
      <q-card
        class="bg-negative q-pa-none q-gutter-none"
        v-if="author?.isBanned"
      >
        <q-card-section>
          <q-icon name="mdi-skull" />
          User is (probably) banned!!
        </q-card-section>
      </q-card>
    </q-header>
    <router-view style="padding-top: 50px" />
    <q-drawer bordered v-model="drawerLeft" side="left" :width="500">
      <better-user-search style="max-height: 100%" ref="authorSearch" />
    </q-drawer>
  </q-layout>
</template>

<script>
import { ref } from "vue";
import { api } from "boot/axios";
import AuthorHeader from "components/AuthorHeader";
import MessageContext from "components/MessageContext";
import ApiKeyInput from "components/ApiKeyInput";
import { useMeta } from "quasar";
import BetterUserSearch from "components/BetterUserSearch";

export default {
  components: { ApiKeyInput, BetterUserSearch, AuthorHeader },
  watch: {
    "$route.params.channelID"() {
      this.drawerLeft = false;
      this.fetchAuthor();
    },
  },
  methods: {
    toggleSearch() {
      this.drawerLeft = !this.drawerLeft;
      this.$refs.authorSearch.focusInput();
    },
    fetchAuthor() {
      const url = `/channel/${this.$route.params.channelID}?key=${this.$store.state.apikey.apikey}`;
      api
        .get(url)
        .then((data) => {
          this.author = data.data;
          this.title = `${this.author.name} - ytchat user`;
        })
        .catch((reason) => {
          console.log(`error when trying to query author info: ${reason}`);
          if (reason?.response?.status === 401) this.$refs.apiKeyInput.show();
        });
    },
  },
  setup() {
    const title = ref("ytchat user"); // page title will always reflect value of this
    useMeta(() => {
      return { title: title.value };
    });
    return {
      title,
      tab: ref("messages"),
      name: ref("no user"),
      channelUrl: ref(""),
      imageUrl: ref(""),
      drawerLeft: ref(false),
      author: ref(null),
    };
  },
  mounted() {
    this.fetchAuthor();
  },
};
</script>

<style lang="scss">
.count-badge {
  margin-left: 8px;
}
</style>
