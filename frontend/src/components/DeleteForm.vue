<template>
  <div>
    <v-dialog v-model="dialog" persistent max-width="600px">
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="error" dark v-bind="attrs" v-on="on" text>
          <v-icon class="mr-2">mdi-delete</v-icon><span>Delete Form</span>
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="headline">Delete Form</span>
        </v-card-title>
        <v-card-text>
          <v-container
            >Are you sure you want to delete this form and all of it's
            questions?</v-container
          >
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            @click="dialog = false"
            :disabled="form_deleteFormLoading"
          >
            Close
          </v-btn>
          <v-btn
            color="error"
            text
            @click="del"
            :loading="form_deleteFormLoading"
            :disabled="form_deleteFormLoading"
          >
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  props: ["formId"],

  data: () => ({
    dialog: false
  }),

  watch: {
    form_deleteFormLoading(val) {
      if (!val) {
        this.$emit("delete");
      }
    }
  },

  computed: {
    ...mapGetters(["form_deleteFormLoading", "form_deleteFormError"])
  },

  methods: {
    ...mapActions(["deleteForm"]),

    del() {
      this.deleteForm(this.formId);
    }
  }
};
</script>
