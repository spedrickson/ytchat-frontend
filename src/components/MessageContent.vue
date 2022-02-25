<template>
  <span v-for="(item, index) in messageEx" :key=index>
<!--    <span v-if="item.hasOwnProperty('url')">-->
    <!--      {{ item.id }}-->
    <q-icon class="msg-img" :name="`img:${item.url}`" :alt="item.txt" size="1.4rem" v-if="item.hasOwnProperty('url')"/>
    <!--    </span>-->
    <!--    <span v-if="item.hasOwnProperty('url')">-->
    <!--      {{ item.txt }}-->
    <!--      &lt;!&ndash;      <q-icon class="msg-img" :name="`img:${item.url}`" size="1.6em">&ndash;&gt;-->
    <!--      &lt;!&ndash;        <q-tooltip>{{ item.txt }}</q-tooltip>&ndash;&gt;-->
    <!--      &lt;!&ndash;      </q-icon>&ndash;&gt;-->
    <!--    </span>-->
        <span v-else class="wrap">{{ item }}&nbsp;</span>
    <!--    <span class="wrap">{{ item }}&nbsp;</span>-->
  </span>
</template>

<script>
import {defineComponent} from "vue";
// TODO: re-enable emoji
export default defineComponent({
    name: "MessageContent",
    props: ['messageEx'],
    methods: {
      isEmoji(index) {
        const str = this.messageEx[index]
        const result = str.charAt(0) === ":" && str.charAt(str.length - 1) === ":"
        console.log(`was emoji: ${result}: ${str}`)
        return result
      }
    }
  }
);
</script>

<style scoped lang="sass">
//.msg-img
  //padding: 0
</style>
