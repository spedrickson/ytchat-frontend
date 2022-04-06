<template>
    <q-card class="column justify-center" style="height: 97vh">
    <q-scroll-area class="col" id="scroll-area" ref="scrollTarget">
      <q-btn v-intersection="intersectTop"  loading="loading" dense label="auto load new messages" outline rounded color="positive" @click="toggleAutoLoad">
        <template v-slot:loading>
          <q-spinner-bars color="accent"/>
        </template>
      </q-btn>
      <q-virtual-scroll :items="messages" ref="virtualListRef" dense @virtual-scroll="onVirtualScroll" component="q-list" scroll-target="#scroll-area > .scroll" virtual-scroll-item-size="32">
        <template v-slot="{ item, index }">
          <q-item :key="index" dense>
            <message :message="item" show-datetime/>
          </q-item>
        </template>
      </q-virtual-scroll>
      <q-scroll-observer ref="scrollObserver" @scroll="onScroll"/>
      <q-btn v-intersection="intersectBottom"  :loading="autoLoadIntervalId > 0" dense label="auto load new messages" outline rounded color="positive" @click="toggleAutoLoad">
        <template v-slot:loading>
          <q-spinner-bars color="accent"/>
        </template>
      </q-btn>
      <div class="text-center" v-if="!buttonLoading && messages.length === 0">
        <h2>No messages :(</h2>
      </div>
    </q-scroll-area>
    <q-page-sticky v-show="!autoScrollIntervalId" position="bottom-right" :offset="[10, 10]">
      <q-btn fab @click="scrollToBottom" color="positive" round icon="arrow_downward">
        <q-tooltip>scroll to bottom</q-tooltip>
      </q-btn>
    </q-page-sticky>
    </q-card>

</template>

<script>
import {defineComponent, nextTick, ref} from "vue";
import Message from "components/Message";
import {api} from 'boot/axios.js'
import {debounce} from 'quasar'

const MESSAGE_CAP = 250;

export default defineComponent({
  name: "MessageHistory",
  components: {Message},
  emits: ['auth-error', 'autoscroll-disabled', 'autoscroll-enabled'],
  created() {
    this.onScroll = debounce(this.onScroll, 500, true)
  },
  setup() {
    return {
      autoLoadIntervalId: ref(0),
      autoScrollIntervalId: ref(0),
      needsScrollToBottom: false,
      messages: ref([]),
      loading: false,
      buttonLoading: ref(false),
      filters: ref({}),
    };
  },
  beforeUnmount() {
    console.log("unmounting, disabling intervals")
    this.stopAutoScroll();
    this.stopAutoLoad();
  },
  methods: {
    toggleAutoLoad() {
      if (this.autoLoadIntervalId > 0) {
        this.stopAutoLoad()
      }  else {
        this.startAutoLoad()
      }
    },
    intersectBottom(entry) {
      if (entry.isIntersecting === true) {
        console.log("scrolled to bottom, re-enabling autoscroll and autoload")
        this.startAutoScroll()
      }
    },
    intersectTop(entry) {
      if (entry.isIntersecting === true && this.messages.length > 0) {
        console.log("scrolled to top, loading more messages")
        this.fetchOlderMessages()
      }
    },
    onScroll(event) {
      if (event.direction === "up") {
        console.log("scrolled up, disabling auto-scroll")
        this.stopAutoScroll()
        this.stopAutoLoad()
      }
    },
    startAutoLoad() {
      if (this.autoLoadIntervalId) {
        console.log("tried to start autoload when already running")
        return
      }
      console.log("starting auto load")
      this.autoLoadIntervalId = setInterval(() => {
        // console.log("auto fetching")
        this.fetchMessages();
      }, 1000)
    },
    stopAutoLoad() {
      clearInterval(this.autoLoadIntervalId)
      this.autoLoadIntervalId = 0;
    },
    startAutoScroll() {
      if (this.autoScrollIntervalId) {
        console.log("tried to start autoscroll when already running")
        return
      }
      console.log("starting auto scroll")
      this.autoScrollIntervalId = setInterval(() => {
        // console.log("auto scrolling")
        this.$refs.scrollTarget.setScrollPercentage('vertical', 1.0)
        //(this.messages.length - 1, 'end-force')
      }, 250)
    },
    scrollToItem(index) {
      this.$refs.virtualListRef.scrollTo(index, 'end-force')
    },
    scrollToBottom() {
      this.$refs.scrollTarget.setScrollPercentage('vertical', 1.0)
    },
    stopAutoScroll() {
      clearInterval(this.autoScrollIntervalId)
      this.autoScrollIntervalId = 0;
      this.$emit('autoscroll-disabled')
    },
    onVirtualScroll(item) {
      if (this.needsScrollToBottom) {
        this.needsScrollToBottom = false
        const toIndex = this.messages.length - 1
        // console.log(`auto-scrolling to bottom: ${toIndex}`)
        this.scrollToItem(toIndex)
      }
    },
    newFilters(filters) {
      this.filters = filters;
      this.clearMessages();
      this.fetchMessages();
    },
    clearMessages() {
      this.messages.length = 0;
    },
    trimMessages() {
      const lengthDiff = this.messages.length - MESSAGE_CAP
      if (lengthDiff > 0) {
        console.log(`${lengthDiff} items over ${MESSAGE_CAP}, shortening list`)
        this.messages.splice(0, lengthDiff)
      }
    },

    fetchMessages() {
      if (this.loading) {
        console.log("tried to double load")
        return
      }
      this.loading = true
      this.buttonLoading = true
      const url = `/messages?key=${this.apikey()}`
      const filters = this.filters
      if (this.messages.length) {
        // console.log("adding $gt to filters")
        filters.filters.timestamp = {'$gt': this.messages[this.messages.length - 1]['timestamp']}
      }
      api.post(url, this.filters).then((data) => {
        if (data.data.length > 0) {
          console.log(`received some data: ${data.data.length}`)
          this.messages = this.messages.concat(data.data.reverse());
          this.trimMessages();
          nextTick(() => {
            // this.$refs.virtualListRef.refresh(this.messages.length - 1)
            this.needsScrollToBottom = true;
          })
        }
      }).catch(reason => {
        console.log(`error when trying to query filtered messages info: ${reason}`);
        if (reason?.response?.status === 401) {
          this.$emit('auth-error')
          console.log('authentication error, please enter api key')
        }
      }).finally(() => {
        this.loading = false
        this.buttonLoading = false
      });
    },

    fetchOlderMessages() {
      console.log('fetching older messages')
      if (this.loading) {
        console.log("tried to double load")
        return
      }
      this.loading = true
      this.buttonLoading = true
      const url = `/messages?key=${this.apikey()}`
      const filters = this.filters
      if (this.messages.length) {
        // console.log("adding $gt to filters")
        filters.filters.timestamp = {'$lt': this.messages[0]['timestamp']}
      }
      api.post(url, this.filters).then((data) => {
        if (data.data.length > 0) {
          console.log(`received some data: ${data.data.length}`)
          this.messages = data.data.reverse().concat(this.messages)
          nextTick(() => {
            this.$refs.virtualListRef.scrollTo(data.data.length - 1, 'start-force')
          })
        }
      }).catch(reason => {
        console.log(`error when trying to query filtered messages info: ${reason}`);
        if (reason?.response?.status === 401) {
          this.$emit('auth-error')
          console.log('authentication error, please enter api key')
        }
      }).finally(() => {
        this.loading = false
        this.buttonLoading = false
      });
    },

    apikey() {
      return this.$store.state.apikey.apikey
    },
  },
});
</script>

<style scoped lang="sass">
.refresh-btn
  background: darkslategrey
  width: 100%
</style>
