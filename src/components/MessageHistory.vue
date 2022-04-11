<template>
  <filtered-history ref="history" class="column col-grow"  @auth-error="$emit('auth-error')"/>
<!--  <div class="container-fluid">-->
<!--    <div class="text-center" v-if="messages.length === 0">-->
<!--      <h2>No messages</h2>-->
<!--    </div>-->
<!--    <div class="full-width">-->
<!--      <message-skeleton v-if="loadOnScroll" v-intersection="autoLoadTop"/>-->
<!--    </div>-->
<!--    <q-virtual-scroll @scroll="onScroll" v-if="messages.length" :items="messages" ref="scrollRef" dense @virtual-scroll="virtualScroll">-->
<!--      <template v-slot="row"><message :message="row.item" show-datetime/></template>-->
<!--    </q-virtual-scroll>-->
<!--&lt;!&ndash;    <q-infinite-scroll debounce="1000" class="q-pa-md" @load=fetchMessages ref="messageScroll" reverse scroll-target="">&ndash;&gt;-->
<!--&lt;!&ndash;      <template v-slot:loading>&ndash;&gt;-->
<!--&lt;!&ndash;        <q-spinner class="row justify-center q-my-md" color="primary" name="dots" size="40px"/>&ndash;&gt;-->
<!--&lt;!&ndash;      </template>&ndash;&gt;-->
<!--&lt;!&ndash;      <message class="q-py-sm" v-for="(message, index) in messages" :key="message._id"&ndash;&gt;-->
<!--&lt;!&ndash;               :message="messages[(messages.length - 1) - index]" show-datetime/>&ndash;&gt;-->
<!--&lt;!&ndash;    </q-infinite-scroll>&ndash;&gt;-->
<!--    <q-btn @click="fetchNewMessages" :loading="loadingNewMessages" icon="fas fa-sync" class="refresh-btn"><q-tooltip>-->
<!--      this button is broken right now, it works but adds stuff in reverse and keeps adding the same messages will fix later sorry-->
<!--      just use f5 for now-->
<!--    </q-tooltip></q-btn>-->
<!--  </div>-->
</template>

<script>
import {defineComponent, nextTick, ref} from "vue";
import Message from "components/Message";
import {api} from 'boot/axios.js'
import MessageSkeleton from "components/MessageSkeleton";
import FilteredHistory from "components/FilteredHistory";

export default defineComponent({
  name: "MessageHistory",
  components: {FilteredHistory},
  setup() {
    return {
      scrollRef: ref(null),
    }
  },
  watch: {
    channelID(newVal, oldVal) {
      if (oldVal) {

        console.log(`channel id changed: ${oldVal} -> ${newVal}`)
        this.$refs.history.newFilters({filters: {'author.channelId': newVal}, sort: {timestamp: -1}})
      }
    }
  },
  data() {
    return {
      messages: [],

      channelID: ref(null),
      messageID: ref(null),
      loadOnScroll: ref(false),
      loading: false,
      loadingNewMessages: false,
    };
  },
  mounted() {
    console.log("history mounted")
    this.channelID = this.channelID ?? this.$route.params.channelID;
    this.scrollRef = this.$refs.scrollRef
    this.$refs.history.newFilters({filters: {'author.channelId': this.channelID}, sort: {timestamp: -1}})

    // this.fetchMessages();
  },
  created() {
    // console.log("history created")
    this.channelID = this.channelID ?? this.$route.params.channelID;
  },
  updated() {
    // console.log("history updated")
    if (this.$route.params.channelID !== this.channelID) {
      this.channelID = this.$route.params.channelID
      console.log("channelID changed, reloading message history")
      // this.messages.splice(0, this.messages.length) // empty array
      // this.fetchMessages()
      // this.$refs.messageScroll?.reset();
      // this.$refs.messageScroll?.resume();
    }
  },
  methods: {
    onScroll(event) {
      console.log(event)
    },
    virtualScroll(data) {
      console.log(data)
    },
    autoLoadTop(entry) {
      if (this.loadOnScroll && entry.isIntersecting) {
        console.log("was intersecting, fetching more messages")
        this.fetchOldMessages()
      }
    },
    scrollToBottom(count) {
      if (count > 10) return;
      console.log(`scroll attempt ${count}`);
      nextTick(() => {
        this.scrollRef.scrollTo(0);
        this.loadOnScroll = true;
        setTimeout(() => {
          this.scrollToBottom(count + 1)
        }, 1000)
      })

    },
    fetchMessages() {
      // this.$refs.messageScroll.stop()
      console.log(`initial fetch`)
      if (this.loading) {
        console.log("tried to double load")
        // done();
        return
      }
      this.loading = true
      const url = `/messages?key=${this.apikey()}`
      const filters = {
        filters: {
          'author.channelId': this.channelID
        },
        sort: {
          timestamp: -1
        }
      }
      api.post(url, filters).then((data) => {
        if (data.data.length > 0) {
          console.log(`received some data: ${data.data.length}`)
          this.messages = this.messages.concat(data.data.reverse());
        } else {
          console.log("reached end of user chat history");
        }
      }).catch((reason) => {
        console.log(`error when trying to fetch messages: ${reason}`);
        if (reason.response?.status === 401) {
          console.log('authentication error, please enter api key')
        }
      }).finally(() => {
        this.loading = false
      });
    },

    apikey() {
      return this.$store.state.apikey.apikey
    },

    fetchOldMessages() {

    },

    fetchNewMessages() {
      if (!this.messages.length) {
        console.log("tried to get newer messages without any messages")
        return
      }
      this.loadingNewMessages = true;
      const filters = {
        filters: {
          timestamp: {$gt: this.messages[this.messages.length - 1]['timestamp']},
          'author.channelId': this.channelID
        },
        sort: {
          timestamp: -1
        }
      }
      const url = `/messages?key=${this.apikey()}`
      // console.log(filters)
      api.post(url, filters).then((data) => {
        if (data.data.length > 0) {
          this.messages.unshift(...data.data.reverse()); // O(n), gross
          this.$q.notify({message: `${data.data.length} new messages`, timeout: 2000})
        } else {
          this.$q.notify({message: "0 new messages", timeout: 2000})
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
