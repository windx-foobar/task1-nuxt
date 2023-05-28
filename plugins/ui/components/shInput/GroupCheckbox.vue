<template>
  <b-form-checkbox-group
    v-model="computedLocalValue"
    text-field="name"
    value-field="id"
    v-bind="$attrs"
    @change="$emit('change', $event)"
  />
</template>

<script>
import { BFormCheckboxGroup } from 'bootstrap-vue';

export default {
  components: {
    BFormCheckboxGroup,
  },
  props: {
    value: {
      type: Array,
      default: () => [],
    },
    state: {
      default: null,
    },
  },
  data() {
    return {};
  },
  computed: {
    computedLocalValue: {
      get() {
        return this.value;
      },

      set(newValue) {
        this.$emit('input', newValue);
      },
    },
  },
  methods: {},
};
</script>
