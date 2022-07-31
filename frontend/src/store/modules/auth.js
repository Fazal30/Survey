import http from "../../utils/http";

const state = {
  auth_isRegisterLoading: false,
  auth_registerError: null,
  auth_isLoginLoading: false,
  auth_loginError: null,
  auth_user: null,
  auth_token: localStorage.getItem("token_id") || null,
  auth_isChecked: false,
  auth_isCheckLoading: false
};

const getters = {
  auth_isRegisterLoading: state => state.auth_isRegisterLoading,
  auth_registerError: state => state.auth_registerError,
  auth_isLoginLoading: state => state.auth_isLoginLoading,
  auth_loginError: state => state.auth_loginError,
  auth_user: state => state.auth_user,
  auth_token: state => state.auth_token,
  auth_isCheckLoading: state => state.auth_isCheckLoading,
  auth_isChecked: state => state.auth_isChecked
};

const actions = {
  async registerUser({ commit, dispatch }, { name, email, password }) {
    if (state.auth_isRegisterLoading) return;
    commit("setAuthRegisterError", null);

    try {
      commit("setAuthIsRegisterLoading", true);
      const res = await http.post("/auth/signup", { name, email, password });
      if (res && res.data && res.data.user && res.data.token) {
        dispatch("loginByUserAndToken", {
          user: res.data.user,
          token: res.data.token
        });
      }
    } catch (error) {
      commit("setAuthRegisterError", error);
    } finally {
      commit("setAuthIsRegisterLoading", false);
    }
  },

  async loginUser({ commit, dispatch }, { email, password }) {
    if (state.auth_isLoginLoading) return;
    commit("setAuthLoginError", null);

    try {
      commit("setAuthIsLoginLoading", true);
      const res = await http.post("/auth/login", { email, password });
      if (res && res.data && res.data.user && res.data.token) {
        dispatch("loginByUserAndToken", {
          user: res.data.user,
          token: res.data.token
        });
      }
    } catch (error) {
      commit("setAuthLoginError", error);
    } finally {
      commit("setAuthIsLoginLoading", false);
    }
  },

  async checkAuth({ state, commit }) {
    if (state.auth_isCheckLoading) return !!state.auth_user;
    if (state.auth_isChecked) return !!state.auth_user;

    try {
      commit("setAuthIsCheckLoading", true);
      const res = await http.get("/users/profile");
      if (res && res.data && res.data.user) {
        commit("setAuthUser", res.data.user);
      }
    } catch (error) {
      console.log(error);
    } finally {
      commit("setAuthIsCheckLoading", false);
      commit("setAuthChecked", true);
    }

    return !!state.auth_user;
  },

  loginByUserAndToken({ commit }, { user, token }) {
    commit("setAuthChecked", true);
    commit("setAuthUser", user);
    commit("setAuthToken", token);
  },

  logoutUser({ commit, dispatch }) {
    commit("setAuthUser", null);
    commit("setAuthToken", null);
    dispatch("resetForms");
  }
};

const mutations = {
  setAuthIsRegisterLoading: (state, isLoading) =>
    (state.auth_isRegisterLoading = isLoading),
  setAuthRegisterError: (state, error) => (state.auth_registerError = error),
  setAuthIsLoginLoading: (state, isLoading) =>
    (state.auth_isLoginLoading = isLoading),
  setAuthLoginError: (state, error) => (state.auth_loginError = error),
  setAuthUser: (state, user) => (state.auth_user = user),
  setAuthToken: (state, token) => {
    localStorage.setItem("token_id", token);
    state.auth_token = token;
  },
  setAuthChecked: (state, val) => (state.auth_isChecked = val),
  setAuthIsCheckLoading: (state, val) => (state.auth_isCheckLoading = val)
};

export default {
  state,
  getters,
  actions,
  mutations
};
