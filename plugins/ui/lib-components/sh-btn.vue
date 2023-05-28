<template>
  <b-button
    v-bind="$attrs"
    :data-testid="computedDataTestid"
    :disabled="disabled || isLoading"
    :class="{ loading: isLoading }"
    @click="onClick"
  >
    <b-spinner v-if="isLoading" small />
    <slot>{{ title }}</slot>
  </b-button>
</template>

<script>
import { BSpinner, BButton } from 'bootstrap-vue';
import CyrillicToTranslit from 'cyrillic-to-translit-js';

const cyrillicToTranslit = new CyrillicToTranslit();

export default {
  name: 'ShBtn',
  components: { BSpinner, BButton },
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    vid: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
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
    computedDataTestid() {
      let id = '';
      if (this.testid) {
        id = this.testid;
      } else if (this.vid) {
        id = this.vid;
      } else if (this.title) {
        id = cyrillicToTranslit.transform(this.title, '_').toLowerCase();
      }
      if (id) return `btn-${id}`;
      return '';
    },
    isLoading() {
      return this.loading;
    },
  },
  watch: {},
  methods: {
    onClick(e) {
      if (this.isLoading) return;
      this.$emit('click', e);
    },
  },
};
</script>
