<template>
  <q-dialog ref="dialogRef"
            full-height full-width seamless position="right"
            transition-show="none">
    <q-card class="column">
      <q-bar style="height: 40px">
        <q-toolbar-title>Context</q-toolbar-title>
        <q-btn flat icon="cancel" v-close-popup/>
      </q-bar>
      <q-scroll-area class="col" style="width: 50vw" ref="scrollArea">
        <!--        <message-history :messageID="message._id"/>-->
        <!--        <q-infinite-scroll >-->

        <!--        </q-infinite-scroll>-->
        <q-table :rows="messages" :pagination="{rowsPerPage: 0}" dense separator="vertical" :columns="columns">
          <template v-slot:header>
            <q-tr>
              <q-btn class="load-btn">LOAD MORE
              <q-tooltip>
                not implemented yet, yell at spedrickson to fix
              </q-tooltip></q-btn>
            </q-tr>
          </template>
          <template #body="row">
            <message :message="row.row"/>
          </template>
        </q-table>
      </q-scroll-area>
    </q-card>
  </q-dialog>
</template>

<script>
import {api} from "boot/axios";
import {useDialogPluginComponent} from "quasar";
import {defineComponent, nextTick, ref} from "vue";

import Message from "components/Message";

export default defineComponent({
  name: "MessageContext",
  components: {Message},
  props: {
    message: {default: null},
  },
  emits: [...useDialogPluginComponent.emits],
  mounted() {
    this.messages = this.getContext()
  },
  data() {
    return {
      messages: []
    }
  },
  setup() {
    const {dialogRef, onDialogHide, onDialogOK, onDialogCancel} = useDialogPluginComponent();
    const autoload = ref(false);
    return {
      scrollArea: ref(null),
      // messages: [],
      columns: [
        {
          name: 'when',
          label: "when",
          field: row => row.author.datetime,
        },
        {
          name: 'author', label: "author",
          classes: 'ellipsis',
          sortable: false,
          style: 'max-width: 50px; width: 50px',
          headerStyle: 'max-width: 50px'
        },
        {
          name: 'message',
          sortable: false,
          label: "message",
        },
      ],
      dialogRef,
      onDialogHide,
      onOKClick() {
        onDialogOK()
      },
      // lazy function to poll context every 100ms until loaded then center
      centerContext(lastHeight, count) {
        if (count >= 20) {
          console.log("timed out, couldn't center table")
          return
        }
        count++
        const newHeight = this.$refs?.scrollArea?.getScroll()?.verticalSize
        if (!lastHeight) {
          lastHeight = newHeight
        }
        if (newHeight !== lastHeight && lastHeight > 1) {
          this.$refs.scrollArea.setScrollPercentage("vertical", 0.5)
          autoload.value = true
        } else {
          setTimeout(() => {
            this.centerContext(newHeight, count)
          }, 100)
        }
      },
      onCancelClick: onDialogCancel,
      apikey() {
        return this.$store.state.apikey.apikey
      },
      getContext() {
        // const newerFilters = {
        //   timestamp: {$gt: this.message.timestamp},
        // }
        // const olderFilters = {
        //   timestamp: {$gt: this.message.timestamp},
        // }
        const results = [this.message]
        const newer_url = `/messages/newer?key=${this.apikey()}&messageID=${this.messages[0]?._id ?? this.message._id}`
        // console.log(`querying for context: ${newer_url}`)
        api.get(newer_url).then((data) => {
          results.push(...data.data)
        }).catch((reason) => {
          console.log(`error when fetching context (newer): ${reason.message}`)
        })
        const older_url = `/messages/older?key=${this.apikey()}&messageID=${this.messages[this.messages.length - 1]?._id ?? this.message._id}`
        // console.log(`querying for context: ${older_url}`)
        api.get(older_url).then(data => {
          results.unshift(...data.data.reverse()) // O(n) :(
          nextTick(() => {
            this.centerContext(null, 0)
          })
        }).catch(reason => {
          console.log(`error when fetching context (older): ${reason.message}`)
        })
        return results
      },
    }
  },
})
</script>
<style lang="sass">
.load-btn
  width: 100%
</style>
