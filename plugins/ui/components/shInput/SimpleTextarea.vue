<template>
  <b-form-textarea
    v-model="computedLocalValue"
    v-bind="$attrs"
    :class="{ focus: isFocus, 'was-focused': wasIsFocus }"
    trim
    :data-testid="dataTestid"
    @blur="onBlur"
    @focus="onFocus"
    @change="$emit('change', $event)"
    @update="$emit('update', $event)"
  />
</template>

<script>
import { BFormTextarea } from 'bootstrap-vue';

export default {
  components: {
    BFormTextarea,
  },
  props: {
    value: {
      type: [String, Number],
      default: null,
    },
    testid: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      isFocus: false,
      wasIsFocus: false,
      timer: null,
    };
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
      return this.testid ? `textarea-${this.testid}` : '';
    },
  },
  methods: {
    onBlur({ target }) {
      this.$emit('blur', event);
      this.isFocus = false;
      if (target.classList.contains('is-valid')) {
        this.wasIsFocus = true;
        this.timer = setTimeout(() => {
          this.wasIsFocus = false;
        }, 5000);
      }
    },
    onFocus(event) {
      this.$emit('focus', event);
      this.isFocus = true;
      if (this.timer) {
        clearTimeout(this.timer);
        this.wasIsFocus = false;
      }
    },
  },
};
</script>
