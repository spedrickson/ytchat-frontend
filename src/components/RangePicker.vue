<template>

  <div class="fit column no-wrap justify-start items-start content-around" style="width: 100%">
    <div class="row items-end">
      <date-time-picker @modified="modified" class="col" ref="afterPicker" label="After:"/>
    </div>
    <div class="row">
      <date-time-picker @modified="modified" class="col" ref="beforePicker" label="Before:"/>
    </div>
  </div>
</template>

<script>
import {defineComponent, ref} from "vue";
import DateTimePicker from "components/DateTimePicker";
import {date} from 'quasar'

const mask = "YYYY-MM-DD HH:mm";

export default defineComponent({
  name: "RangePicker",
  components: {DateTimePicker},
  emits: ['modified'],
  setup() {
    return {
      beforePicker: ref(null),
      afterPicker: ref(null),
    }
  },
  methods: {
    getBeforeTimestamp() {
      // console.log(result);
      return this.stringToTimestamp(this.beforePicker.getValue())
    },
    getAfterTimestamp() {
      // console.log(result)
      return this.stringToTimestamp(this.afterPicker.getValue())
    },
    modified() {
      this.$emit('modified')
    },
    stringToTimestamp(val) {
      if (val && val.length > 0) {
        let datetime;
        if (val.length === mask.length && /\d\d\d\d-\d\d-\d\d \d\d:\d\d/) {
          console.log("matched mask")
          datetime = date.extractDate(val, mask)
        } else {
          datetime = Date.parse(val)
        }
        // console.log(dateStr.valueOf())
        return datetime.valueOf()
      } else {
        return null
      }
    }
  }
});
</script>
<style scoped lang="sass">
.range-icons
  justify-content: center
</style>
