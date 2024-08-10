<template>
  <q-card style="padding-top: 100px">
    <q-card-section>
      <div class="text-center" v-if="comments.length === 0">
        <h2>No mod comments</h2>
      </div>
      <q-infinite-scroll
        class="q-pa-md"
        @load="fetchComments"
        ref="commentScroll"
        reverse
      >
        <div class="q-py-sm" v-for="(comment, index) in comments" :key="index">
          <span>
            {{ agoString(comment._id) }}
            <q-tooltip>
              {{ dateFromMongoId(comment._id) }}
            </q-tooltip>
          </span>
          <span> - {{ comment.modName }} - </span>
          <span>
            {{ comment.text }}
          </span>
        </div>
      </q-infinite-scroll>
    </q-card-section>
    <q-card-actions>
      <q-input
        v-model="text"
        style="width: 100%"
        filled
        autogrow
        type="textarea"
        label="add comment about user..."
      />
      <q-btn
        @click="insertComment"
        :loading="loadingNewMessages"
        label="submit comment"
        class="refresh-btn"
      />
    </q-card-actions>
  </q-card>
</template>

<script>
import { defineComponent, ref } from "vue";
import { api } from "boot/axios.js";

const humanizerOptions = {
  spacer: "",
  delimiter: " ",
  largest: 2,
  round: true,
};
const shortHumanizer = require("humanize-duration").humanizer({
  language: "shortEn",
  languages: {
    shortEn: {
      y: () => "y",
      mo: () => "mo",
      w: () => "w",
      d: () => "d",
      h: () => "h",
      m: () => "m",
      s: () => "s",
    },
  },
});

export default defineComponent({
  name: "ModComments",
  // components: {Message},

  data() {
    return {
      comments: [],
      text: ref(""),
      channelID: ref(null),
      messageID: ref(null),
      loading: false,
      loadingNewMessages: false,
    };
  },
  mounted() {
    // console.log("history mounted")
    this.channelID = this.channelID ?? this.$route.params.channelID;
  },
  created() {
    // console.log("history created")
    this.channelID = this.channelID ?? this.$route.params.channelID;
  },
  updated() {
    // console.log("mod comments updated")
    if (this.$route.params.channelID !== this.channelID) {
      this.channelID = this.$route.params.channelID;
      console.log("channelID changed, reloading mod comments");
      this.comments.splice(0, this.comments.length); // empty array
      this.$refs.commentScroll.reset();
    }
    this.$refs.commentScroll.resume();
  },
  methods: {
    dateFromMongoId(id) {
      return new Date(parseInt(id.substring(0, 8), 16) * 1000);
    },
    agoString(id) {
      return shortHumanizer(
        this.dateFromMongoId(id) - Date.now(),
        humanizerOptions,
      );
    },
    insertComment() {
      const url = `/channel/${this.channelID}/comments?key=${this.apikey()}`;
      api.post(url, { text: this.text });
      this.$refs.commentScroll.reset();
      this.$refs.commentScroll.resume();
    },

    fetchComments(index, done) {
      if (this.loading) {
        console.log("tried to double load");
        return;
      }
      this.loading = true;
      this.comments.splice(0, this.comments.length);
      const url = `/channel/${this.channelID}/comments?key=${this.apikey()}`;
      // console.log(`fetching from URL: ${url}`)
      api
        .get(url)
        .then((data) => {
          if (data.data.length > 0) {
            // console.log("received some data")
            this.comments.push(...data.data);
            this.$refs.commentScroll.stop();
            done();
          } else {
            console.log("reached end of user mod comments");
            this.$refs.commentScroll.stop();
          }
        })
        .catch((reason) => {
          console.log(`error when trying to query author info: ${reason}`);
          if (reason.response.status === 401) {
            console.log("authentication error, please enter api key");
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },

    apikey() {
      return this.$store.state.apikey.apikey;
    },
  },
});
</script>

<style scoped lang="sass">
.refresh-btn
  background: darkslategrey
  width: 100%
</style>
