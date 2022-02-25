<template>
  <q-toolbar>
    <q-btn flat class="author-title" :href="channelUrl">
      <q-icon name="fab fa-youtube" class="yt-logo"/>
    </q-btn>
    <q-avatar>
      <q-img :src="imageUrl">
        <template v-slot:error><q-icon name="fas fa-user"/></template>
        <template v-slot:loading>LOADING</template>
      </q-img>
    </q-avatar>
    <q-toolbar-title>{{ name }}
    </q-toolbar-title>
  </q-toolbar>
</template>

<script>
import {defineComponent} from "vue";
import Author from "components/Author";

export default defineComponent({
  name: "AuthorHeader",
  // components: {Author},
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
});
</script>

<style scoped lang="sass">
.q-header
  font-size: xx-large
  padding: 2px 6px

.yt-logo
  color: #FF0000
  background: white
</style>

