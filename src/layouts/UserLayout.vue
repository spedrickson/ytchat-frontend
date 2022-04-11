<template>
  <q-layout class="main-layout" view="hHh Lpr lff" style="display: flex">
    <api-key-dialog ref="apiKeyDialog"/>
    <q-header elevated>
      <q-toolbar>
        <q-btn dense flat round icon="search" @click="toggleSearch"/>
        <q-toolbar-title>
          <author-header v-bind="author" v-if="$route.params.channelID"/>
        </q-toolbar-title>
        <q-btn-dropdown icon="fas fa-lock" label="apikey">
          <api-key-input/>
        </q-btn-dropdown>
      </q-toolbar>
      <q-toolbar v-if="$route.params.channelID">
        <q-btn label="ban" icon="fas fa-skull" dense><q-tooltip>not implemented for obvious reasons</q-tooltip></q-btn>
        <q-tabs
          v-model="tab"
          dense
          class="text-grey"
          active-color="accent"
          indicator-color="accent">
          <q-route-tab name="messages" label="Messages" :to="`/user/${$route.params.channelID}/messages`" exact>
            <q-badge :label="`${author?.messageCount}`"/>
          </q-route-tab>
          <q-route-tab name="modComments" label="Mod Comments" :to="`/user/${$route.params.channelID}/modcomments`" exact>
            <q-badge :label="`${author?.modcommentCount}`" color="negative" v-if="author?.modcommentCount"/>
          </q-route-tab>
        </q-tabs>
        <q-card class="bg-negative q-pa-none q-gutter-none" v-if="author?.isBanned">
          <q-card-section>
            <q-icon name="fas fa-skull"/>
            User is (probably) banned!!
<!--            <q-btn size="sm" label="Unban"><q-tooltip>not implemented lol</q-tooltip></q-btn>-->
          </q-card-section>
        </q-card>
      </q-toolbar>
    </q-header>
    <router-view v-if="$route.params.channelID" :channelID="$route.params.channelID" style="padding-top: 100px"/>
    <q-drawer v-model="drawerLeft" side="left" :width="500" :persistent="false">
      <better-user-search style="max-height: 100%" ref="authorSearch"/>
    </q-drawer>
<!--    <q-page-container>-->
<!--      <q-page style="display: flex; margin: 0; padding: 0;">-->
<!--      </q-page>-->
<!--    </q-page-container>-->
  </q-layout>
</template>
<script>
import {ref} from 'vue'
import {api} from "boot/axios";
import AuthorHeader from "components/AuthorHeader";
import MessageContext from "components/MessageContext"
import ApiKeyInput from "components/ApiKeyInput";
import {useMeta} from "quasar";
import BetterUserSearch from "components/BetterUserSearch";
import ApiKeyDialog from "layouts/ApiKeyDialog";

export default {
  components: {ApiKeyInput, BetterUserSearch, AuthorHeader, ApiKeyDialog},
  methods: {
    toggleSearch() {
      this.drawerLeft = !this.drawerLeft
      this.$refs.authorSearch.focusInput()
    },
    authError() {
      console.log('received auth error emit')
      this.$refs.apiKeyDialog.show();
    },
  },
  setup() {
    // page title will always reflect value of this
    const title = ref('ytchat')
    useMeta(() => {
      return {
        title: title.value
      }
    })

    const channelUrl = ref("")
    const imageUrl = ref("")
    const author = ref(null)
    return {
      tab: ref('messages'),
      name: ref("no user"),
      channelUrl,
      imageUrl,
      title,
      drawerLeft: ref(false),
      author,
      fetchAuthor() {
        const url = `/channel/${this.channelID}?key=${this.$store.state.apikey.apikey}`
        // console.log(`querying url: ${url}`)
        api.get(url).then((data) => {
          this.author = data.data
          this.title = `${author.value.name} - ytchat`
        }).catch((reason) => {
          console.log(`error when trying to query author info: ${reason}`);
          if (reason.response.status === 401) {
            this.authError()
          }
        })
      },
    }
  },
  created() {
    // console.log("layout create")
    if (this.$store.state.apikey.apikey.length === 0) {
      const localKey = localStorage.getItem('apikey')
      if (localKey) {
        this.$store.commit('apikey/setApikey', localKey)
      } else {
        console.log("api key was empty on load")
      }
    }
  },
  updated() {
    // console.log("layout updated")
    if (this.$route.params.channelID !== this.channelID) {
      console.log("channelID changed, updating details")
      this.channelID = this.$route.params.channelID
      this.fetchAuthor()
    }
  },
  mounted() {
    // console.log("layout mounted")
    this.channelID = this.$route.params.channelID;
    // this.$refs.history.newFilters({filters: {'author.channelId': this.channelID}, sort: {timestamp: -1}})
    this.fetchAuthor()
  }
}
</script>

<style lang="sass">
.author-title
  padding: 0 10px
  font-size: larger

//.main-layout
//  color: #efeff1
//  background: #1d1d1d

</style>
