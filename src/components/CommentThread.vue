<template>
  <!-- recursive component for parent rendering -->
  <template v-if="parent">
    <q-item>
      <user-comment parent :comment="parent" @openReplies="fullThread" />
    </q-item>
    <q-separator
      :style="{ backgroundColor: '#301F1F' }"
      spaced
      size="2px"
      inset="item"
    />
  </template>
  <template v-for="reply in threadComments" :key="reply.id">
    <div class="row">
      <div class="col-shrink parent-arrow" v-if="reply.parentId">
        <q-icon left size="lg" name="mdi-subdirectory-arrow-left" />
      </div>
      <q-item class="col-grow">
        <user-comment :comment="reply" @openReplies="fullThread" />
      </q-item>
    </div>
  </template>
</template>

<script setup>
import UserComment from "src/components/UserComment.vue";
import { getFullThread } from "src/helpers/comments";
import { ref } from "vue";
import { useStore } from "vuex";
defineOptions({ name: "CommentThread" });
const props = defineProps(["comment"]);
const threadComments = ref([props.comment]);
const store = useStore();
const parent = ref(props.comment.parent?.[0]);

// fetches comments of the given thread if present
function fullThread() {
  // parentId (i.e. the thread ID) changes based on whether the returned API comment was a parent or reply
  const parentId = props.comment.parentId ?? props.comment.id;
  getFullThread(parentId, store).then(({ data }) => {
    // preserve parent so we don't have to request it from API with all the replies
    parent.value = props.comment.parent?.[0] ?? props.comment;
    threadComments.value = data;
  });
}
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
