import http from "../../utils/http";

const state = {
  survey_isLoading: false,
  survey_error: null,
  survey: null,
  survey_addResponseLoading: false,
  survey_addResponseErrors: null
};

const getters = {
  survey_isLoading: state => state.survey_isLoading,
  survey_error: state => state.survey_error,
  survey: state => state.survey,
  survey_addResponseLoading: state => state.survey_addResponseLoading,
  survey_addResponseErrors: state => state.survey_addResponseErrors
};

const actions = {
  async getSurvey({ state, commit }, surveyId) {
    if (state.survey_isLoading) return;
    commit("setSurveyError", null);

    try {
      commit("setSurveyLoading", true);
      const res = await http.get(`/survey/${surveyId}`);
      if (res.data) {
        commit("setSurvey", res.data);
      }
    } catch (error) {
      commit("setSurveyError", error.message);
    } finally {
      commit("setSurveyLoading", false);
    }
  },

  async addSurveyResponse({ state, commit }, { surveyId, response }) {
    if (state.survey_addResponseLoading) return;
    commit("setSurveyAddResponseError", null);

    try {
      commit("setSurveyAddResponseLoading", true);
      await http.post(`/survey/${surveyId}`, { response });
    } catch (error) {
      commit("setSurveyAddResponseError", error);
    } finally {
      commit("setSurveyAddResponseLoading", false);
    }
  },

  async resetSurvey({ commit }) {
    commit("resetSurveyState");
  }
};

const mutations = {
  setSurveyLoading: (state, isLoading) => (state.survey_isLoading = isLoading),
  setSurveyError: (state, error) => (state.survey_error = error),
  setSurvey: (state, val) => (state.survey = val),
  resetSurveyState: state => {
    state.survey = null;
    state.survey_error = null;
    state.survey_isLoading = false;
    state.survey_addResponseLoading = false;
    state.survey_addResponseErrors = null;
  },
  setSurveyAddResponseLoading: (state, isLoading) =>
    (state.survey_addResponseLoading = isLoading),
  setSurveyAddResponseError: (state, error) =>
    (state.survey_addResponseErrors = error)
};

export default {
  state,
  getters,
  actions,
  mutations
};
