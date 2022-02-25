<template>
  <q-tr no-hover>
    <q-td no-hover>
      <div @click="openContext" style="white-space: nowrap">
        {{ shortHumanizer(Date.parse(message.datetime) - Date.now(), humanizerOptions) }} ago
        <q-tooltip>
          {{ message.datetime }}
          <br/>Click for context
        </q-tooltip>
      </div>
    </q-td>
    <q-td>
      <author v-bind="message.author" style="white-space: nowrap"/>
    </q-td>
    <q-td>
      <q-chip v-if="message.amountValue" style="padding:0 0">
        <q-chip color="positive">{{ message.amountString }}</q-chip>
        <img v-if="message.hasOwnProperty('sticker')" :src="message.sticker" alt="sticker"/>
        <message-content :message-ex="message.messageEx"/>
      </q-chip>
      <message-content v-else :message-ex="message.messageEx"/>
      <!--      <q-tooltip>{{ message }}</q-tooltip>-->
    </q-td>
  </q-tr>
</template>

<script>
import {defineComponent} from "vue";
import Author from "components/Author";
import MessageContent from "components/MessageContent";
import MessageContext from "components/MessageContext";

const humanizerOptions = {
  spacer: "",
  delimiter: " ",
  largest: 2,
  round: true,
}
const shortHumanizer = require("humanize-duration").humanizer({
  language: "shortEn",
  languages: {
    shortEn: {
      y: () => "y",
      mo: () => "mo",
      w: () => "w",
      d: () => "d",
      h: () => "h",
      m: () => "m",
      s: () => "s",
    },
  },
});

const timeStamp = Date.now()

export default defineComponent({
  name: 'Message',
  components: {MessageContent, Author},
  setup() {
    return {shortHumanizer, humanizerOptions}
  },
  methods: {
    openContext() {
      // console.log("opening context")
      this.$q.dialog({
        component: MessageContext,
        parent: this,
        componentProps: {
          message: this.message
        }
      })
    }
  },
  props: {
    message: {
      default: null
    },
    datetime: {
      default: null
    },
    context: {
      default: null,
      type: Function,
    },

    dialog: {
      default: null,
    },
    showDatetime: {
      type: Boolean,
    }
  }
});
</script>
<style lang="sass" scoped>
.row > div
  padding: 5px 1px
  border: 1px solid rgba(86, 61, 255, .7)
//background: rgb(42, 46, 50)

.text-datetime
  color: gray
  font-weight: lighter
</style>
