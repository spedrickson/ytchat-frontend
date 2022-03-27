<template>
  <div>
    <div class="text-center" v-if="!buttonLoading && messages.length === 0">
      <h2>No messages :(</h2>
    </div>
    <q-card class="column" style="height: 95vh">
      <q-scroll-area class="col" id="scroll-area-with-virtual-scroll-1" ref="scrollTarget">
        <q-virtual-scroll :items="messages" ref="virtualListRef" dense @virtual-scroll="onVirtualScroll" component="q-list" scroll-target="#scroll-area-with-virtual-scroll-1 > .scroll" virtual-scroll-item-size="32">
          <template v-slot="{ item, index }">
            <q-item :key="index" dense>
              <message :message="item" show-datetime/>
            </q-item>
          </template>
        </q-virtual-scroll>
        <q-scroll-observer @scroll.once="onScroll"/>
      </q-scroll-area>
    </q-card>
  </div>
</template>

<script>
import {defineComponent, nextTick, ref} from "vue";
import Message from "components/Message";
import {api} from 'boot/axios.js'

const MESSAGE_CAP = 250;

export default defineComponent({
  name: "MessageHistory",
  components: {Message},
  emits: ['auth-error', 'autoscroll-disabled'],
  setup() {
    return {
      autoLoadIntervalId: ref(-1),
      autoScrollIntervalId: ref(-1),
      needsScrollToBottom: false,
      messages: ref([]),
      loading: false,
      buttonLoading: ref(false),
      filters: ref({}),
    };
  },
  methods: {
    onScroll(event) {

      console.log("scrolled")
    },
    startAutoLoad() {
      this.autoLoadIntervalId = setInterval(() => {
        // console.log("auto fetching")
        this.fetchMessages();
      }, 1000)
    },
    stopAutoLoad() {
      clearInterval(this.autoLoadIntervalId)
    },
    startAutoScroll() {
      this.autoScrollIntervalId = setInterval(() => {
        // console.log("auto scrolling")
        this.$refs.scrollTarget.setScrollPercentage('vertical', 1.0)
        //(this.messages.length - 1, 'end-force')
      }, 250)
    },
    stopAutoScroll() {
      clearInterval(this.autoScrollIntervalId)
    },
    onVirtualScroll(item) {
      if (this.needsScrollToBottom) {
        this.needsScrollToBottom = false
        const toIndex = this.messages.length - 1
        console.log(`auto-scrolling to bottom: ${toIndex}`)
        this.$refs.virtualListRef.scrollTo(toIndex, 'end-force')
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
        } else {
          console.log("no new messages");
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
