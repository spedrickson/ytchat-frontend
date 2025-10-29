<template>
  <q-card>
    <q-card-section>
      <q-input
        type="search"
        debounce="500"
        autogrow
        autofocus
        clearable
        dense
        label="search for user"
        class="q-pa-sm"
        :model-value="searchTerm"
        @update:model-value="fetchUserBySearch"
        @clear="clearUsers"
        ref="authorSearch"
        @keydown.enter.prevent
      >
        <template v-slot:append>
          <q-checkbox
            v-model="caseSensitive"
            checked-icon="mdi-format-letter-case-upper"
            unchecked-icon="mdi-format-letter-case"
            ><q-tooltip
              >Case-sensitive ({{
                caseSensitive ? "active" : "inactive"
              }})</q-tooltip
            >
          </q-checkbox>
        </template>
      </q-input>
    </q-card-section>
    <q-card-section>
      <q-table
        :rows="users"
        :row-key="(row) => row.channelId"
        :pagination="pagination"
        :columns="columns"
        separator="none"
        dense
        v-show="this.users.length > 0"
      >
        <template v-slot:no-data> no results :( </template>
        <template v-slot:body-cell-avatar="row">
          <q-td>
            <q-img :src="row.row.imageUrl" height="24px" width="24px">
              <template v-slot:error><q-icon name="mdi-account" /></template>
              <template v-slot:loading><q-icon name="mdi-loading" /></template>
            </q-img>
          </q-td>
        </template>
        <template v-slot:body-cell-author="row">
          <q-td
            ><author-component
              :author="row.row"
              @clicked="authorSelected"
              :no-nav="noNav"
          /></q-td>
        </template>
      </q-table>
    </q-card-section>
  </q-card>
</template>

<script>
import { defineComponent, ref } from "vue";
import { api } from "boot/axios";
import AuthorComponent from "components/Author";
import * as DateFunc from "../assets/js/DateFunc";

export default defineComponent({
  name: "BetterUserSearch",
  components: { AuthorComponent },
  data() {
    return {
      searchTerm: "",
      caseSensitive: false,
    };
  },
  watch: {
    caseSensitive() {
      this.fetchUserBySearch(this.searchTerm);
    },
  },
  methods: {
    authorSelected(author) {
      // console.log(author)
      this.$emit("selected", author);
    },
    focusInput() {
      this.$refs.authorSearch.focus();
    },
    clearUsers() {
      this.users.splice(0, this.users.length); // empty array
    },
    fetchUserBySearch(searchTerm) {
      this.searchTerm = searchTerm;
      this.clearUsers();
      if (searchTerm) {
        let url = `search/channels/${searchTerm}?key=${this.$store.state.apikey.apikey}&limit=100`;
        // console.log(`querying ${url}`);
        if (this.caseSensitive) {
          url += "&caseSensitive=true";
        }
        api
          .get(url)
          .then((data) => {
            console.log(data);
            this.users.push(...data.data);
          })
          .catch((reason) => {
            console.log(`error when trying to search for authors: ${reason}`);
            if (reason.response.status === 401) {
              console.log(`authentication error`);
            }
          });
      }
    },
  },
  props: {
    noNav: { type: Boolean, default: false },
  },
  setup() {
    const { dateString } = DateFunc.useDateString();
    return {
      dateString,
      users: ref([]),
      pagination: {
        page: 1,
        rowsPerPage: 30,
      },
      columns: [
        {
          align: "left",
          name: "avatar",
          label: "",
          sortable: false,
          style: "width: 24px",
          headerStyle: "width: 24px",
        },
        {
          align: "left",
          name: "author",
          label: "name",
        },
        {
          align: "left",
          name: "lastTimestamp",
          label: "last message",
          field: (row) => row.lastMessageTimestamp ?? row.lastCommentTimestamp,
          sortable: true,
          // sort: (a,b) => sortTimestamp(a, b),
          sortOrder: "da",
          format: (val) => dateString(val),
        },
      ],
    };
  },
});
</script>

<style scoped></style>
