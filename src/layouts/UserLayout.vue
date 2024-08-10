<template>
  <q-layout class="main-layout" view="hHh Lpr lff" style="display: flex">
    <q-header elevated>
      <q-toolbar>
        <q-btn dense flat round icon="search" @click="toggleSearch" />
        <q-toolbar-title>
          <author-header v-bind="author" />
        </q-toolbar-title>
        <api-key-input ref="apiKeyInput" />
      </q-toolbar>
      <q-toolbar>
        <q-btn label="ban" icon="fas fa-skull" dense
          ><q-tooltip>not implemented for obvious reasons</q-tooltip></q-btn
        >
        <q-tabs
          v-model="tab"
          dense
          class="text-grey"
          active-color="accent"
          indicator-color="accent"
        >
          <q-route-tab
            name="messages"
            label="Messages"
            :to="`/user/${$route.params.channelID}/messages`"
            exact
          >
            <q-badge :label="`${author?.messageCount}`" />
          </q-route-tab>
          <q-route-tab
            name="modComments"
            label="Mod Comments"
            :to="`/user/${$route.params.channelID}/modcomments`"
            exact
          >
            <q-badge
              :label="`${author?.modcommentCount}`"
              color="negative"
              v-if="author?.modcommentCount"
            />
          </q-route-tab>
        </q-tabs>
        <q-card
          class="bg-negative q-pa-none q-gutter-none"
          v-if="author?.isBanned"
        >
          <q-card-section>
            <q-icon name="fas fa-skull" />
            User is (probably) banned!!
          </q-card-section>
        </q-card>
      </q-toolbar>
    </q-header>
    <router-view style="padding-top: 100px" />
    <q-drawer bordered elevated v-model="drawerLeft" side="left" :width="500">
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
