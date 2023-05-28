<template>
  <div>
    <div class="row align-items-center bAuth" style="height: 100vh">
      <div class="col-12 col-sm-6 col-md-4 col-xl-3 offset-sm-3 offset-md-6 offset-xl-7">
        <nuxt-link to="restore" class="link auth-link go-back"> Назад</nuxt-link>

        <h3 class="pb-3">Восстановление пароля</h3>
        <ValidationObserver ref="form">
          <form @submit.prevent="verifyHandler">
            <sh-input v-model="code" vid="code" label="Введите проверочный код" placeholder="xxxxxx" rules="required" />

            <sh-btn type="submit" block :loading="loading">Отправить</sh-btn>

            <p class="pt-3">
              <sh-btn variant="link" :disabled="countDown > 0" @click="onResend" class="p-0">
                Выслать повторно
                <span v-if="countDown > 0">через: 0:{{ countDown | strPadStart }}</span>
              </sh-btn>
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
  auth: false,
  data() {
    return {
      countDown: 30,
      code: "",
      loading: false,
    };
  },
  watch: {},
  directives: {
    focus: {
      componentUpdated: function (el, obj) {
        obj.value && el.focus();
      },
    },
  },
  mounted() {
    this.countDownTimer();
  },
  filters: {
    strPadStart(val) {
      return val.toString().padStart(2, "0");
    },
  },
  methods: {
    countDownTimer() {
      if (this.countDown > 0) {
        setTimeout(() => {
          this.countDown -= 1;
          this.countDownTimer();
        }, 1000);
      }
    },
    async onResend() {
      const email = localStorage.getItem("email", this.email);
      const fd = new FormData();
      fd.append("email", email);
      let response = await this.$axios.$post("/api/auth/request-password-restore", fd);
      if (response.status) {
        this.$store.commit("layout/ADD_TOAST", {
          status: "success",
          title: "Выслать код повторно",
          text: "Код повторно отправлен на почту",
        });
      } else {
        response.email.map((err) => {
          this.$store.commit("layout/ADD_TOAST", {
            status: "error",
            title: "Ошибка",
            text: err,
          });
        });
      }
    },

    async verifyHandler() {
      this.loading = true;

      try {
        const isValid = await this.$refs.form.validate();
        if (!isValid) throw new Error("Форма содержит ошибки");

        let token = this.code;
        const fd = new FormData();
        fd.append("token", token);
        const response = await this.$axios.$post("/api/auth/check-token", fd);
        if (response?.status === "token_success") {
          localStorage.setItem("token", token);
          this.$router.push("/auth/setpass");
        } else {
          console.log("response", response);
          // throw new Error(Object.values(response).join(", "));
        }
      } catch (error) {
        let json = null;
        try {
          json = JSON.parse(error.response.data.message);
        } catch (e) {}

        if (json) {
          const err = new Error(Object.values(json).join(", "));
          this.handleError(err, null, this.handleResponse);
        } else {
          this.handleError(error, null, this.handleResponse);
        }
      }
      this.loading = false;
    },
  },
};
</script>

<style lang="scss" scoped></style>
