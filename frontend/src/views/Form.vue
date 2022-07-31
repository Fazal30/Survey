<template>
  <div>
    <v-row justify="center" class="mb-4">
      <v-col lg="8" sm="10">
        <v-card>
          <v-card-title>
            Form Details
          </v-card-title>

          <v-card-text>
            <div v-if="form_currentForm && !form_currentFormLoading">
              <div class="mb-2">
                <strong class="mr-1">Status:</strong
                ><span v-if="form_currentForm.isActive">Published</span>
                <span v-else>Not published</span>
              </div>
              <div class="mb-2">
                <strong class="mr-1">Title:</strong>{{ form_currentForm.title }}
              </div>
              <div class="mb-2">
                <strong class="mr-1">Description:</strong
                >{{ form_currentForm.description }}
              </div>
              <div class="mb-2">
                <strong class="mr-1">Created At:</strong
                >{{ form_currentForm.createdAt | dateFormat }}
              </div>
              <div class="mb-2" v-if="form_currentForm.isActive">
                <strong class="mr-1">Link:</strong>
                <span ref="link" class="text-decoration-underline mr-2">{{
                  `${origin}/survey/${form_currentForm.id}`
                }}</span>
                <v-btn color="primary" small icon @click="copyText($refs.link)"
                  ><v-icon small>mdi-clipboard-text</v-icon></v-btn
                >
              </div>
              <div
                class="d-flex justify-center"
                v-if="form_currentForm.isActive"
              ></div>
            </div>
            <div v-if="form_currentFormLoading" class="d-flex justify-center">
              <v-progress-circular
                :size="70"
                :width="5"
                color="primary"
                class="mb-4"
                indeterminate
              ></v-progress-circular>
            </div>
          </v-card-text>

          <v-card-actions v-if="form_currentForm && !form_currentFormLoading">
            <v-spacer />
            <v-btn
              text
              class="mr-2"
              color="error"
              @click="publish(false)"
              v-if="form_currentForm.isActive"
              :loading="form_publishFormLoading"
              :disabled="form_publishFormLoading"
            >
              Unpublish Form
            </v-btn>
            <v-btn
              text
              class="mr-2"
              @click="publish(true)"
              color="success"
              :loading="form_publishFormLoading"
              :disabled="form_publishFormLoading"
              v-else
            >
              Publish Form
            </v-btn>
            <DeleteForm
              :formId="form_currentForm.id"
              class="mr-2"
              @delete="onDelete"
            />
            <EditForm :form="form_currentForm" />
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-col lg="8" sm="10">
        <v-card>
          <v-card-title>
            Form Questions
          </v-card-title>

          <v-card-text>
            <ol v-if="!fq_isListLoading && fq_list">
              <li v-for="question in fq_list" :key="question.id" class="mb-2">
                <div class="d-flex align-center">
                  <h3 class="mr-2">
                    <span>{{ question.question }}</span
                    ><span class="ml-1 red--text" v-if="question.isRequired"
                      >*</span
                    >
                  </h3>
                  <EditQuestion :old-question="question" class="mr-2" />
                  <DeleteQuestion
                    :question-id="question.id"
                    :form-id="question.formId"
                  />
                </div>
                <div v-if="question.hint">{{ question.hint }}</div>
                <div v-if="question.type">
                  <strong class="mr-1">Type:</strong
                  ><span>{{ question.type.name }}</span>
                </div>
              </li>
            </ol>
            <div v-if="!fq_list || fq_list.length == 0" class="text-center">
              No Questions
            </div>

            <div class="d-flex justify-center">
              <AddQuestion class="mt-4" :formId="formId" />
            </div>

            <div v-if="fq_isListLoading" class="d-flex justify-center">
              <v-progress-circular
                :size="70"
                :width="5"
                color="primary"
                class="mb-4"
                indeterminate
              ></v-progress-circular>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-col lg="8" sm="10">
        <v-card>
          <v-card-title>
            Form Responses
          </v-card-title>

          <v-card-text>
            <v-data-table
              :headers="responseHeaders"
              :items="responses"
              :options.sync="responseOptions"
              :server-items-length="form_responseLength"
              :loading="form_isResponseLoading"
              class="elevation-1"
            ></v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import EditForm from "../components/EditForm";
import DeleteForm from "../components/DeleteForm";
import AddQuestion from "../components/AddQuestion";
import EditQuestion from "../components/EditQuestion";
import DeleteQuestion from "../components/DeleteQuestion";

export default {
  name: "Form",

  components: {
    EditForm,
    AddQuestion,
    EditQuestion,
    DeleteQuestion,
    DeleteForm
  },

  data: () => ({
    formId: null,
    origin: window.location.origin,
    responses: [],
    responseHeaders: [],
    responseOptions: { itemsPerPage: 5, page: 1 },
    currentQuestions: []
  }),

  computed: mapGetters([
    "fq_list",
    "fq_isListLoading",
    "form_currentForm",
    "form_currentFormLoading",
    "form_publishFormLoading",
    "form_responses",
    "form_responseLength",
    "form_currentResponsePage",
    "form_isResponseLoading"
  ]),

  watch: {
    fq_list(questions) {
      this.responseHeaders = [];
      this.currentQuestions = [];

      if (questions) {
        for (const question of questions) {
          this.responseHeaders.push({
            text: question.question,
            value: question.id
          });

          this.currentQuestions.push(question.id);
        }
      }
    },

    form_responses(responses) {
      this.responses = [];
      for (const response of responses) {
        const currentResponse = { id: response.id };
        let hasResponse = false;

        for (const question of response.questions) {
          if (this.currentQuestions.includes(question.questionId)) {
            currentResponse[question.questionId] = question.response;
            hasResponse = true;
          }
        }

        if (hasResponse) this.responses.push(currentResponse);
      }
    },

    responseOptions: {
      handler() {
        this.getResponseData();
      },
      deep: true
    }
  },

  mounted() {
    this.formId = this.$route.params.id;
    this.resetFormQuestions();
    this.getCurrentForm(this.formId);
    this.getFormQuestions(this.formId);
    this.getResponseData();
  },

  methods: {
    ...mapActions([
      "resetFormQuestions",
      "getFormQuestions",
      "getCurrentForm",
      "publishForm",
      "getFormResponse"
    ]),

    publish(isPublished) {
      this.publishForm({ id: this.form_currentForm.id, isPublished });
    },

    onDelete() {
      this.$router.push("/");
    },

    copyText(element) {
      if (element) {
        const text = element.innerText;
        this.$clipboard(text);
      }
    },

    getResponseData() {
      this.getFormResponse({
        page: this.responseOptions.page,
        formId: this.formId,
        itemsPerPage: this.responseOptions.itemsPerPage
      });
    }
  }
};
</script>
