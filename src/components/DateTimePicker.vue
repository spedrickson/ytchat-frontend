<template>
  <div style="max-width: 300px">
    <q-input
      clearable
      :label="label"
      filled
      v-model="localModelValue"
      debounce="250"
    >
      <template v-slot:append>
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
            <q-date v-model="localModelValue" mask="YYYY-MM-DD HH:mm" />
          </q-popup-proxy>
        </q-icon>
        <q-icon name="access_time" class="cursor-pointer">
          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
            <q-time
              v-model="localModelValue"
              mask="YYYY-MM-DD HH:mm"
              format24h
            />
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "DateTimePicker",
  props: ["label", "modelValue"],
  emits: ["update:modelValue"],
  computed: {
    localModelValue: {
      get() {
        return this.modelValue;
      },
      set(newValue) {
        this.$emit("update:modelValue", newValue);
      },
    },
  },
});
</script>
