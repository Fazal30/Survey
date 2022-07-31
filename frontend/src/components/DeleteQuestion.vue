<template>
  <div>
    <v-dialog v-model="dialog" persistent max-width="600px">
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="error" dark v-bind="attrs" v-on="on" icon small>
          <v-icon small>mdi-delete</v-icon>
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="headline">Delete Question</span>
        </v-card-title>
        <v-card-text>
          <v-container
            >Are you sure you want to delete this question?</v-container
          >
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            @click="dialog = false"
            :disabled="fq_deleteLoading"
          >
            Close
          </v-btn>
          <v-btn
            color="error"
            text
            @click="del"
            :loading="fq_deleteLoading"
            :disabled="fq_deleteLoading"
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
  props: ["formId", "questionId"],

  data: () => ({
    dialog: false
  }),

  computed: {
    ...mapGetters(["fq_deleteLoading", "fq_deleteError"])
  },

  methods: {
    ...mapActions(["deleteFormQuestion"]),

    del() {
      this.deleteFormQuestion({
        formId: this.formId,
        questionId: this.questionId
      });
    }
  }
};
</script>
