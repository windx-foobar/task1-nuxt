import { colors, logger } from "~/utils/v2/logger";

// TODO: Вынести расчеты в отдельный стор
const cancelToken = {};

const log = (...r) => {
  // return;
  logger("store/v2/app", colors.olive, ...r);
};

export const state = () => ({
  model: {},
});

export const getters = {
  model: (state) => state.model,
};

export const mutations = {
  SET_STEP(state, step) {
    state.step = step;
  },
};

export const actions = {
  async setIsForCalculate({ commit, getters }, [insurer_code, value]) {},
};
