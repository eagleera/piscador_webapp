import ranchApi from "@/api/ranch.api";

const state = {
  ranch: null
};
const getters = {
  getRanch: state => state.ranch
};
const mutations = {
  INIT_RANCH(state, ranch) {
    state.ranch = ranch;
  }
};
const actions = {
  post({ commit }, data) {
    return ranchApi.post(
      data,
      () => {
        commit("INIT_RANCH", data);
        return true;
      },
      error => {
        return error;
      }
    );
  }
};

export default {
  namespaced: true,
  state: {
    ...state
  },
  getters: {
    ...getters
  },
  mutations,
  actions
};
