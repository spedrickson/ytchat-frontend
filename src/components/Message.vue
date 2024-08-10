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
        :ripple="false"
        v-if="message.amountValue"
        style="padding: 0 0; margin: 0 0"
      >
        <q-chip
          clickable
          @click="convertMoney"
          :ripple="false"
          :style="{
            'background-color': `#${parseInt(message.bgColor).toString(16).substring(2)}`,
          }"
        >
          <div class="superchat-text">{{ message.amountString }}</div>
        </q-chip>
        <img
          v-if="message.hasOwnProperty('sticker')"
          :src="message.sticker"
          alt="sticker"
        />
        <message-content :message-ex="message.messageEx" />
      </q-chip>
      <message-content v-else :message-ex="message.messageEx" />
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
    // const {dateString} = DateFunc.useDateString()
    return {
      dateString(timestamp) {
        return date.formatDate(timestamp, "YYYY-MM-DD HH:mm:ss");
      },
      // dateString
    };
  },
  methods: {
    authorClicked(channelId) {
      console.log(`received emit from author`);
      this.$router.push(`/user/${channelId}/messages`);
    },
    convertMoney() {
      try {
        window.open(
          `https://google.com/search?q=${this.message.amountValue} ${this.message.currency} in USD`,
        );
        // const result = fx.convert(this.message.amountValue, {from: this.message.currency, to: "USD"})
        // console.log(result)
      } catch (e) {
        console.log(e);
      }
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
