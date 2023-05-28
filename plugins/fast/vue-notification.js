import Vue from "vue";
import Notifications from "vue-notification";

Vue.use(Notifications);

export default ({ app }) => {
  app.$notify = (...params) => Vue.prototype.$notify(...params);
};
