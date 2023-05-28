<template>
  <b-form-radio-group
    v-model="computedLocalValue"
    :data-testid="dataTestid"
    class="rb-group"
    :class="{ 'is-invalid': $attrs.state === false, 'is-valid': $attrs.state === true }"
    v-bind="$attrs"
    @change="$emit('change', $event)"
  >
    <div v-for="(item, key) in compOptions" :key="key" :data-testid="testid ? `rb-option-${item.value}-${testid}` : ''">
      <b-form-radio :value="item.value">{{ item.text }}</b-form-radio>
    </div>
  </b-form-radio-group>
</template>

<script>
import { BFormRadioGroup, BFormRadio } from 'bootstrap-vue';

export default {
  components: {
    BFormRadioGroup,
    BFormRadio,
  },
  props: {
    value: {
      type: [String, Number, Array, Object, Boolean],
      default: () => [],
    },
    options: {
      type: Array,
      default: () => {},
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

    compOptions() {
      if (Array.isArray(this.options)) {
        return this.options.map((item) => ({
          text: item[this.$attrs['item-name'] || 'name'],
          value: item[this.$attrs['item-id'] || 'id'],
        }));
      } else {
        return this.options;
      }
    },
    dataTestid() {
      return this.testid ? `rb-${this.testid}` : '';
    },
  },
  methods: {},
};
</script>
