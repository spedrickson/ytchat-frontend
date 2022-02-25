<template>
  <span>

    <q-avatar v-if="isChatSponsor"
              icon="fas fa-dollar-sign" size="sm" font-size="1.4rem"
              class="badge-chat badge-sub col-sm">
      <q-tooltip>
        channel member
      </q-tooltip>
    </q-avatar>
    <q-avatar v-if="isChatModerator"
              rounded size="sm"
              font-size="1.2rem"
              class="badge-chat badge-mod col-sm" icon="fas fa-wrench">
      <q-tooltip>moderator</q-tooltip>
    </q-avatar>
    <q-avatar v-if="isChatOwner"
              rounded size="sm"
              font-size="1.1rem"
              icon="fas fa-video" class="badge-chat badge-owner col-2 overflow-hidden">
      <q-tooltip>channel owner</q-tooltip>
    </q-avatar>
    <q-btn dense no-caps flat :to="`/user/${channelId}`" padding="0">
      <template v-if="isVerified">
        <q-chip dense icon="fas fa-check" color="primary" class="author-name badge-chat">
          {{ name.substring(0, nameMaxLen) }}
        </q-chip>
        <!--      {{ name }}-->
      </template>
      <span v-else class="author-name">
        {{ name.substring(0, nameMaxLen) }}
      </span>
    </q-btn>
  </span>
</template>

<script>
import {defineComponent} from "vue";

const nameMaxLen = 10

export default defineComponent({
    name: "Author",
    props: {
      name: {default: null},
      channelId: {default: null},
      channelUrl: {default: null},
      // imageUrl: {default: null},
      isChatOwner: {default: false},
      isVerified: {default: false},
      isChatModerator: {default: false},
      isChatSponsor: {default: false},
      badgeUrl: {default: null},
    },
    setup() {
      return {nameMaxLen}
    }
  },
);
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
