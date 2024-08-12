<template>
  <q-item-section top avatar>
    <q-avatar><img :src="comment.authorProfileImageUrl" /></q-avatar>
    <q-btn
      v-if="comment.canReply && comment.totalReplyCount > replyThreshold"
      flat
      dense
      title="expand replies"
      icon="mdi-reply"
      :label="comment.totalReplyCount"
      @click="$emit('openReplies')"
    />
  </q-item-section>
  <q-item-section>
    <q-item-label
      @click="$router.push(`/user/${comment.authorChannelId}/comments`)"
      >{{ comment.authorDisplayName }}</q-item-label
    >
    <q-item-label caption>{{ comment.textOriginal }}</q-item-label>
  </q-item-section>
  <q-item-section side top>
    <q-item-label overline>
      <a
        style="color: red"
        title="go to comment"
        :href="`https://www.youtube.com/watch?v=${comment.videoId}&lc=${comment.id}`"
      >
        {{ new Date(comment.publishedAt).toLocaleString() }}
      </a></q-item-label
    >
    <q-item-label
      >{{ comment.likeCount }} <i class="mdi mdi-thumb-up"></i>
    </q-item-label>
  </q-item-section>
</template>

<script setup>
import { defineProps, defineOptions, computed, defineEmits } from "vue";
defineOptions({ name: "UserComment" });
defineEmits(["openReplies"]);
const props = defineProps({
  comment: Object,
  parent: Boolean,
});
// only show replies button if more than 1 reply for parent comments (it's already rendering the child)
const replyThreshold = computed(() => {
  return props.parent === true ? 1 : 0;
});
</script>

<style lang="scss">
.parent {
  background-color: $grey-10;
}
.parent-arrow {
  color: $light-blue-10;
  rotate: 90deg;
  margin-left: 0;
  padding-left: 0;
}
</style>
