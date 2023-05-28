<template>
  <div>
    <div class="row align-items-center bAuth" style="height: 100vh">
      <div class="col-12 col-sm-6 col-md-4 col-xl-3 offset-sm-3 offset-md-6 offset-xl-7">
        <nuxt-link to="login" class="link auth-link go-back"> Назад</nuxt-link>

        <h3 class="pb-3">Восстановление пароля</h3>
        <ValidationObserver ref="form">
          <form @submit.prevent="restoreHandler">
            <sh-input
              v-model="email"
              vid="email"
              label="Email"
              placeholder="test@test.ru"
              rules="required"
              autocomplete="login" />

            <sh-btn type="submit" block :loading="loading">Отправить</sh-btn>

            <p class="pt-3">На указанный адрес будет выслана инструкция по восстановлению пароля</p>
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
      email: "",
      loading: false,
    };
  },
  methods: {
    async restoreHandler() {
      this.loading = true;

      try {
        const isValid = await this.$refs.form.validate();
        if (!isValid) throw new Error("Форма содержит ошибки");

        const fd = new FormData();
        fd.append("email", this.email);
        localStorage.setItem("email", this.email);
        this.loading = true;

        const response = await this.$axios.$post("/api/auth/request-password-restore", fd);
        if (response.status) {
          this.$router.push("/auth/verify");
        } else {
          throw new Error(Object.values(response).join(", "));
        }
      } catch (error) {
        this.handleError(error, null, this.handleResponse);
      }
      this.loading = false;
      return false;
    },
  },
};
</script>

<style lang="scss" scoped></style>
