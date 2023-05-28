<template>
  <div>
    <div class="row align-items-center bAuth" style="height: 100vh">
      <div class="col-12 col-sm-6 col-md-4 col-xl-3 offset-sm-3 offset-md-6 offset-xl-7">
        <nuxt-link to="/" class="link auth-link go-back"> Вернуться к авторизации</nuxt-link>

        <h3 class="pb-3">Установите пароль</h3>
        <ValidationObserver ref="form">
          <form @submit.prevent="setPassHandler">
            <sh-input
              type="password"
              v-model="newPass"
              vid="newPass"
              label="Придумайте пароль"
              rules="required"
              autocomplete="no-current-password"
              desc-class="pt-0"
              show-error-desc />

            <sh-input
              type="password"
              v-model="newPassConfirm"
              vid="newPassConfirm"
              label="Повторите пароль"
              rules="required"
              autocomplete="no-current-password"
              desc-class="pt-0"
              show-error-desc />

            <sh-btn type="submit" block :loading="loading">Сохранить и продолжить</sh-btn>
          </form>
        </ValidationObserver>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  layout: "auth",
  auth: false,
  data() {
    return {
      newPass: "",
      newPassConfirm: "",
      loading: false,
    };
  },
  methods: {
    async setPassHandler() {
      try {
        const isValid = await this.$refs.form.validate();
        if (!isValid) throw new Error("Форма содержит ошибки");

        this.loading = true;

        if (this.newPass === this.newPassConfirm) {
          const fd = new FormData();
          fd.append("new_password", this.newPass);
          const token = localStorage.getItem("token");
          fd.append("token", token);
          fd.append("password_repeat", this.newPassConfirm);
          const response = await this.$axios.$post("/api/auth/password-restore", fd);
          localStorage.removeItem("token");
          if (response.status === "Password changed") {
            this.$router.push("/");
          } else {
            throw new Error("Не удалось изменить пароль");
          }
          this.loading = false;
        }
      } catch (error) {
        this.handleError(error, null, this.handleResponse);
        // localStorage.removeItem("token");
        // localStorage.removeItem("email");
      }
      this.loading = false;
    },
  },
};
</script>

<style lang="scss" scoped></style>
