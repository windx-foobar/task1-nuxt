<template>
  <div class="perfect-scrollbar">
    <slot></slot>
  </div>
</template>

<script>
// https://mdbootstrap.com/freebies/perfect-scrollbar/?utm_source=GitHub&utm_medium=PerfectScrollbar
import PerfectScrollbar from 'perfect-scrollbar';

export default {
  name: 'perfect-scrollbar',
  props: {
    options: {
      default: () => ({ wheelPropagation: false })
    },
    on: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    resetPs() {
      if (!this.$ps) return;
      this.$ps.destroy();
      this.$ps = null;
    }
  },
  updated() {
    if (this.on) {
      this.resetPs();
      this.$ps = new PerfectScrollbar(this?.$el, this.options);
    } else {
      if (!this.$ps) return;
      this.$ps.destroy();
      this.$ps = null;
    }
  },
  mounted() {
    if (this.on) {
      this.resetPs();
      this.$ps = new PerfectScrollbar(this?.$el, this.options);
    }
  }
};
</script>
