import Vue from "vue";
import layoutHelpers from "~/mixins/fast/layoutHelpers";
import Stats from "stats.js";

Vue.mixin(layoutHelpers);

export default (ctx) => {
  ctx.store.dispatch("INIT", ctx);

  if (ctx.isDev) {
    var stats = new Stats();
    stats.showPanel(1); // 0: fps, 1: ms, 2: mb, 3+: custom
    var e = document.body.appendChild(stats.dom);
    e.style.top = "auto";
    e.style.bottom = "0px";
    e.style.left = "100px";

    requestAnimationFrame(function loop() {
      stats.update();
      requestAnimationFrame(loop);
    });
  }
};
