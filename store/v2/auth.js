export const state = () => ({});

export const getters = {
  permissions: (state, getters, rootState, rootGetters) => {
    return rootState?.auth?.user?.permissions;
  },
  roles: (state, getters, rootState, rootGetters) => {
    return rootState?.auth?.user?.roles;
  },

  isAdmin: (state, getters) => getters.roles.includes("super_admin"),

  hasPermission: (state, getters) => (permission) => {
    return getters.permissions.includes(permission);
  },
  hasRole: (state, getters) => (role) => {
    console.log("xxx", role, getters.roles);
    return getters.roles.includes(role);
  },
};

export const mutations = {
  // SET_PREV_TOKEN(state, data) {
  //   state.adminData = data;
  // },
  // SER_REDIRECT(state, data) {
  //   state.redirectTo = data;
  // },
};

export const actions = {
  // readToken({ commit }) {
  //   const token = Cookies.get(COOKIES_APP_SID);
  //   if (token) {
  //     commit("SET_TOKEN", token);
  //   }
  // },
  // readTokenPrev({ commit }) {
  //   const token = Cookies.get(`${COOKIES_APP_SID}.prew.token`);
  //   const fio = Cookies.get(`${COOKIES_APP_SID}.prew.fio`);
  //   if (token) {
  //     commit("SET_PREV_TOKEN", { token, fio });
  //   }
  // },
  // async backToAdmin({ commit, dispatch, getters }) {
  //   await dispatch("saveToken", {
  //     token: getters.adminData.token,
  //   });
  //   Cookies.remove(`${COOKIES_APP_SID}.prew.token`);
  //   Cookies.remove(`${COOKIES_APP_SID}.prew.fio`);
  // },
};
