<template>
  <q-layout class="main-layout" view="hHh Lpr lff">
    <api-key-dialog ref="apiKeyDialog"/>
    <q-header elevated height-hint="98">
      <q-toolbar>
        <q-btn dense flat round icon="fas fa-filter" @click="toggleSearch"/>
        <q-toolbar-title>filtered ytchat</q-toolbar-title>
        <q-btn-dropdown icon="fas fa-lock" label="apikey">
          <api-key-input/>
        </q-btn-dropdown>
      </q-toolbar>
    </q-header>
    <q-drawer elevated v-model="drawerLeft" side="left" :persistent="false" class="column q-pa-sm">
      <q-expansion-item header-class="expand-header" class="col-auto" v-model="usersExpanded" dense dense-toggle label="Users"  icon="person_search">
        <q-btn no-wrap no-caps color="primary" icon="fas fa-user-plus" label="Add users to filter" style="width: 100%;">
          <q-menu anchor="top right" self="top left">
            <better-user-search @selected="addAuthor" no-nav/>
          </q-menu>
        </q-btn>
        <q-btn v-show="users.size > 0" no-wrap no-caps color="negative" icon="fas fa-user-minus" label="Clear (show all users)" style="width: 100%;" @click="users.clear()" />
        <q-table>
          <template v-slot:header>
            <q-btn-toggle v-model="userFilterType"
            :options="[{label: 'Only these users', value: 'include'},{label: 'None of these users', value: 'exclude'}]"
                          push
                          @update:model-value="filtersModified = true">
            </q-btn-toggle>
          </template>
          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td>
                <q-avatar v-if="props.row.author.isChatSponsor"
                          icon="fas fa-dollar-sign" size="sm" font-size="1.4rem"
                          class="badge-chat badge-sub col-sm">
                  <q-tooltip>
                    channel member
                  </q-tooltip>
                </q-avatar>
              </q-td>
              <q-td>
                <author :author="props.row.author"/>-->
              </q-td>
            </q-tr>
          </template>
        </q-table>
<!--        <q-list>-->
<!--          <q-item v-for="[channelId, author] in users" :key="channelId">-->
<!--            <q-chip removable @remove="removeAuthor(channelId)">-->
<!--            </q-chip>-->
<!--          </q-item>-->
<!--        </q-list>-->
      </q-expansion-item>
      <q-expansion-item header-class="expand-header" class="col-auto" v-model="messageTypesExpanded" dense dense-toggle label="Message Types" icon="filter_list" :caption="typesCaption">
        <q-option-group v-model="messageTypes" :options="messageOptions" type="checkbox" @update:model-value="filtersModified = true"/>
      </q-expansion-item>
      <q-expansion-item header-class="expand-header" class="col-auto" v-model="datesExpanded" dense dense-toggle label="Date/Time Range" icon="history">
        <range-picker class="row" ref="rangePicker" @modified="filtersModified = true"/>
      </q-expansion-item>
      <q-expansion-item header-class="expand-header" class="col-auto" v-model="userTypesExpanded" dense dense-toggle label="User Types" icon="manage_accounts">
        <q-card class="bg-warning text-dark">
          <q-card-section>
            NOTE: Setting a user type will hide all Super Chats, Super Stickers, and New Members
          </q-card-section>
        </q-card>
          <q-btn-toggle v-model="isSponsor"
                        :options="[
                          {label: 'Plebs-only',value: 'false',},
                          {label: 'Members-only',value: 'true'}]"
                        @clear="isSponsor = 'ignore'"
                        clearable
                        push
                        @update:model-value="filtersModified = true"
                        class="user-type-toggle"
                        spread rounded no-caps no-wrap/>
        <q-btn-toggle v-model="isModerator"
                      :options="[
                          {label: 'Chatters-only',value: 'false',},
                          {label: 'Mods-only',value: 'true'}]"
                      @clear="isModerator = 'ignore'"
                      clearable
                      push
                      @update:model-value="filtersModified = true"
                      class="user-type-toggle"
                      spread rounded no-caps no-wrap/>
        <q-btn-toggle v-model="isVerified"
                      :options="[
                          {label: 'Unverified-only',value: 'false',},
                          {label: 'Verified-only',value: 'true'}]"
                      @clear="isVerified = 'ignore'"
                      clearable
                      push
                      @update:model-value="filtersModified = true"
                      class="user-type-toggle"
                      spread rounded no-caps no-wrap/>
      </q-expansion-item>
      <!--                      color="grey-9"-->
      <!--                      text-color="grey-3"-->
      <!--                      toggle-color="positive"-->
      <div style="margin-top: auto">
        <span>
          <q-checkbox v-model="autoLoad" label="Autoload"/>
          <q-checkbox v-model="autoScroll" label="Autoscroll"/>
        </span>
      </div>
      <q-page-sticky v-show="filtersModified" position="bottom-right" :offset="[10, 10]">
        <q-btn fab @click="updateFilters" color="positive" label="Apply" icon="refresh"/>
      </q-page-sticky>
    </q-drawer>
    <q-page-container style="padding-top: 0">
      <filtered-history :filters="filters" ref="history" @auth-error="authError" @autoscroll-disabled="autoScroll = false"/>
    </q-page-container>
  </q-layout>
</template>
<script>
import {defineComponent, nextTick, ref} from 'vue'
import FilteredHistory from "components/FilteredHistory";
import ApiKeyInput from "components/ApiKeyInput";
import RangePicker from "components/RangePicker";
import ApiKeyDialog from "layouts/ApiKeyDialog";
import BetterUserSearch from "components/BetterUserSearch";
import Author from "components/Author";

export default defineComponent({
  name: "FilterLayout",
  components: {Author, BetterUserSearch, ApiKeyDialog, RangePicker, ApiKeyInput, FilteredHistory},
  data() {
    return {
      filters: {},
    }
  },
  setup() {
    return {
      userFilterType: ref('include'),
      userTypesExpanded: ref(true),
      messageTypesExpanded: ref(true),
      datesExpanded: ref(false),
      usersExpanded: ref(true),
      autoLoad: ref(false),
      autoScroll: ref(true),
      isSponsor: ref('ignore'),
      isModerator: ref('ignore'),
      isVerified: ref('ignore'),
      isOwner: ref('ignore'),
      filtersModified: ref(false),
      apikeyDialog: ref(false),
      rangePicker: ref(null),
      messageTypes: ref([]),
      userTypes: ref([]),
      users: ref(new Map()),
      typesCaption: ref(''),
      messageOptions: [
        {
          label: "Super Chats ($$$)",
          icon: "filter_list",
          value: "superChat"
        },{
          label: "Text Messages",
          value: "textMessage"
        },{
          label: "New Members",
          value: "newSponsor"
        },{
          label: "Super Stickers",
          value: "superSticker"
        }
      ],
      drawerLeft: ref(true),
    }
  },
  mounted() {
    if (this.autoScroll) this.$refs.history.startAutoScroll();
    this.setFiltersFromUrl();
  },
  watch: {
    autoLoad(value) {
      console.log(`autoload: ${value}`)
      if (value) {
        this.$refs.history.startAutoLoad()
      } else {
        this.$refs.history.stopAutoLoad()
      }
    },
    autoScroll(value) {
      console.log(`autoscroll: ${value}`)
      if (value) {
        this.$refs.history.startAutoScroll()
      } else {
        this.$refs.history.stopAutoScroll()
      }
    }
  },
  created() {
    console.log("filtered layout create")
    if (this.$store.state.apikey.apikey.length === 0) {
      const localKey = localStorage.getItem('apikey')
      if (localKey) {
        this.$store.commit('apikey/setApikey', localKey)
      } else {
        console.log("api key was empty on load")
      }
    }
    // console.log(this.$route.query)

  },
  methods: {
    addAuthor(author) {
      this.filtersModified = true
      this.users.set(author.channelId, author)
      // console.log(`there are ${this.users.size} items`)
    },
    removeAuthor(channelId) {
      console.log(`removing author: ${channelId}`)
      this.filtersModified = true
      this.users.delete(channelId)
    },
    authError() {
      console.log('received auth error emit')
      this.$refs.apiKeyDialog.show();
    },
    toggleSearch() {
      this.drawerLeft = !this.drawerLeft
    },
    updateCaptions() {
      if (this.messageTypes.length === this.messageOptions.length) {
        this.typesCaption = ''
      } else if (this.messageTypes.length === 0) {
        this.typesCaption = "you have to select at least one type..."
      } else {
        this.typesCaption = this.messageTypes.join(', ')
      }
    },
    getFilters() {
      const result = {filters: {}, sort: {timestamp: -1}};
      // console.log(this.messageTypes)
      const beforeTimestamp = this.rangePicker?.getBeforeTimestamp();
      const afterTimestamp = this.rangePicker?.getAfterTimestamp();
      if (beforeTimestamp || afterTimestamp) {
        // console.log("had at least one timestamp filter")
        result.filters.timestamp = {
          "$lte": beforeTimestamp,
          "$gte": afterTimestamp,
        };
        if (!beforeTimestamp) delete result.filters.timestamp.$lte;
        if (!afterTimestamp) delete result.filters.timestamp.$gte;
      }

      if (this.users.size) {
        result.filters['author.channelId'] = {
          $in: Array.from(this.users.keys())
        }
      }
      if (this.messageTypes.length !== this.messageOptions.length) {
        result.filters.type = {"$in": this.messageTypes}; // remove undefined/null values
      }

      if (this.isSponsor !== 'ignore') result.filters['author.isChatSponsor'] = this.isSponsor === 'true'
      if (this.isModerator !== 'ignore') result.filters['author.isChatModerator'] = this.isModerator === 'true'
      if (this.isVerified !== 'ignore') result.filters['author.isVerified'] = this.isVerified === 'true'
      return result
    },
    updateFilters() {
      this.filtersModified = false;
      console.log("updating filters");
      this.filters = this.getFilters();
      this.$refs?.history?.newFilters(this.filters);
      this.updateCaptions();
    },

    setFiltersFromUrl() {
      console.log("getting filters from url")
      const query = this.$route.query
      if (query.types) {
        this.messageTypes.splice(0, this.messageTypes.length)
        if (Array.isArray(query.types)) {
          // console.log("was array")
          query.types.forEach(n => this.messageTypes.push(n))
        } else {
          // console.log("not array")
          this.messageTypes.push(query.types)
        }
      } else {
        this.messageOptions.forEach(n => this.messageTypes.push(n.value))
      }
      if (query.isSponsor != null) {
        console.log("is sponsor")
        this.isSponsor = query.sponsor.toLowerCase() === "true" ? "true" : "false";
      }
      // if (query.isSponsor !== 'ignore') this.isSponsor = query.isSponsor === "true";
      // if (query.isOwner !== 'ignore') this.isOwner = query.isOwner === "true";
      // if (query.isVerified !== 'ignore') this.isVerified = query.isVerified === "true";

      console.log(this.messageTypes)
      nextTick(this.updateFilters)
    }
  },
})
</script>

<style lang="sass">
.expand-header
  background: $grey-9
  //margin-left: 10px

//.user-type-toggle
//  toggle-color:
</style>
