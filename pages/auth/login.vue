<template>
  <div>
    <div class="row align-items-center bAuth" style="height: 100vh">
      <div class="col-12 col-sm-6 col-md-4 col-xl-3 offset-sm-3 offset-md-6 offset-xl-7">
        <h3 class="pb-3">Вход в личный кабинет</h3>
        <ValidationObserver ref="form">
          <form @submit.prevent="loginHandler">
            <sh-input
              v-model="email"
              vid="email"
              label="Email"
              placeholder="test@test.ru"
              rules="required"
              autocomplete="login" />

            <sh-input
              type="password"
              v-model="password"
              vid="loginform-password"
              label="Пароль"
              rules="required"
              autocomplete="current-password"
              desc-class="pt-0"
              show-error-desc
              fg-class="mb-0" />

            <p class="text-right py-2">
              <!-- <nuxt-link to="/auth/restore" class="restore-link">Напомнить пароль</nuxt-link> -->
            </p>

            <sh-btn type="submit" block :loading="loading">Войти</sh-btn>

            <p class="pt-3">
              <sh-input
                type="cb"
                rules="required"
                v-model="ok"
                :unchecked-value="null"
                vid="rememberMe"
                name="Уведомление о 152-ФЗ"
                placeholder="Я уведомлен о необходимости получения  согласия на обработку и передачу персональных данных (в соответствии с 152-ФЗ) при работе в системе" />
            </p>
          </form>
        </ValidationObserver>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  layout: "auth",
  data() {
    return {
      email: "user1@mail.ru",
      // email: "user6@mail.ru",
      password: "123456",

      loading: false,
      ok: 1,
    };
  },
  methods: {
    async loginHandler() {
      this.loading = true;

      try {
        const isValid = await this.$refs.form.validate();
        if (!isValid) throw new Error("Форма содержит ошибки");

        await this.$auth.loginWith("local", {
          data: {
            username: this.email,
            password: this.password,
          },
        });
        //

        //
        this.$router.push("/me");

        // if (err?.response?.status == 401) {
        //   throw new Error("Проверьте правильность введенных данных");
        // }
      } catch (error) {
        if (error?.response?.status == 401) {
          this.handleError(new Error("Пользователь не найден"));
        } else {
          this.handleError(error, null, this.handleResponse);
        }
      }
      this.loading = false;
      return false;
    },
  },
};
</script>

<style lang="scss" scoped></style>
