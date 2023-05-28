<template>
  <b-form-checkbox
    v-model="computedLocalValue"
    v-bind="$attrs"
    :value="bool ? true : checkedValue"
    :data-testid="dataTestid"
    :unchecked-value="bool ? false : uncheckedValue"
    @change="$emit('change', $event)"
  >
    <slot name="placeholder">{{ $attrs.placeholder }}</slot>
  </b-form-checkbox>
</template>

<script>
import { BFormCheckbox } from 'bootstrap-vue';

export default {
  components: {
    BFormCheckbox,
  },
  props: {
    value: {
      type: [String, Number, Array, Object, Boolean],
      default: null,
    },
    checkedValue: {
      type: [String, Number, Boolean],
      default: 1,
    },
    uncheckedValue: {
      type: [String, Number, Boolean],
      default: 0,
    },
    bool: {
      type: Boolean,
      default: false,
    },
    testid: {
      type: String,
      default: '',
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
    dataTestid() {
      return this.testid ? `cb-${this.testid}` : '';
    },
  },
  methods: {},
};
</script>
