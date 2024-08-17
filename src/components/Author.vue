<template>
  <span>
    <q-avatar
      v-if="author.isChatSponsor"
      icon="mdi-currency-usd"
      size="sm"
      font-size="1.4rem"
      class="badge-chat badge-sub col-sm"
    >
      <q-tooltip> channel member </q-tooltip>
    </q-avatar>
    <q-avatar
      v-if="author.isChatModerator"
      rounded
      size="sm"
      font-size="1.2rem"
      class="badge-chat badge-mod col-sm"
      icon="mdi-wrench"
    >
      <q-tooltip>moderator</q-tooltip>
    </q-avatar>
    <q-avatar
      v-if="author.isChatOwner"
      rounded
      size="sm"
      font-size="1.1rem"
      icon="mdi-video-check"
      class="badge-chat badge-owner col-2 overflow-hidden"
    >
      <q-tooltip>channel owner</q-tooltip>
    </q-avatar>
    <!--    <q-btn dense no-caps flat :to="`/user/${channelId}/messages`" padding="0">-->
    <q-btn
      dense
      no-caps
      flat
      @click="clicked"
      padding="0"
      :to="`/user/${author.channelId}/messages`"
    >
      <template v-if="author.isVerified">
        <q-chip
          dense
          icon="mdi-check-bold"
          color="primary"
          class="author-name badge-chat"
        >
          {{ author.name.substring(0, nameMaxLen) }}
        </q-chip>
        <!--      {{ name }}-->
      </template>
      <span v-else class="author-name">
        {{ author.name.substring(0, nameMaxLen) }}
      </span>
    </q-btn>
  </span>
</template>

<script>
import { defineComponent } from "vue";

const nameMaxLen = 25;

export default defineComponent({
  name: "AuthorComponent",
  emits: ["clicked"],
  props: {
    // name: {default: null},
    // channelId: {default: null},
    // channelUrl: {default: null},
    // // imageUrl: {default: null},
    // isChatOwner: {default: false},
    // isVerified: {default: false},
    // isChatModerator: {default: false},
    // isChatSponsor: {default: false},
    // badgeUrl: {default: null},
    noNav: { type: Boolean, default: false },
    author: { default: null },
  },
  methods: {
    clicked(e, go) {
      e.preventDefault();
      if (this.noNav) {
        // console.log("no nav")
        this.$emit("clicked", this.author);
      } else {
        // console.log("was nav")
        go();
      }
    },
  },
  setup() {
    return { nameMaxLen };
  },
});
</script>

<style scoped lang="sass">
.badge-mod
  background: #00ad03

.badge-sub
  color: black
  background: gold

.badge-owner
  background: red

.badge-chat
  margin: 0 3px

.verified
  margin: 1px 0

.author-name
  padding: 0 8px
  margin-left: 0
  font-weight: bolder
  font-size: larger

//.author-btn
</style>
