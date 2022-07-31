<template>
  <div>
    <h1 class="mb-4">Home Page</h1>

    <AddForm class="mb-4" />

    <v-row>
      <v-col lg="3" v-for="form in form_list" :key="form.id">
        <v-card :to="'/form/' + form.id">
          <v-card-title
            ><div class="mr-2">{{ form.title }}</div>

            <small v-if="form.isActive">
              (Published)
            </small>
          </v-card-title>
          <v-card-text>
            <div class="mb-2">
              <strong class="mr-1">Description:</strong>{{ form.description }}
            </div>
            <div class="mb-2">
              <strong class="mr-1">Created At:</strong
              >{{ form.createdAt | dateFormat }}
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col sm="12" class="text-center text--secondary" v-if="form_list.length == 0 && !form_isListLoading">
        No form found.
      </v-col>
    </v-row>

    <v-pagination
      class="mt-4"
      v-model="page"
      :length="form_listLastPage"
      :disabled="form_isListLoading"
    ></v-pagination>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import AddForm from "../components/AddForm";

export default {
  name: "Home",

  components: { AddForm },

  data: () => ({
    page: 1
  }),

  watch: {
    page(page) {
      this.getFormPage(page);
    }
  },

  computed: mapGetters([
    "form_list",
    "form_isListLoading",
    "form_currentListPage",
    "form_listLastPage"
  ]),

  mounted() {
    this.getFormPage(this.page);
  },

  methods: {
    ...mapActions(["getFormPage"])
  }
};
</script>
