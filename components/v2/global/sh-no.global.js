import Vue from "vue";
import Cookies from "js-cookie";

// document.cookie = "app.debug=1";

Vue.component("sh-no", {
  functional: true,
  render(createElement, context) {
    const isDev = !["production"].includes(process.env.NODE_ENV);
    // const env = process.env.DISABLE_DEBUG;

    const data = {
      props: {
        name: "sh-no",
        css: false,
      },
      style: { background: "rgb(255 59 59 / 35%)", padding: "2px" },
      on: {
        "!click": (event) => {
          if (!isDev) {
            context.parent.handleError(new Error("отсутствует API"));
            event.stopPropagation();
            event.preventDefault();
            return;
          }
        },
      },
    };

    return createElement("div", data, context.children);
  },
});
