<template>
  <q-layout class="main-layout" view="hHh lpR fFf" style="display: flex">
    <q-header height-hint="98">
      <q-toolbar class="toolbar">
        <q-btn
          dense
          flat
          round
          icon="mdi-menu"
          @click="this.drawerLeft = !this.drawerLeft"
        />
        <q-toolbar-title
          >filtered ytchat <q-icon name="mdi-filter"
        /></q-toolbar-title>
        <api-key-input />
      </q-toolbar>
    </q-header>
    <q-drawer
      :width="200"
      :breakpoint="500"
      show-if-above
      v-model="drawerLeft"
      side="left"
      :persistent="false"
    >
      <q-expansion-item
        header-class="expand-header"
        class="col-auto"
        v-model="usersExpanded"
        dense
        dense-toggle
        label="Users"
        icon="mdi-account-search"
      >
        <q-btn
          no-wrap
          no-caps
          color="primary"
          icon="mdi-account-plus"
          label="Add users to filter"
          style="width: 100%"
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
          style="width: 100%"
          @click="users.clear()"
        />
        <q-btn-toggle
          v-show="this.users.size"
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
      </q-expansion-item>
      <q-expansion-item
        header-class="expand-header"
        class="col-auto"
        v-model="messageTypesExpanded"
        dense
        dense-toggle
        label="Message Types"
        icon="mdi-format-list-bulleted-type"
        :caption="typesCaption"
        cap
      >
        <q-option-group
          v-model="messageTypes"
          :options="messageOptions"
          type="checkbox"
          @update:model-value="modified"
        />
      </q-expansion-item>
      <q-expansion-item
        header-class="expand-header"
        class="col-auto"
        v-model="datesExpanded"
        dense
        dense-toggle
        label="Date/Time Range"
        icon="mdi-history"
      >
        <range-picker class="row" ref="rangePicker" @modified="modified" />
      </q-expansion-item>
      <q-expansion-item
        header-class="expand-header"
        class="col-auto"
        v-model="userTypesExpanded"
        dense
        dense-toggle
        label="User Types"
        icon="mdi-account-details"
      >
        <q-card class="bg-warning text-dark" v-show="userTypes.length">
          <q-card-section>
            NOTE: Setting a user type will hide all Super Chats, Super Stickers,
            and New Members
          </q-card-section>
        </q-card>
        <q-btn-toggle
          no-caps
          v-model="userTypeFilterType"
          push
          @update:model-value="modified"
          v-show="userTypes.length"
          :options="[
            { label: 'Any of these types', value: 'include' },
            { label: 'None of these types', value: 'exclude' },
          ]"
        />
        <q-option-group
          v-model="userTypes"
          :options="userTypeOptions"
          type="checkbox"
          @update:model-value="modified"
        />
      </q-expansion-item>
      <q-input
        filled
        ref="messageInput"
        label="Message text (regex)"
        :rules="[validMessageRegex]"
        v-model="messageRegex"
      />
      <q-page-sticky
        v-show="filtersModified"
        position="bottom-right"
        :offset="[10, 10]"
      >
        <q-btn
          fab
          @click="setUrlFromFilters"
          color="positive"
          label="Apply"
          icon="refresh"
        />
      </q-page-sticky>
    </q-drawer>
    <q-page-container style="flex-grow: 1; display: flex">
      <filtered-history
        class="row history-box"
        :filters="filters"
        ref="history"
      />
    </q-page-container>
  </q-layout>
</template>
<script>
import { defineComponent, nextTick, ref } from "vue";
import FilteredHistory from "components/FilteredHistory";
import ApiKeyInput from "components/ApiKeyInput";
import RangePicker from "components/RangePicker";
import BetterUserSearch from "components/BetterUserSearch";
import AuthorComponent from "components/Author";

export default defineComponent({
  name: "FilterLayout",
  components: {
    AuthorComponent,
    BetterUserSearch,
    RangePicker,
    ApiKeyInput,
    FilteredHistory,
  },
  data() {
    return {
      filters: {},
    };
  },
  watch: {
    messageTypesExpanded() {
      this.updateCaptions();
    },
    userTypes() {
      this.modified();
    },
  },
  setup() {
    const urlKeyMap = {
      "author.channelId": "cid",
      "author.isChatSponsor": "sponsor",
      "author.isChatModerator": "mod",
      "author.isVerified": "verified",
    };
    function renameQueryFilters(obj) {
      const keyValues = Object.keys(obj).map((key) => {
        const newKey = urlKeyMap[key] || key;
        return { [newKey]: obj[key] };
      });
      return Object.assign({}, ...keyValues);
    }
    return {
      renameQueryFilters,
      userFilterType: ref("include"),
      userTypeFilterType: ref("include"),
      userTypesExpanded: ref(true),
      messageTypesExpanded: ref(false),
      datesExpanded: ref(false),
      usersExpanded: ref(true),
      isSponsor: ref("ignore"),
      isModerator: ref("ignore"),
      isVerified: ref("ignore"),
      isOwner: ref("ignore"),
      filtersModified: ref(false),
      apikeyDialog: ref(false),
      rangePicker: ref(null),
      messageTypes: ref([]),
      messageRegex: ref(""),
      userTypes: ref([]),
      users: ref(new Map()),
      drawerLeft: ref(true),
      typesCaption: ref(""),
      messageOptions: [
        { label: "Super Chats ($$$)", value: "superChat" },
        { label: "Text Messages", value: "textMessage" },
        { label: "New Members", value: "newSponsor" },
        { label: "Super Stickers", value: "superSticker" },
      ],
      userTypeOptions: [
        { label: "Moderator", value: "author.isChatModerator" },
        { label: "Verified", value: "author.isVerified" },
        { label: "Member (Sub)", value: "author.isChatSponsor" },
      ],
    };
  },
  mounted() {
    this.setFiltersFromUrl();
  },
  methods: {
    setUrlFromFilters() {
      console.log("getting URL from filters");
      const filters = this.getFilters().filters;
      delete filters["$or"];
      if (this.userTypes.length) {
        console.log("manually adding user type");
        this.userTypes.forEach((e) => (filters[e] = true));
      }
      const queryFilters = this.renameQueryFilters(filters);
      if (this.users.size) {
        console.log("manually adding users");
        queryFilters["cid"] = Array.from(this.users.keys());
      }
      if (this.userFilterType !== "include") queryFilters["ufType"] = "ex";
      if (this.userTypeFilterType !== "include") queryFilters["utfType"] = "ex";

      console.log(queryFilters);
      this.$router.push({ query: queryFilters });
      this.updateFilters(); // TODO: remove
    },
    setFiltersFromUrl() {
      console.log("getting filters from url");
      const query = this.$route.query;
      if (query.types) {
        this.messageTypes.splice(0, this.messageTypes.length);
        if (Array.isArray(query.types))
          query.types.forEach((n) => this.messageTypes.push(n));
        else this.messageTypes.push(query.types);
      }

      if (query.cid) {
        this.users.clear();
        if (Array.isArray(query.cid))
          query.cid.forEach((u) =>
            this.users.set(u, { name: "no name, user from URL", channelId: u }),
          );
        else
          this.users.set(query.cid, {
            name: "no name, user from URL",
            channelId: query.cid,
          });
      } else
        this.messageOptions.forEach((n) => this.messageTypes.push(n.value));
      if (query.sponsor != null)
        this.isSponsor = query.sponsor.toLowerCase() === "true";
      if (query.verified != null)
        this.isVerified = query.verified.toLowerCase() === "true";

      if (query.utfType?.startsWith("ex")) this.userTypeFilterType = "exclude";
      if (query.ufType?.startsWith("ex")) this.userFilterType = "exclude";

      nextTick(this.updateFilters);
    },
    modified() {
      // console.log('modified')
      this.filtersModified = true;
      this.updateCaptions();
      this.$refs.messageInput.resetValidation();
    },
    addAuthor(author) {
      this.users.set(author.channelId, author);
      this.modified();
    },
    removeAuthor(channelId) {
      this.users.delete(channelId);
      this.modified();
    },
    // authError() {this.$refs.apiKeyDialog.show()},
    updateCaptions() {
      if (this.messageTypesExpanded) this.typesCaption = "";
      else if (this.messageTypes.length === this.messageOptions.length)
        this.typesCaption = "all";
      else if (this.messageTypes.length === 0)
        this.typesCaption = "select at least one msg type";
      else this.typesCaption = this.messageTypes.join(", ");
    },
    validMessageRegex() {
      if (this.messageRegex.length === 0) return true;
      if (
        this.rangePicker?.getAfterTimestamp() ||
        this.rangePicker?.getBeforeTimestamp()
      )
        return true;
      return "please set date range to use message regex (performance reasons)";
    },
    getFilters() {
      const result = { filters: {}, sort: { timestamp: -1 } };
      const beforeTimestamp = this.rangePicker?.getBeforeTimestamp();
      const afterTimestamp = this.rangePicker?.getAfterTimestamp();
      if (beforeTimestamp || afterTimestamp) {
        result.filters.timestamp = {
          $lte: beforeTimestamp,
          $gte: afterTimestamp,
        };
        if (!beforeTimestamp) delete result.filters.timestamp.$lte;
        if (!afterTimestamp) delete result.filters.timestamp.$gte;
      }

      if (this.users.size) {
        if (this.userFilterType === "exclude")
          result.filters["author.channelId"] = {
            $nin: Array.from(this.users.keys()),
          };
        else
          result.filters["author.channelId"] = {
            $in: Array.from(this.users.keys()),
          };
      }

      if (this.userTypes.length) {
        const filterBool = this.userTypeFilterType !== "exclude";
        // console.log(`user types: ${this.userTypes}`)
        result.filters["$or"] = this.userTypes.map((t) => {
          console.log(t);
          const type = {};
          type[t] = filterBool;
          return type;
        });
      }

      if (
        this.messageTypes.length &&
        this.messageTypes.length !== this.messageOptions.length
      ) {
        result.filters.type = { $in: this.messageTypes };
      }
      if (this.messageRegex.length && this.validMessageRegex()) {
        result.filters.message = { $regex: this.messageRegex };
      }
      return result;
    },
    updateFilters() {
      this.filtersModified = false;
      console.log("updating filters");
      this.filters = this.getFilters();
      console.log(this.filters);
      this.$refs?.history?.newFilters(this.filters);
      this.updateCaptions();
    },
  },
});
</script>

<style lang="sass">
.expand-header
  background: $grey-9

.history-box
  flex-grow: 1
  min-height: 400px
  min-width: 400px
</style>
