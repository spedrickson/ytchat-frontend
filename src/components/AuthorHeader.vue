<template>
  <q-toolbar>
    <q-btn flat class="channel-btn" :href="channelUrl">
      <div class="icon-container">
        <div class="layer1"><q-icon name="fab fa-youtube" class="yt-logo"/></div>
        <div class="layer2">▮</div>
      </div>
    </q-btn>
    <q-avatar>
      <q-img :src="imageUrl">
        <template v-slot:error><q-icon name="fas fa-user"/></template>
        <template v-slot:loading>LOADING</template>
      </q-img>
      <q-img :src="badgeUrl" v-if="badgeUrl"/>
    </q-avatar>
    <q-toolbar-title>
      {{ name }}
    </q-toolbar-title>
  </q-toolbar>
</template>

<script>
import {defineComponent} from "vue";
import AuthorComponent from "components/Author";
import {ref} from "vue";

export default defineComponent({
  name: "AuthorHeader",
  props: {
    name: {default: null},
    channelUrl: {default: null},
    imageUrl: {default: null},
    isChatOwner: {default: false},
    isVerified: {default: false},
    isChatModerator: {default: false},
    isChatSponsor: {default: false},
    badgeUrl: {default: null},
  },
  setup() {
    return {
      users: ref([]),
    }
  }
});
</script>

<style scoped lang="sass">
.icon-container
  display: grid

.q-header
  font-size: xx-large
  padding: 2px 6px

.layer1, .layer2
  grid-column: 1
  grid-row: 1

.yt-logo
  color: #FF0000
</style>

