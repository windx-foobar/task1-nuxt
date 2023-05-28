<template>
  <b-popover v-bind="$attrs" ref="popover" @shown="shown" @hide="hide">
    <slot></slot>
  </b-popover>
</template>

<script>
import clickOutMixin from "@/mixins/v2/click-out";
import { contains, select } from "bootstrap-vue/src/utils/dom";

export default {
  mixins: [clickOutMixin],
  components: {},
  props: {},
  data() {
    return {
      popover: null,
      popoverId: null,
    };
  },
  methods: {
    isClickOut(evt) {
      return !contains(this.popover, evt.target);
    },
    whileOpenListen(isOpen) {
      this.listenForClickOut = isOpen;
    },
    clickOutHandler(evt) {
      this.$root.$emit("bv::hide::popover", this.popoverId);
    },
    shown(bvEventObj) {
      const popoverId = bvEventObj.componentId;
      const popover = select(`#${popoverId}`);
      this.popover = popover;
      this.popoverId = popoverId;
      this.whileOpenListen(true);
    },
    hide(bvEventObj) {
      this.whileOpenListen(false);
      this.popover = null;
      this.popoverId = null;
    },
  },
  mounted() {},
};
</script>
