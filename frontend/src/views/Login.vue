<template>
  <div>
    <v-row justify="center" class="mt-8 px-4">
      <v-col lg="6" sm="10">
        <v-card>
          <v-card-title>
            Login/Register
          </v-card-title>

          <v-card-text>
            <v-tabs v-model="tab">
              <v-tabs-slider color="primary"></v-tabs-slider>

              <v-tab v-for="item in items" :key="item">
                {{ item }}
              </v-tab>
            </v-tabs>

            <v-tabs-items v-model="tab" class="pa-4">
              <v-tab-item>
                <LoginForm />
              </v-tab-item>
              <v-tab-item>
                <RegisterFrom />
              </v-tab-item>
            </v-tabs-items>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

import RegisterFrom from "../components/RegisterForm.vue";
import LoginForm from "../components/LoginForm.vue";

export default {
  name: "Login",
  data() {
    return {
      tab: null,
      items: ["Login", "Register"]
    };
  },

  computed: mapGetters(["auth_user"]),

  watch: {
    auth_user(val) {
      if (val) {
        this.$router.push("/");
      }
    }
  },

  components: { RegisterFrom, LoginForm }
};
</script>
