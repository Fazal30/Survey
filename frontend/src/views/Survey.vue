<template>
  <div>
    <v-alert dense outlined type="error" v-if="survey_error" class="mb-4">
      {{ survey_error }}
    </v-alert>

    <div v-if="isSubmitted">
      The survey has been submitted successfully.
    </div>

    <div v-else>
      <div v-if="survey && !survey_isLoading">
        <v-row justify="center" class="mb-4" v-if="survey.form">
          <v-col lg="6" sm="10">
            <v-card>
              <v-card-title>
                {{ survey.form.title }}
              </v-card-title>

              <v-card-text style="white-space: pre-line;">
                {{ survey.form.description }}
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <v-row justify="center" class="mb-4">
          <v-col lg="6" sm="10">
            <v-card>
              <v-card-title>
                Survey questions
              </v-card-title>

              <v-card-text>
                <v-form @submit.prevent="submit" v-model="isValid" ref="form">
                  <div
                    v-for="question in questions"
                    :key="question.id"
                    class="mb-4"
                  >
                    <v-text-field
                      :label="question.question"
                      :hint="question.hint"
                      v-model="response[question.id]"
                      :rules="rules[question.id]"
                      :error-messages="fieldError[question.id]"
                      outlined
                    />
                  </div>

                  <v-btn
                    color="primary"
                    type="submit"
                    :disabled="survey_addResponseLoading"
                    :loading="survey_addResponseLoading"
                    >Submit</v-btn
                  >
                </v-form>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </div>

      <div class="d-flex justify-center" v-if="survey_isLoading">
        <v-progress-circular
          :size="70"
          :width="5"
          color="primary"
          class="mb-4"
          indeterminate
        ></v-progress-circular>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "Survey",

  data: () => ({
    isValid: null,
    formId: null,
    questions: [],
    rules: {},
    response: {},
    fieldError: {},
    error: null,
    isSubmitted: false
  }),

  computed: {
    ...mapGetters([
      "survey_isLoading",
      "survey_error",
      "survey",
      "survey_addResponseLoading",
      "survey_addResponseErrors"
    ])
  },

  watch: {
    survey(survey) {
      this.questions = [];
      if (survey && survey.questions) {
        for (const question of survey.questions) {
          this.questions.push({ ...question });
          this.response[question.id] = "";
          const rules = [];
          if (question.isRequired) rules.push(this.required);

          /*if (question.type && question.type.type === "number")*/
          /*rules.push(this.numeric);*/

          this.rules[question.id] = rules;
        }
      }
    },

    survey_addResponseErrors(val) {
      const allowedKeys = this.questions.map(q => q.id);
      let hasKeyError = false;
      this.fieldError = {};

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

    survey_addResponseLoading(val) {
      if (!val && !this.survey_addResponseErrors) {
        this.isSubmitted = true;
        this.$refs.form.reset();
      }
    }
  },

  mounted() {
    this.formId = this.$route.params.id;
    this.resetSurvey();
    this.getSurvey(this.formId);
  },

  methods: {
    ...mapActions(["getSurvey", "resetSurvey", "addSurveyResponse"]),

    required(val) {
      return (
        !(val === undefined || val === null || val === "") ||
        "This field is required"
      );
    },

    numeric(val) {
      return !isNaN(Number(val)) || "This field should be numeric.";
    },

    submit() {
      this.fieldError = {};
      this.$refs.form.validate();
      if (this.isValid) {
        this.addSurveyResponse({
          surveyId: this.formId,
          response: this.response
        });
      }
    }
  }
};
</script>
