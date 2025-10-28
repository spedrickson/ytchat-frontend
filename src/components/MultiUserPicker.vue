<template>
  <q-btn
    no-wrap
    no-caps
    color="primary"
    icon="mdi-account-plus"
    label="Add users to filter"
  >
    <q-menu anchor="top right" self="top left">
      <better-user-search @selected="addAuthor" no-nav />
    </q-menu>
  </q-btn>
  <q-btn
    v-show="users.size > 1"
    no-wrap
    no-caps
    color="negative"
    icon="mdi-account-minus"
    label="Clear (show all users)"
    @click="users.clear()"
  />
  <q-btn-toggle
    v-show="users.size"
    no-caps
    v-model="userFilterType"
    push
    @update:model-value="modified"
    :options="[
      { label: 'Any of these users', value: 'include' },
      { label: 'None of these users', value: 'exclude' },
    ]"
  />
  <q-list>
    <q-item v-for="[channelId, author] in users" :key="channelId">
      <q-chip removable @remove="removeAuthor(channelId)">
        <author-component :author="author" />
      </q-chip>
    </q-item>
  </q-list>
</template>

<script setup>
import { ref, defineModel } from "vue";
import AuthorComponent from "./Author.vue";
import BetterUserSearch from "./BetterUserSearch.vue";
const userFilterType = ref("include");
// const userTypes = ref([]);
const users = defineModel();

function addAuthor(author) {
  users.value.set(author.channelId, author);
  // modified();
}
function removeAuthor(channelId) {
  users.value.delete(channelId);
  // modified();
}
function clearAuthors() {
  users.value.clear();
}
function modified() {}
</script>
