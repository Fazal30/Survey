import Vue from "vue";
import http from "../../utils/http";

const state = {
  form_isListLoading: false,
  form_list: [],
  form_listErrors: null,
  form_listLastPage: 1,
  form_currentListPage: 0,
  form_currentForm: null,
  form_currentFormLoading: false,
  form_currentFormError: null,
  form_addFormLoading: null,
  form_addFormError: null,
  form_editFormLoading: null,
  form_editFormError: null,
  form_publishFormLoading: null,
  form_publishFormError: null,
  form_deleteFormLoading: null,
  form_deleteFormError: null,
  form_isResponseLoading: false,
  form_responses: [],
  form_responseErrors: null,
  form_responseLength: 1,
  form_currentResponsePage: 0
};

const getters = {
  form_isListLoading: state => state.form_isListLoading,
  form_list: state => state.form_list,
  form_listErrors: state => state.form_listErrors,
  form_listLastPage: state => state.form_listLastPage,
  form_currentListPage: state => state.form_currentListPage,
  form_currentForm: state => state.form_currentForm,
  form_currentFormError: state => state.form_currentFormError,
  form_currentFormLoading: state => state.form_currentFormLoading,
  form_addFormLoading: state => state.form_addFormLoading,
  form_addFormError: state => state.form_addFormError,
  form_editFormLoading: state => state.form_editFormLoading,
  form_editFormError: state => state.form_editFormError,
  form_publishFormError: state => state.form_publishFormError,
  form_publishFormLoading: state => state.form_publishFormLoading,
  form_deleteFormLoading: state => state.form_deleteFormLoading,
  form_deleteFormError: state => state.form_deleteFormError,
  form_isResponseLoading: state => state.form_isResponseLoading,
  form_responses: state => state.form_responses,
  form_responseErrors: state => state.form_responseErrors,
  form_responseLength: state => state.form_responseLength,
  form_currentResponsePage: state => state.form_currentResponsePage
};

const actions = {
  async getFormPage({ state, commit }, page) {
    if (state.form_isListLoading) return;

    commit("setFormListError", null);

    try {
      commit("setFormListLoading", true);
      const res = await http.get(`/forms?page=${page}`);
      commit("setFormCurrentPage", page);

      if (res.data.forms && res.data.forms.length > 0) {
        commit("addForms", res.data.forms);
      }

      commit("setFormLastPage", res.data.lastPage);
    } catch (error) {
      commit("setFormListError", error.message);
    } finally {
      commit("setFormListLoading", false);
    }
  },

  async getCurrentForm({ state, commit }, id) {
    if (state.form_currentFormLoading) return;

    commit("setCurrentFormError", null);

    try {
      commit("setCurrentFormLoading", true);
      const res = await http.get(`/forms/${id}`);

      if (res.data.form) {
        commit("setCurrentForm", res.data.form);
      }
    } catch (error) {
      commit("setCurrentFormError", error.message);
    } finally {
      commit("setCurrentFormLoading", false);
    }
  },

  async addForm({ commit }, { title, description = "" }) {
    if (state.form_addFormLoading) return;
    commit("setAddFormError", null);

    try {
      commit("setAddFormLoading", true);
      const res = await http.post("/forms", { title, description });
      if (res.data.form) {
        commit("addNewForm", res.data.form);
      }
    } catch (error) {
      commit("setAddFormError", error);
    } finally {
      commit("setAddFormLoading", false);
    }
  },

  async editForm({ commit }, { id, title, description = "" }) {
    if (state.form_editFormLoading) return;
    commit("setEditFormError", null);

    try {
      commit("setEditFormLoading", true);
      const res = await http.patch(`/forms/${id}`, { title, description });
      if (res.data.form) {
        commit("updateForm", res.data.form);
      }
    } catch (error) {
      commit("setEditFormError", error);
    } finally {
      commit("setEditFormLoading", false);
    }
  },

  async publishForm({ commit }, { id, isPublished }) {
    if (state.form_publishFormLoading) return;
    commit("setPublishFormError", null);

    try {
      commit("setPublishFormLoading", true);
      await http.post(`/forms/activate/${id}`, { active: isPublished });
      commit("setPublishForm", { id, isPublished });
    } catch (error) {
      commit("setPublishFormError", error.message);
    } finally {
      commit("setPublishFormLoading", false);
    }
  },

  async deleteForm({ state, commit }, formId) {
    if (state.form_deleteFormLoading) return;

    commit("setDeleteFormError", null);

    try {
      commit("setDeleteFormLoading", true);
      await http.delete(`/forms/${formId}`);

      commit("deleteForm", formId);
    } catch (error) {
      commit("setDeleteFormError", error.message);
    } finally {
      commit("setDeleteFormLoading", false);
    }
  },

  async getFormResponse(
    { state, commit },
    { page = 1, formId, itemsPerPage = 10 }
  ) {
    if (state.form_isResponseLoading) return;

    commit("setFormResponseError", null);

    try {
      commit("setFormResponseLoading", true);
      const res = await http.get(
        `/forms/response/${formId}?page=${page}&itemsPerPage=${itemsPerPage}`
      );
      commit("setFormResponseCurrentPage", page);

      if (res.data.responses && res.data.responses.length > 0) {
        commit("addFormResponse", res.data.responses);
      }

      commit("setFormResponseLength", res.data.totalItems);
    } catch (error) {
      commit("setFormResponseError", error.message);
    } finally {
      commit("setFormResponseLoading", false);
    }
  },

  async resetForms({ commit }) {
    commit("resetFormState");
  }
};

const mutations = {
  setFormListLoading: (state, isLoading) =>
    (state.form_isListLoading = isLoading),
  setFormListError: (state, error) => (state.form_listErrors = error),
  setFormCurrentPage: (state, val) => (state.form_currentListPage = val),
  setFormLastPage: (state, val) => (state.form_listLastPage = val),
  addForms: (state, newForms) => {
    state.form_list = newForms;
  },
  resetFormState: state => {
    state.form_list = [];
    state.form_currentListPage = 0;
    state.form_hasNextPage = true;
    state.form_listErrors = null;
    state.form_isListLoading = false;
  },
  setCurrentForm: (state, form) => (state.form_currentForm = form),
  setCurrentFormLoading: (state, val) => (state.form_currentFormLoading = val),
  setCurrentFormError: (state, val) => (state.form_currentFormError = val),
  setAddFormLoading: (state, val) => (state.form_addFormLoading = val),
  setAddFormError: (state, val) => (state.form_addFormError = val),
  addNewForm: (state, newForm) => {
    if (state.form_currentListPage == 1) state.form_list.unshift(newForm);
  },
  setEditFormLoading: (state, val) => (state.form_editFormLoading = val),
  setEditFormError: (state, val) => (state.form_editFormError = val),
  updateForm: (state, updatedForm) => {
    const index = state.form_list.findIndex(form => form.id == updatedForm.id);
    if (index != -1) {
      state.form_list[index] = updatedForm;
    }

    if (state.form_currentForm && state.form_currentForm.id == updatedForm.id) {
      state.form_currentForm = updatedForm;
    }
  },
  setPublishFormLoading: (state, val) => (state.form_publishFormLoading = val),
  setPublishFormError: (state, val) => (state.form_publishFormError = val),
  setPublishForm: (state, { id, isPublished }) => {
    const index = state.form_list.findIndex(form => form.id == id);
    if (index != -1) {
      state.form_list[index].isActive = isPublished;
    }

    if (state.form_currentForm && state.form_currentForm.id == id) {
      state.form_currentForm.isActive = isPublished;
    }
  },
  setDeleteFormLoading: (state, isLoading) =>
    (state.form_deleteFormLoading = isLoading),
  setDeleteFormError: (state, error) => (state.form_deleteFormError = error),
  deleteForm: (state, formId) => {
    const index = state.form_list.findIndex(f => f.id == formId);
    if (index != -1) {
      Vue.delete(state.form_list, index);
    }
  },
  setFormResponseLoading: (state, isLoading) =>
    (state.form_isResponseLoading = isLoading),
  setFormResponseError: (state, error) => (state.form_responseErrors = error),
  setFormResponseCurrentPage: (state, val) =>
    (state.form_currentResponsePage = val),
  setFormResponseLength: (state, val) => (state.form_responseLength = val),
  addFormResponse: (state, newForms) => {
    state.form_responses = newForms;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
