import Vue from "vue";
import { set, get, cloneDeep } from "lodash";

const breakpoints = {
  widthExtraSmall: 320,
  widthSmall: 640,
  widthTablet: 1024,
};

export const state = () => ({
  theme: "ipoteka",
  leftBarVisible: !!false,
  rightBarVisible: false,
  ...breakpoints,
  windowWidth: 0,
  settings: {},
  flashMessage: null,
});

export const getters = {
  leftBarVisible: (state) => state.leftBarVisible,
  rightBarVisible: (state) => state.rightBarVisible,
  theme: (state) => (process.env.THEME ? process.env.THEME : state.theme),
  isExtraSmall: (state) => state.windowWidth <= state.widthExtraSmall,
  isSmall: (state) => state.windowWidth <= state.widthSmall,
  isTablet: (state) => state.windowWidth <= state.widthTablet,
  isDesktop: (state) => state.windowWidth > state.widthTablet,
  windowWidth: (state) => state.windowWidth,
  settings: (state) => (key) => get(state.settings, key),

  flashMessage: (state) => state.flashMessage,
};

export const mutations = {
  SET_WINDOW_WIDTH(state, value) {
    state.windowWidth = value;
  },
  SET_STYLE(state, value) {
    state.theme = value;
  },
  TOGGLE_RIGHT_BAR(state, value) {
    if (typeof value == "boolean") {
      state.rightBarVisible = value;
    } else {
      state.rightBarVisible = !state.rightBarVisible;
    }
  },
  TOGGLE_LEFT_BAR(state) {
    state.leftBarVisible = !state.leftBarVisible;
  },

  SET_LEFT_BAR(state, val) {
    state.leftBarVisible = !!val;
  },

  SET_PAGE_TITLE(state, title) {
    state.title = title;
  },
  ADD_BREADCRUMB(state, { text, to }) {
    state.breadcrumbs.push({
      text,
      to,
    });
  },
  SET_PAGE_INITED(state) {
    state.isFirstLoad = false;
  },
  SET_BREADCRUMBS(state, route) {},

  UPDATE_MENU(state, user) {},
  SET_NOTIFY(state, notify) {},
  SET_NOTIFY_AS_READ(state, type) {},

  INIT_LOCAL_SETTINGS(state, data) {
    state.settings = data;
  },
  SET_LOCAL_VALUE(state, { userId, key, value }) {
    state.settings = set(state.settings || {}, key, value);
    // TODO: вынести в плагин
    Vue.prototype.$storage.set(`settings-user-${userId}`, state.settings);
  },

  SET_FLASH_MESSAGE(state, message) {
    Vue.set(state, "flashMessage", message);
  },
};

export const actions = {
  setStyle({ commit }, data) {
    commit("SET_STYLE", data);
  },

  initInterface({ rootGetters, dispatch }) {
    dispatch("initLocalStorage", rootGetters["auth/user"]);
  },

  initLocalStorage({ commit }, user) {
    if (user?.id) {
      const settings = Vue.prototype.$storage.get(`settings-user-${user?.id}`);
      commit("INIT_LOCAL_SETTINGS", settings);
    }
  },

  setLeftBarVisible({ commit }, newVal) {
    commit("SET_LEFT_BAR", newVal);
  },

  settings({ commit, rootGetters }, { key, value }) {
    const user = rootGetters["auth/user"];
    if (user?.id) {
      commit("SET_LOCAL_VALUE", { userId: user.id, key, value });
    }
  },

  setFlashMessage({ commit }, message) {
    commit("SET_FLASH_MESSAGE", message);
  },
};
