const isDev = ["development"].includes(process.env.NODE_ENV);
const isTest = process.env.NODE_ENV === "test";
const isStaging = process.env.NODE_ENV === "staging";
const isProd = process.env.NODE_ENV === "production";

const bootstrapVueConfig = require("./config/v2/bootstrap-vue");

export default {
  ssr: false,

  env: {
    liveTexID: process.env.liveTexID,
    isDev,
    isStaging,
    isProd,
    NUXT_API_URL: process.env.NUXT_API_URL,
    // THEME: isDev ? THEME : null,
    // ws_branch: isProd ? 'tk-v2' : config.ws_branch
  },
  publicRuntimeConfig: {
    isDev,
    isStaging,
    isProd,
  },

  server: {
    port: process.env.PORT || 3001,
    host: process.env.HOST || "localhost",
  },

  head: {
    title: "FAST_MI",
    htmlAttrs: {
      dir: "ltr",
      lang: "ru",
    },
    bodyAttrs: {
      class: [isDev ? "isDev" : null, isStaging ? "isStaging" : null, isProd ? "isProd" : null]
        .filter(Boolean)
        .join(" "),
    },
    meta: [
      { charset: "utf-8" },
      { "http-equiv": "x-ua-compatible", content: "IE=edge,chrome=1" },
      //{ 'http-equiv': 'Content-Security-Policy', content: 'upgrade-insecure-requests' },
      { hid: "description", name: "description", content: "" },
      {
        name: "viewport",
        content: "width=device-width,initial-scale=1,user-scalable=no,minimum-scale=1,maximum-scale=1",
      },
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    script: [],
  },

  css: ["@/assets/scss/app.scss"],

  plugins: [
    "@/plugins/vee-validate",
    "~plugins/fast-ui-elements.js",
    // v2
    "~plugins/fast/nuxt-client-init",
    "~plugins/fast/app",
    "~plugins/fast/vue-notification",
    "~plugins/v2/util/axios",
  ],

  components: [
    {
      path: "~/components", // will get any components nested in let's say /components/test too
      pathPrefix: false,
      extensions: ["vue"],
    },

    {
      // path: "~/components-icons",
      path: "~/components-icons/i",
      prefix: "i",
      extensions: ["vue"],
    },
  ],

  buildModules: ["@nuxtjs/style-resources", "@nuxtjs/google-fonts", "@nuxtjs/svg"],

  styleResources: {
    scss: ["~assets/scss/mixins.scss", "~assets/scss/vars.scss"],
  },

  googleFonts: {
    families: {
      Roboto: [300, 400, 500],
    },
  },

  modules: [
    "nuxt-moment",
    "@nuxtjs/axios",
    "@nuxt/content",
    "@nuxtjs/auth-next",
    // "@nuxtjs/yandex-metrika",
    // v2
    [
      "bootstrap-vue/nuxt",
      {
        bootstrapCSS: false,
        bootstrapVueCSS: false,
        config: bootstrapVueConfig,
      },
    ],
    "portal-vue/nuxt",
    "@nuxtjs/svg",
  ].filter(Boolean),

  axios: {
    baseURL: process.env.NUXT_API_URL,
  },
  auth: {
    localStorage: false,
    strategies: {
      local: {
        token: {
          maxAge: 3600 * 24 * 30,
          name: "Authorization",
          type: "",
        },
        endpoints: {
          login: {
            url: "api/auth/login",
            method: "post",
            propertyName: "token",
          },
          user: {
            url: "api/me",
            method: "get",
            // property: "",
          },
          logout: false,
        },
      },
    },
    redirect: {
      home: false,
      login: "/auth/login",
    },
  },

  router: {
    extendRoutes(routes, resolve) {},
  },
  build: {
    transpile: ["vee-validate/dist/rules"],
  },
  target: "static",
};
