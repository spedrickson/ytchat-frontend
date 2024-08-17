<template>
  <q-responsive :ratio="16 / 9">
    <q-scroll-area visible id="scroll-area" ref="scrollTarget">
      <q-card
        v-if="reachedBeginning"
        @click="reachedBeginning = false"
        class="text-grey-6"
        ><q-icon name="mdi-timer-sand-empty" />no more messages...</q-card
      >
      <q-btn
        v-else
        v-intersection="intersectTop"
        :loading="loading"
        dense
        label="auto load new messages"
        outline
        rounded
        color="positive"
        @click="fetchOlderMessages"
      >
        <template v-slot:loading
          ><q-spinner-hourglass color="accent"
        /></template>
      </q-btn>
      <q-virtual-scroll
        :items="messages"
        ref="virtualListRef"
        dense
        component="q-list"
        scroll-target="#scroll-area > .scroll"
        virtual-scroll-item-size="32"
      >
        <template v-slot="{ item, index }">
          <q-item :key="index" dense>
            <message :message="item" show-datetime />
          </q-item>
        </template>
      </q-virtual-scroll>
      <div ref="autoloadButton">
        <q-btn
          v-intersection="intersectBottom"
          no-caps
          dense
          outline
          rounded
          color="positive"
          @click="toggleAutoLoad"
          style="margin-left: 15px"
        >
          <span v-if="autoLoadId"
            ><q-spinner-bars /><q-spinner-bars /><q-spinner-bars /><q-spinner-bars
          /></span>
          <span v-else>auto load new messages</span>
        </q-btn>
      </div>
      <load-or-error :loading="loading" :count="messages.length" />
    </q-scroll-area>
    <q-page-sticky
      v-show="!autoScroll"
      position="bottom-right"
      :offset="[10, 10]"
    >
      <q-btn
        fab
        @click="scrollToBottom"
        color="primary"
        round
        icon="arrow_downward"
      />
    </q-page-sticky>
  </q-responsive>
</template>

<script>
import { defineComponent, nextTick, ref } from "vue";
import Message from "components/Message";
import { api } from "boot/axios.js";
import LoadOrError from "./LoadOrError.vue";

const MESSAGE_CAP = 250;
const API_LIMIT = 100;

export default defineComponent({
  name: "MessageHistory",
  components: { Message, LoadOrError },

  setup() {
    return {
      autoScroll: ref(true),
      reachedBeginning: ref(false),
      autoLoadId: ref(0),
      messages: ref([]),
      loading: ref(false),
      filters: ref({}),
    };
  },
  beforeUnmount() {
    this.stopAutoLoad();
  },
  methods: {
    intersectBottom(entry) {
      this.autoScroll = entry.isIntersecting;
    },
    intersectTop(entry) {
      if (entry.isIntersecting === true && this.messages.length > 0)
        this.fetchOlderMessages();
    },
    toggleAutoLoad() {
      this.autoLoadId ? this.stopAutoLoad() : this.startAutoLoad();
    },
    startAutoLoad() {
      if (!this.autoLoadId)
        this.autoLoadId = setInterval(() => this.fetchMessages(), 1000);
    },

    stopAutoLoad() {
      clearInterval(this.autoLoadId);
      this.autoLoadId = 0;
    },

    scrollToBottom() {
      const el = this.$refs.autoloadButton;
      if (el) {
        el.scrollIntoView();
      }
    },

    newFilters(filters) {
      // console.log('received new filters')
      this.filters = filters;
      this.reachedBeginning = false;
      this.messages.length = 0; // why is this the way to clear a list javascript...
      this.fetchMessages();
    },

    trimMessages() {
      const lengthDiff = this.messages.length - MESSAGE_CAP;
      if (lengthDiff > 0) {
        console.log(`${lengthDiff} items over ${MESSAGE_CAP}, shortening list`);
        this.messages.splice(0, lengthDiff);
      }
    },

    fetchMessages() {
      if (this.loading) return;
      this.loading = true;
      const url = `/messages?key=${this.apikey()}`;
      const filters = this.filters;
      if (this.messages.length)
        filters.filters.timestamp = {
          $gt: this.messages[this.messages.length - 1]["timestamp"],
        };
      api
        .post(url, this.filters)
        .then((data) => {
          if (this.messages.length === 0 && data.data.length < API_LIMIT)
            this.reachedBeginning = true;
          if (data.data.length > 0) {
            // console.log(`received some data: ${data.data.length}`)
            this.messages = this.messages.concat(data.data.reverse());
            this.trimMessages();
            if (this.autoScroll) this.$nextTick(this.scrollToBottom);
          }
        })
        .catch((reason) => {
          console.log(
            `error when trying to query filtered messages info: ${reason}`,
          );
          if (reason?.response?.status === 401) this.$refs.apiKeyInput.show();
        })
        .finally(() => (this.loading = false));
    },

    fetchOlderMessages() {
      if (this.loading) return;
      if (this.reachedBeginning) return;
      // console.log('fetching older messages')
      this.loading = true;
      const url = `/messages?key=${this.apikey()}`;
      const filters = this.filters;
      if (this.messages.length)
        filters.filters.timestamp = { $lt: this.messages[0]["timestamp"] };
      api
        .post(url, this.filters)
        .then((data) => {
          if (data.data.length < API_LIMIT) this.reachedBeginning = true;
          if (data.data.length) {
            // console.log(`received some data: ${data.data.length}`)
            this.messages = data.data.reverse().concat(this.messages);
            nextTick(() =>
              this.$refs.virtualListRef.scrollTo(
                data.data.length - 1,
                "start-force",
              ),
            );
          }
        })
        .catch((reason) => {
          console.error(
            `error when trying to query filtered messages info: ${reason}`,
          );
          if (reason?.response?.status === 401) this.$refs.apiKeyInput.show();
        })
        .finally(() => (this.loading = false));
    },

    apikey() {
      return this.$store.state.apikey.apikey;
    },
  },
});
</script>

<style scoped lang="sass">
.refresh-btn
  background: darkslategrey
  width: 100%
</style>
