<template>
  <div>
    <b-btn variant="default" id="widget-profile" class="layout-navbar-footer__profile">
      <span class="layout-navbar-footer__avatar">{{ abr }}</span>
      <div class="layout-navbar-footer__info">
        <div class="layout-navbar-footer__info__name">{{ $auth.user.name }} {{ $auth.user.last_name }}</div>
        <div class="layout-navbar-footer__info__role">{{ $auth.user.role_label }}</div>
      </div>
    </b-btn>
    <sh-popover
      target="widget-profile"
      custom-class="sh-profile__popover profile"
      placement="bottom"
      triggers="click _hover">
      <div class="sh-profile__popover">
        <div class="sh-profile__popover__content">
          <!-- <div class="sh-profile__popover__content__item">
            <p class="name mb-0">
              <b-btn block variant="text" :to="{ name: 'me' }" class="text-left">{{ fio || "Мой профиль" }}</b-btn>
            </p>
          </div> -->

          <!-- <div v-if="adminData" class="sh-profile__popover__content__item">
            <b-btn block variant="text" @click="loginAsAdmin" class="text-left">
              <b>Войти как {{ adminDataFio }}</b>
            </b-btn>
          </div> -->
          <!-- <div class="sh-profile__popover__content__item">
            <b-btn block variant="text" to="/support" @click="$root.$emit('bv::hide::popover')" class="text-left"
              >Техническая поддержка</b-btn
            >
          </div> -->

          <!-- <div class="sh-profile__popover__content__item">
            <b-btn block variant="text" to="/user" class="text-left">Профиль</b-btn>
          </div> -->

          <!-- <div class="sh-profile__popover__content__item">
            <b-btn block variant="text" @click="download" class="text-left">Инструкция</b-btn>
          </div> -->

          <div class="sh-profile__popover__content__item">
            <b-btn block variant="text" @click="logout" class="text-left">Выход</b-btn>
          </div>
        </div>
      </div>
    </sh-popover>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import { mapGetters } from "vuex";

export default {
  components: {},
  data() {
    return {};
  },

  computed: {
    ...mapGetters({}),
    fio() {
      const { name, last_name, middle_name } = this.$auth.user ?? {};
      return [name, last_name, middle_name].filter(Boolean).join("");
    },
    abr() {
      const { name, last_name } = this.$auth.user ?? {};
      if (last_name) {
        if (name) {
          return `${name[0]?.toUpperCase()}${last_name[0]}`;
        }
        return `${last_name[0]}${last_name[1]}`.toUpperCase();
      }
      return "P";
    },
  },
  watch: {},
  methods: {
    async logout() {
      try {
        await this.$auth.logout();
        window.location.reload();
      } catch (err) {
        this.handleError(err);
      }
    },
    async download() {
      try {
        const result = await this.$api.manual.download();
        if (result) {
          const url = window.URL.createObjectURL(new Blob([result], { type: "application/pdf" }));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "manual");
          link.click();
          // this.$toast("info", "Информация", "Файл инструкции загружен в компьютер");
        } else {
          throw "Ошибка загрузки файла";
        }
      } catch (err) {
        this.handleError(err);
      }
    },
  },
};
</script>
