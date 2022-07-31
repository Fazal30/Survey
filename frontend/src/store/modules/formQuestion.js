import Vue from "vue";
import http from "../../utils/http";

const state = {
  fq_isListLoading: false,
  fq_list: [],
  fq_listFormId: null,
  fq_listErrors: null,
  fq_addLoading: false,
  fq_addError: null,
  fq_editLoading: false,
  fq_editError: null
};

const getters = {
  fq_isListLoading: state => state.fq_isListLoading,
  fq_list: state => state.fq_list,
  fq_listErrors: state => state.fq_listErrors,
  fq_addError: state => state.fq_addError,
  fq_addLoading: state => state.fq_addLoading,
  fq_editError: state => state.fq_editError,
  fq_editLoading: state => state.fq_editLoading,
  fq_deleteError: state => state.fq_deleteError,
  fq_deleteLoading: state => state.fq_deleteLoading
};

const actions = {
  async getFormQuestions({ state, commit }, id) {
    if (state.fq_isListLoading) return;

    commit("setFQListError", null);

    try {
      commit("setFQListLoading", true);
      commit("setFQListFormId", id);
      const res = await http.get(`/forms/question/${id}`);

      if (res.data.questions && res.data.questions.length > 0) {
        commit("setFormQuestions", res.data.questions);
      }
    } catch (error) {
      commit("setFQListError", error.message);
    } finally {
      commit("setFQListLoading", false);
    }
  },

  async addFormQuestion(
    { state, commit },
    { formId, question, hint, isRequired, typeId }
  ) {
    if (state.fq_addLoading) return;

    commit("setFQAddError", null);

    try {
      commit("setFQAddLoading", true);
      const res = await http.post(`/forms/question/${formId}`, {
        question,
        hint,
        isRequired,
        typeId
      });

      if (res.data.question) {
        commit("addFormQuestion", res.data.question);
      }
    } catch (error) {
      commit("setFQAddError", error);
    } finally {
      commit("setFQAddLoading", false);
    }
  },

  async editFormQuestion(
    { state, commit },
    { formId, questionId, question, hint, isRequired, typeId }
  ) {
    if (state.fq_editLoading) return;

    commit("setFQEditError", null);

    try {
      commit("setFQEditLoading", true);
      const res = await http.patch(`/forms/question/${formId}/${questionId}`, {
        question,
        hint,
        isRequired,
        typeId
      });

      if (res.data.question) {
        commit("updateFormQuestion", res.data.question);
      }
    } catch (error) {
      commit("setFQEditError", error);
    } finally {
      commit("setFQEditLoading", false);
    }
  },

  async deleteFormQuestion({ state, commit }, { formId, questionId }) {
    if (state.fq_deleteLoading) return;

    commit("setFQDeleteError", null);

    try {
      commit("setFQDeleteLoading", true);
      await http.delete(`/forms/question/${formId}/${questionId}`);

      commit("deleteFormQuestion", { formId, questionId });
    } catch (error) {
      commit("setFQDeleteError", error.message);
    } finally {
      commit("setFQDeleteLoading", false);
    }
  },

  async resetFormQuestions({ commit }) {
    commit("resetFormQuestionState");
  }
};

const mutations = {
  setFQListLoading: (state, isLoading) => (state.fq_isListLoading = isLoading),
  setFQListError: (state, error) => (state.fq_listErrors = error),
  setFQListFormId: (state, id) => (state.fq_listFormId = id),
  setFormQuestions: (state, newForms) => {
    state.fq_list = newForms;
  },
  resetFormQuestionState: state => {
    state.fq_list = [];
    state.fq_listErrors = null;
    state.fq_isListLoading = false;
  },
  setFQAddLoading: (state, isLoading) => (state.fq_addLoading = isLoading),
  setFQAddError: (state, error) => (state.fq_addError = error),
  addFormQuestion: (state, question) => {
    if (state.fq_listFormId == question.formId) {
      state.fq_list.push(question);
    }
  },
  setFQEditLoading: (state, isLoading) => (state.fq_editLoading = isLoading),
  setFQEditError: (state, error) => (state.fq_editError = error),
  updateFormQuestion: (state, question) => {
    if (state.fq_listFormId == question.formId) {
      const index = state.fq_list.findIndex(q => q.id == question.id);
      if (index != -1) {
        Vue.set(state.fq_list, index, question);
      }
    }
  },
  setFQDeleteLoading: (state, isLoading) =>
    (state.fq_deleteLoading = isLoading),
  setFQDeleteError: (state, error) => (state.fq_deleteError = error),
  deleteFormQuestion: (state, { formId, questionId }) => {
    if (state.fq_listFormId == formId) {
      const index = state.fq_list.findIndex(q => q.id == questionId);
      if (index != -1) {
        Vue.delete(state.fq_list, index);
      }
    }
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
