<template>
  <div>
    <v-dialog v-model="dialog" persistent max-width="600px">
      <template v-slot:activator="{ on, attrs }">
        <v-btn text color="primary" dark v-bind="attrs" v-on="on">
          <v-icon class="mr-2">mdi-pencil</v-icon><span>Edit Form</span>
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="headline">Edit Form</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-alert dense outlined type="error" v-if="error" class="mb-4">
              {{ error }}
            </v-alert>
            <v-text-field
              v-model="title"
              :error-messages="titleErrors"
              label="Title"
              required
              @input="$v.title.$touch()"
              @blur="$v.title.$touch()"
            ></v-text-field>
            <v-textarea
              v-model="description"
              :error-messages="descriptionErrors"
              label="Description"
            ></v-textarea>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            @click="dialog = false"
            :disabled="form_editFormLoading"
          >
            Close
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="submit"
            :loading="form_editFormLoading"
            :disabled="form_editFormLoading"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { required } from "vuelidate/lib/validators";
import { mapGetters, mapActions } from "vuex";

export default {
  props: ["form"],

  data: () => ({
    dialog: false,
    formId: null,
    title: undefined,
    description: undefined,
    fieldError: {
      title: null,
      description: null
    },
    error: null
  }),

  validations: {
    title: { required },
    description: {}
  },

  mounted() {
    if (this.form) {
      this.title = this.form.title;
      this.description = this.form.description;
      this.formId = this.form.id;
    } else {
      throw new Error("prop `form` is required.");
    }
  },

  watch: {
    form(form) {
      if (form) {
        this.title = form.title;
        this.description = form.description;
        this.formId = form.id;
      }
    },
    form_editFormError(val) {
      const allowedKeys = ["title", "description"];
      let hasKeyError = false;
      this.resetErrors();

      if (val) {
        if (val.data) {
          for (const key of allowedKeys) {
            if (val.data[key]) {
              this.fieldError[key] = val.data[key];
              hasKeyError = true;
            }
          }
        }

        if (!hasKeyError) {
          this.error = val.message;
        }
      }
    },

    form_editFormLoading(val) {
      if (!val) {
        if (!this.form_editFormError) this.dialog = false;
      }
    }
  },

  computed: {
    ...mapGetters(["form_editFormLoading", "form_editFormError"]),

    titleErrors() {
      const errors = [];
      if (!this.$v.title.$dirty) return errors;
      !this.$v.title.required && errors.push("Title is required..");
      this.fieldError.title && errors.push(this.fieldError.title);
      return errors;
    },

    descriptionErrors() {
      const errors = [];
      this.fieldError.description && errors.push(this.fieldError.description);
      return errors;
    }
  },

  methods: {
    ...mapActions(["editForm"]),

    resetErrors() {
      this.fieldError = {
        title: null,
        description: null
      };

      this.error = null;
    },

    submit() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        this.resetErrors();
        this.editForm({
          id: this.formId,
          title: this.title,
          description: this.description
        });
      }
    }
  }
};
</script>
