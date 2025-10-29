<template>
  <q-tr no-hover>
    <q-td no-hover>
      <div @click="openContext" style="white-space: nowrap">
        {{ dateString(message.timestamp) }}
        <q-tooltip> Click for context </q-tooltip>
      </div>
    </q-td>
    <q-td>
      <author-component
        :author="message.author"
        style="white-space: nowrap"
        @clicked="authorClicked"
      />
    </q-td>
    <q-td>
      <q-chip
        v-if="message.amountValue"
        :ripple="false"
        style="padding: 0 0; margin: 0 0"
      >
        <q-chip
          clickable
          @click="convertMoney"
          :ripple="false"
          :style="{
            'background-color': `#${parseInt(message.bgColor ?? '0')
              .toString(16)
              .substring(2)}`,
          }"
        >
          <div class="superchat-text">{{ message.amountString }}</div>
        </q-chip>
        <img
          v-if="message.hasOwnProperty('sticker')"
          :src="message.sticker"
          alt="sticker"
        />
        <message-content :message-ex="message.messageEx ?? [message.message]" />
      </q-chip>
      <message-content
        v-else
        :message-ex="message.messageEx ?? [message.message]"
      />
    </q-td>
  </q-tr>
</template>

<script>
import { defineComponent } from "vue";
import AuthorComponent from "components/Author";
import MessageContent from "components/MessageContent";
import MessageContext from "components/MessageContext";
import { date } from "quasar";

export default defineComponent({
  name: "MessageComponent",
  components: { MessageContent, AuthorComponent },
  setup() {
    return {
      dateString(timestamp) {
        return date.formatDate(timestamp, "YYYY-MM-DD HH:mm:ss");
      },
    };
  },
  methods: {
    authorClicked(channelId) {
      console.log(`received emit from author`);
      this.$router.push(`/user/${channelId}/messages`);
    },
    convertMoney() {
      window.open(
        `https://google.com/search?q=${this.message.amountValue} ${this.message.currency} in USD`,
      );
    },
    openContext() {
      this.$q.dialog({
        component: MessageContext,
        parent: this,
        componentProps: {
          message: this.message,
        },
      });
    },
  },
  props: {
    message: {
      default: null,
    },
  },
});
</script>
<style lang="sass" scoped>
.superchat-text
  color: #1d1d1d
  font-weight: bold
  margin: 0 5px
  padding: 0 0

.row > div
  padding: 5px 1px
  //border: 1px solid rgba(86, 61, 255, .7)
//background: rgb(42, 46, 50)

.text-datetime
  color: gray
  font-weight: lighter
</style>
