<template>
  <div class="container-fluid">
    <div class="text-center" v-if="messages.length === 0">
      <h2>No messages</h2>
    </div>
    <q-infinite-scroll class="q-pa-md" @load=fetchMessages ref="messageScroll" reverse>
      <template v-slot:loading>
        <q-spinner class="row justify-center q-my-md" color="primary" name="dots" size="40px"/>
      </template>
      <message class="q-py-sm" v-for="(message, index) in messages" :key="message._id"
               :message="messages[(messages.length - 1) - index]" show-datetime/>
    </q-infinite-scroll>

    <q-btn @click="fetchNewMessages" :loading="loadingNewMessages" icon="fas fa-sync" class="refresh-btn"/>
  </div>
</template>

<script>
import {defineComponent, ref} from "vue";
import Message from "components/Message";
import {api} from 'boot/axios.js'

export default defineComponent({
  name: "MessageHistory",
  components: {Message},

  data() {
    return {
      messages: [],
      channelID: ref(null),
      messageID: ref(null),
      loading: false,
      loadingNewMessages: false,
    };
  },
  mounted() {
    console.log("history mounted")
    this.channelID = this.channelID ?? this.$route.params.channelID;
  },
  created() {
    console.log("history created")
    this.channelID = this.channelID ?? this.$route.params.channelID;
  },
  updated() {
    console.log("history updated")
    if (this.$route.params.channelID !== this.channelID) {
      this.channelID = this.$route.params.channelID
      console.log("channelID changed!")
      this.messages.splice(0, this.messages.length) // empty array
      this.$refs.messageScroll.reset();
      this.$refs.messageScroll.resume();
    }
  },
  methods: {
    fetchMessages(index, done) {
      if (this.loading) {
        console.log("tried to double load")
        return
      }
      this.loading = true
      const suffix = this.messages.length ? `&from=${this.messages[this.messages.length - 1]['_id']}` : ""
      const url = `/messages/older?key=${this.apikey()}&channelID=${this.channelID}&${suffix}`
      // console.log(`fetching from URL: ${url}`)
      api.get(url).then((data) => {
        if (data.data.length > 0) {
          // console.log("received some data")
          this.messages.push(...data.data);
          done();
        } else {
          console.log("reached end of user chat history");
          this.$refs.messageScroll.stop()
        }
      }).catch((reason) => {
        console.log(`error when trying to query author info: ${reason}`);
        if (reason.response.status) {
          console.log('authentication error, please enter api key')
        }
      }).finally(() => {
        this.loading = false
      });
    },

    apikey() {
      return this.$store.state.apikey.apikey
    },

    fetchNewMessages() {
      if (!this.messages.length) {
        console.log("tried to get newer messages without any messages")
        return
      }
      this.loadingNewMessages = true;
      const suffix = this.messages.length ? `&from=${this.messages[0]['_id']}` : ''
      const url = `/messages/newer?key=${this.apikey()}&channelID=${this.channelID}${suffix}`
      api.get(url).then((data) => {
        if (data.data.length > 0) {
          this.messages.unshift(...data.data); // O(n), gross
        } else {
          console.log(`received no results from new message query: ${url}`);
        }
      }).catch((reason) => {
        console.log(`error when fetching new messages: ${reason.message}`)
      }).finally(() => {
        this.loadingNewMessages = false;
      })
    }
  },
});
</script>

<style scoped lang="sass">
.refresh-btn
  background: darkslategrey
  width: 100%
</style>
