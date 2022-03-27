<template>
  <div style="max-width: 300px">
    <q-input clearable :label="label" filled v-model="dateTime" @update:model-value="valueUpdated" debounce="250">
      <template v-slot:append>
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy cover transition-show="scale" @hide="valueUpdated" transition-hide="scale" >
            <q-date v-model="dateTime" mask="YYYY-MM-DD HH:mm"/>
          </q-popup-proxy>
        </q-icon>
        <q-icon name="access_time" class="cursor-pointer">
          <q-popup-proxy cover transition-show="scale"  @hide="valueUpdated"  transition-hide="scale">
            <q-time v-model="dateTime" mask="YYYY-MM-DD HH:mm" format24h/>
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
  </div>
</template>

<script>
import {defineComponent} from "vue";
import {ref} from "vue";


export default defineComponent({
  name: "DateTimePicker",
  props: ["label"],
  emits: ['modified'],
  setup() {
    return {
      dateTime: ref('')
    }
  },
  methods: {
    getValue() {
      return this.dateTime
    },
    valueUpdated() {
      // console.log("value updated")
      this.$emit('modified')
    },
  }
})
</script>
