import Vue from "vue";
import { ShInput, ShBtn, ShInfo } from "./ui/lib-components";

Vue.component("ShInput", ShInput);
Vue.component("ShBtn", ShBtn);
Vue.component("ShInfo", ShInfo);

// import "~/components/v2/global/sh-debug.global.js";
// import "~/components/v2/global/sh-no.global.js";
// import shPopover from "~/components/v2/global/sh-popover.global";
// Vue.component("shPopover", shPopover);

import { VBTooltipPlugin } from "bootstrap-vue";
Vue.use(VBTooltipPlugin);

import commonUploadFiles from "~/components/v2/global/uploads/commonUploadFiles";
Vue.component("commonUploadFiles", commonUploadFiles);

import handleError from "~/utils/v2/handleError";
Vue.mixin({
  methods: {
    handleSuccess(message) {
      this.notify({ type: "success", text: message });
    },

    handleError(error, element, callback) {
      if (this.$axios.isCancel(error)) return;

      const { $notify } = this;
      handleError(error, { $notify, callback }, this);

      let el = element || this?.$el;
      if (typeof el?.querySelector === "function") {
        el = el?.querySelector("[aria-invalid=true]");
        if (el) el.scrollIntoView({ block: "center", behavior: "smooth" });
      }
    },
  },
});
