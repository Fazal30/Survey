import http from "../../utils/http";

const state = {
  type_isLoading: false,
  type_isLoaded: false,
  types: []
};

const getters = {
  type_isLoaded: state => state.type_isLoaded,
  type_isLoading: state => state.type_isLoading,
  types: state => state.types
};

const actions = {
  async getTypes({ state, commit }) {
    if (state.type_isLoading) return;
    if (state.type_isLoaded) return;

    try {
      commit("setTypeLoading", true);
      const res = await http.get("/forms/types");
      if (res.data.types) {
        commit("setTypes", res.data.types);
      }

      commit("setTypeLoaded", true);
    } catch (error) {
      commit("setAuthLoginError", error);
    } finally {
      commit("setTypeLoading", false);
    }
  }
};

const mutations = {
  setTypeLoading: (state, isLoading) => (state.type_isLoading = isLoading),
  setTypeLoaded: (state, loaded) => (state.type_isLoaded = loaded),
  setTypes: (state, types) => (state.types = types)
};

export default {
  state,
  getters,
  actions,
  mutations
};
