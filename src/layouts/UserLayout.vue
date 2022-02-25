<template>
  <q-layout class="main-layout" view="hHh Lpr lff">
    <q-header elevated height-hint="98">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer"/>
        <author-header v-bind="author"/>
      </q-toolbar>
      <q-tabs
        v-model="tab"
        dense
        class="text-grey"
        active-color="accent"
        indicator-color="accent">
        <q-tab name="messages" label="Messages">
          <q-badge :label="`~${author?.messageCount}`"/>
        </q-tab>
        <q-tab name="modComments" label="Mod Comments"/>
        <q-tab name="bans" label="Bans" />
      </q-tabs>
    </q-header>
    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" elevated>
      <user-search style="max-height: 100%"/>
      <api-key-input/>
    </q-drawer>
    <q-page-container>
      <router-view v-if="$route.params.channelID" :channelID="$route.params.channelID" class="row-sm"/>
<!--      <message-history v-if="$route.params.channelID" :channelID="$route.params.channelID" class="row-sm"/>-->
    </q-page-container>
  </q-layout>
</template>
<script>
import {ref} from 'vue'
import {api} from "boot/axios";
import AuthorHeader from "components/AuthorHeader";
import UserSearch from "components/UserSearch";
import MessageContext from "components/MessageContext"
import MessageHistory from "components/MessageHistory";
import {useRouter} from "vue-router";
import ApiKeyInput from "components/ApiKeyInput";

export default {
  components: {ApiKeyInput, UserSearch, AuthorHeader},
  setup() {
    const channelUrl = ref("")
    const imageUrl = ref("")
    const author = ref(null)
    return {
      tab: ref('messages'),
      name: ref("no user"),
      channelUrl,
      imageUrl,
      leftDrawerOpen: false,
      author,
      toggleLeftDrawer() {
        this.leftDrawerOpen = !this.leftDrawerOpen
      },
      fetchAuthor() {
        const url = `/channel/${this.channelID}?key=${this.$store.state.apikey.apikey}`
        // console.log(`querying url: ${url}`)
        api.get(url).then((data) => {
          this.author = data.data
        }).catch((reason) => {
          console.log(`error when trying to query author info: ${reason}`);
          if (reason.response.status) {
            console.log('authentication error, please enter api key')
          }
        })
      }
    }
  },
  created() {
    console.log("layout create")
    if (this.$store.state.apikey.apikey.length === 0) {
      const localKey = localStorage.getItem('apikey')
      if (localKey) {
        this.$store.commit('apikey/setApikey', localKey)
      } else {
        console.log("api key was empty on load")
        useRouter().push("/apikey")
      }
    }
  },
  updated() {
    console.log("layout updated")
    if (this.$route.params.channelID !== this.channelID) {
      console.log("channelID changed!")
      this.channelID = this.$route.params.channelID
      this.fetchAuthor()
      // this.messages.splice(0, this.messages.length) // empty array
      // this.$refs.messageScroll.reset();
      // this.$refs.messageScroll.resume();
    }
  },
  mounted() {
    console.log("layout mounted")
    this.channelID = this.$route.params.channelID;
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
