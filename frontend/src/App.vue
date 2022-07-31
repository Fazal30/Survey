<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-btn icon @click="goBack" class="mr-2" v-if="auth_user">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>

      <h1>Survery App</h1>
      <v-spacer />
      <v-btn v-if="auth_user" text color="white" @click="logout">Logout</v-btn>
    </v-app-bar>

    <v-main>
      <div class="px-6 py-4">
        <router-view></router-view>
      </div>
    </v-main>
  </v-app>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "App",

  computed: mapGetters(["auth_isChecked", "auth_isCheckLoading", "auth_user"]),

  mounted() {
    if (!this.auth_isChecked && !this.auth_isCheckLoading) {
      this.checkAuth();
    }
  },

  methods: {
    ...mapActions(["checkAuth", "logoutUser"]),
    logout() {
      this.logoutUser();
      this.$router.push("/login");
    },

    goBack() {
      this.$router.go(-1);
    }
  }
};
</script>
