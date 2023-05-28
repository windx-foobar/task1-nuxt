import Vue from "vue";
import Cookies from "js-cookie";

// document.cookie = "app.debug=1";

Vue.component("sh-debug", {
  functional: true,
  render(createElement, context) {
    var data = {
      props: {
        name: "sh-debug",
        css: false,
      },
      style: { background: "rgb(255 235 59 / 35%)", whiteSpace: "pre" },
    };
    const debug = Cookies.get("app.debug");
    const isDev = !["production"].includes(process.env.NODE_ENV);
    const env = process.env.DISABLE_DEBUG;

    return createElement("div", data, (debug || isDev) && !env ? context.children : []);
  },
});
