<template>
  <q-card>
    <q-card-section>
      <q-input type="search" debounce="500" autogrow autofocus clearable dense label="search for user"
               class="q-pa-sm" :model-value="searchTerm" @update:model-value="fetchUserBySearch"
      @clear="clearUsers"/>
    </q-card-section>
    <q-card-section>
      <q-table :rows="users" :row-key="row => row.obj.channelId" :pagination="pagination"
               :columns="columns" separator="none" dense v-show="this.users.length > 0">
        <template v-slot:header/>
        <template v-slot:no-data>
            no results :(
        </template>
        <template #body="row">
          <q-tr>
            <q-td>
              <author v-bind="row.row.obj"/>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </q-card-section>
  </q-card>
</template>

<script>
import {api} from "boot/axios";
import {ref} from "vue";
import Author from "components/Author";

export default {
  name: "UserSearch",
  components: {Author},
  // props: ['searchTerm'],
  methods: {
    clearUsers() {
      this.users.splice(0, this.users.length) // empty array
    },
    fetchUserBySearch(searchTerm) {
      console.log(this.searchTerm)
      this.clearUsers()
      if (searchTerm) {
        const url = `search/channels/${searchTerm}?key=${this.$store.state.apikey.apikey}`;
        console.log(`querying ${url}`);
        api.get(url).then(data => {
          this.users.push(...data.data);
        }).catch((reason) => {
          console.log(`error when trying to search for authors: ${reason}`);
          if (reason.response.status === 401) {
            console.log(`authentication error`)
          }
        })
      }
    }
  },
  setup() {
    return {
      searchTerm: '',
      users: ref([]),
      pagination: {
        page: 1,
        rowsPerPage: 0
      },
      columns: [
        {
          name: 'name',
          label: "name",
        }
      ],
    }
  }
}
</script>
