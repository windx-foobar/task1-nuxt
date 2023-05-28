export let $store;

export const state = () => ({});

export const getters = {
  // location: state => state.location
};

export const mutations = {
  // SET_LOCATION(state, location) {
  //   state.location = location;
  // }
};

export const actions = {
  async INIT({ dispatch }, ctx) {
    $store = ctx.store;
    // dispatch('auth/readToken');
    // dispatch('auth/readTokenPrev');
  },
};
