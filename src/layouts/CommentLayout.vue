<template>
  <q-layout>
    <q-page-container>
      <q-toolbar inset class="toolbar">
        <q-toolbar-title>
          <q-icon color="yellow" name="mdi-alert" /> !! IN DEVELOPMENT !!
          <q-icon name="mdi-bug" color="red" />
        </q-toolbar-title>
        <div>
          <q-spinner
            class="q-mx-md"
            size="md"
            v-if="loading && comments.length !== 0"
          />
          <q-btn v-else size="lg" flat icon="mdi-refresh" @click="getComments"
            ><q-tooltip>Refresh data</q-tooltip></q-btn
          >
        </div>
        <q-space />
        <date-time-picker v-model="after" label="Posted after..." />
        <q-separator vertical />
        <date-time-picker v-model="before" label="Posted before..." />
        <q-separator vertical size="8px" />
        <comment-sort-selector v-model="sort" />
        <video-id-input v-model="videoId" />
        <multi-user-picker v-model="users" />
        <q-space />
        <q-btn
          flat
          square
          title="show advanced filters"
          @click="showAdvanced = !showAdvanced"
          :icon="showAdvanced ? 'mdi-chevron-up' : 'mdi-chevron-down'"
        />
        <ApiKeyInput />
      </q-toolbar>
      <q-toolbar inset v-if="showAdvanced" class="toolbar"> </q-toolbar>
      <!-- <q-list> -->
      <!-- <q-item dense > -->
      <q-card
        class="col-12 q-pa-xs"
        v-for="comment in comments"
        :key="comment.id"
      >
        <comment-thread :comment="comment" />
      </q-card>

      <!-- </q-item> -->
      <!-- </q-list> -->

      <load-or-error :loading="loading" :count="comments.length" />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import { api } from "boot/axios";
import CommentThread from "src/components/CommentThread.vue";
import LoadOrError from "src/components/LoadOrError.vue";
import DateTimePicker from "src/components/DateTimePicker.vue";
import CommentSortSelector from "src/components/CommentSortSelector.vue";
import VideoIdInput from "src/components/VideoIdInput.vue";
import MultiUserPicker from "src/components/MultiUserPicker.vue";
import ApiKeyInput from "components/ApiKeyInput.vue";

const comments = ref([]);

const route = useRoute();
const store = useStore();
const loading = ref(false);

const before = ref(null);
const after = ref(null);

const sort = ref({ value: { likeCount: -1 }, label: "Most Likes" });

const videoId = ref(null);
const users = ref(new Map());

const showAdvanced = ref(false); // tracks whether to show advanced filter toolbar

const fields = ref([
  "textOriginal",
  "id",
  "videoId",
  "authorDisplayName",
  "authorProfileImageUrl",
  "authorChannelId",
  "likeCount",
  "publishedAt",
  "canReply",
  "updatedAt",
  "totalReplyCount",
]);

const apikey = computed(() => {
  return store.state.apikey.apikey;
});

watch(before, getComments);
watch(after, getComments);
watch(sort, getComments);
watch(videoId, getComments);
watch(() => users.value.size, getComments);
watch(() => route.params.channelID, getComments);

function getComments() {
  console.log("getting comments");
  if (loading.value) {
    console.log("was loading");
    return;
  }

  loading.value = true;
  const url = `/comments?key=${apikey.value}`;
  const headers = { Authorization: `${apikey.value}` };
  const payload = {
    filters: {
      // authorChannelId: route.params.channelID,
    },
    sort: sort.value.value, // double .value reference because it's a ref() and object model in the sort selector
    skip: 0,
    limit: 10,
    fields: fields.value,
    includeParent: true,
  };
  if (before.value) payload.publishedBefore = Date.parse(before.value);
  if (after.value) payload.publishedAfter = Date.parse(after.value);
  console.log("payload", payload);

  if (videoId.value) {
    payload.filters.videoId = videoId.value;
  }

  if (users.value.size > 0) {
    payload.filters.authorChannelId = { $in: Array.from(users.value.keys()) };
  }

  api
    .post(url, payload, { headers })
    .then(({ data }) => {
      // console.log("comments api data", data);
      comments.value = data;
    })
    .catch((reason) => {
      console.log(`error when trying to get user comments: ${reason}`);
      if (reason?.response?.status === 401) this.$refs.apiKeyInput.show();
    })
    .finally(() => (loading.value = false));
}

getComments();
</script>
