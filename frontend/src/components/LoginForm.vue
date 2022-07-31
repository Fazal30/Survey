<template>
  <div>
    <v-form @submit.prevent="submit">
      <v-alert dense outlined type="error" v-if="error" class="mb-4">
        {{ error }}
      </v-alert>

      <v-text-field
        v-model="email"
        :error-messages="emailErrors"
        label="E-mail"
        required
        @input="$v.email.$touch()"
        @blur="$v.email.$touch()"
      ></v-text-field>
      <v-text-field
        v-model="password"
        :error-messages="passwordErrors"
        type="password"
        label="Password"
        required
        @input="$v.password.$touch()"
        @blur="$v.password.$touch()"
      ></v-text-field>

      <div class="d-flex justify-center">
        <v-btn
          color="primary"
          type="submit"
          :disabled="$v.$invalid || auth_isLoginLoading"
          :loading="auth_isLoginLoading"
        >
          Login
        </v-btn>
      </div>
    </v-form>
  </div>
</template>

<script>
import { required, email, minLength } from "vuelidate/lib/validators";
import { mapGetters, mapActions } from "vuex";

export default {
  data: () => ({
    email: null,
    password: null,
    fieldError: {
      email: null,
      password: null
    },
    error: null
  }),

  watch: {
    auth_loginError(val) {
      const allowedKeys = ["email", "password"];
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
    }
  },

  validations: {
    password: { required, minLength: minLength(6) },
    email: { required, email }
  },

  computed: {
    ...mapGetters(["auth_isLoginLoading", "auth_loginError"]),

    emailErrors() {
      const errors = [];
      if (!this.$v.email.$dirty) return errors;
      !this.$v.email.email && errors.push("Must be valid e-mail.");
      !this.$v.email.required && errors.push("E-mail is required.");
      this.fieldError.email && errors.push(this.fieldError.email);
      return errors;
    },
    passwordErrors() {
      const errors = [];
      if (!this.$v.password.$dirty) return errors;
      !this.$v.password.minLength &&
        errors.push("Password must be atleast 6 characters long.");
      !this.$v.password.required && errors.push("Password is required.");
      this.fieldError.password && errors.push(this.fieldError.password);
      return errors;
    }
  },

  methods: {
    ...mapActions(["loginUser"]),

    resetErrors() {
      this.fieldError = {
        email: null,
        password: null
      };
      this.error = null;
    },

    submit() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        this.resetErrors();
        this.loginUser({
          email: this.email,
          password: this.password
        });
      }
    }
  }
};
</script>
