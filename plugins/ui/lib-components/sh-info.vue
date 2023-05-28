<template>
  <div class="shInfo">
    <i-info :id="`popover-${id}`" class="shInfo__icon"></i-info>
    <b-popover :target="`popover-${id}`" triggers="hover focus" custom-class="shPopoverInfo">
      <slot></slot>
    </b-popover>
  </div>
</template>

<script>
import iInfo from '../components/icons/info';
import {  BPopover } from 'bootstrap-vue';
export default {
  name: "ShInfo",
  components: { BPopover, iInfo },
  data() {
    return { id: null };
  },
  computed: {},
  mounted() {
    this.id = this._uid;
  },
  methods: {},
};
</script>

