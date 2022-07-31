<template>
  <div>
    <v-dialog v-model="dialog" persistent max-width="600px">
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="primary" dark v-bind="attrs" v-on="on" icon small>
          <v-icon class="mr-2" small>mdi-pencil</v-icon>
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="headline">Edit Question</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-alert dense outlined type="error" v-if="error" class="mb-4">
              {{ error }}
            </v-alert>

            <v-text-field
              v-model="question"
              :error-messages="questionErrors"
              label="Question"
              required
              @input="$v.question.$touch()"
              @blur="$v.question.$touch()"
            ></v-text-field>
            <v-text-field
              v-model="hint"
              :error-messages="hintErrors"
              label="Hint"
            ></v-text-field>

            <v-checkbox
              v-model="isRequired"
              label="Required Question"
            ></v-checkbox>

            <v-select
              :items="types"
              label="Type"
              item-text="name"
              item-value="id"
              v-model="typeId"
            ></v-select>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            @click="dialog = false"
            :disabled="fq_editLoading"
          >
            Close
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="submit"
            :loading="fq_editLoading"
            :disabled="fq_editLoading"
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
  props: ["oldQuestion"],

  data: () => ({
    dialog: false,
    questionId: null,
    formId: null,
    question: undefined,
    hint: undefined,
    isRequired: false,
    typeId: undefined,
    fieldError: {
      question: null,
      hint: null,
      isRequired: null
    },
    error: null
  }),

  validations: {
    question: { required },
    hint: {}
  },

  watch: {
    fq_editError(val) {
      const allowedKeys = ["question", "hint", "isRequired"];
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

    fq_editLoading(val) {
      if (!val) {
        if (!this.fq_editError) this.dialog = false;
      }
    },

    oldQuestion(oldQuestion) {
      if (oldQuestion) {
        this.question = oldQuestion.question;
        if (oldQuestion.hint) this.hint = oldQuestion.hint;
        this.isRequired = oldQuestion.isRequired;
        this.typeId = oldQuestion.type.id;
        this.questionId = oldQuestion.id;
        this.formId = oldQuestion.formId;
      }
    }
  },

  computed: {
    ...mapGetters([
      "fq_editLoading",
      "fq_editError",
      "types",
      "type_isLoaded",
      "type_isLoading"
    ]),

    questionErrors() {
      const errors = [];
      if (!this.$v.question.$dirty) return errors;
      !this.$v.question.required && errors.push("Title is required..");
      this.fieldError.question && errors.push(this.fieldError.question);
      return errors;
    },

    hintErrors() {
      const errors = [];
      this.fieldError.hint && errors.push(this.fieldError.hint);
      return errors;
    }
  },

  mounted() {
    if (this.oldQuestion) {
      this.question = this.oldQuestion.question;
      if (this.oldQuestion.hint) this.hint = this.oldQuestion.hint;
      this.isRequired = this.oldQuestion.isRequired;
      this.typeId = this.oldQuestion.type.id;
      this.questionId = this.oldQuestion.id;
      this.formId = this.oldQuestion.formId;
    } else {
      throw new Error("prop `question` is required.");
    }
    this.getTypes();
  },

  methods: {
    ...mapActions(["editFormQuestion", "getTypes"]),

    resetErrors() {
      this.fieldError = {
        question: null,
        hint: null
      };

      this.error = null;
    },

    submit() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        this.resetErrors();
        this.editFormQuestion({
          formId: this.formId,
          questionId: this.questionId,
          question: this.question,
          hint: this.hint,
          isRequired: this.isRequired,
          typeId: this.typeId
        });
      }
    }
  }
};
</script>
