<template>
  <div class="-p-3">
    <div class="-container-fluid bLayout">
      <div class="row no-gutters flex-nowrap bLayout__container">
        <!-- sidebar-menu -->
        <div class="col-auto bLayout__container__menu">
          <div class="bLayout__container__menu__logo">
            <i-aki></i-aki>
          </div>

          <b-nav vertical pills>
            <b-nav-item v-for="(item, key) in menu" :key="key" :to="item.to" active-class="active">
              <component v-if="item.i" :is="item.i" />
              {{ item.name }}
            </b-nav-item>
          </b-nav>
        </div>
        <div class="col bLayout__container__content">
          <div class="bLayout__container__content__top"></div>
          <nuxt class="bLayout__container__content__body" />
        </div>
      </div>
    </div>

    <notifications position="top right" />
  </div>
</template>

<script>
import { cloneDeep } from "lodash";
import { mapActions, mapGetters, mapMutations } from "vuex";
import shMe from "~/components/v2/sh-me";
//

const MENU = [
  { i: "i-catalog", name: "Каталог площадок", to: "/objects" },
  { i: "i-enter", name: "Войти", to: "/auth/login" },
  // { i: "i-event", name: "Сервисы", to: "/me/services" },
  // { i: "i-message",name: "Бронирования", to: "/me/bookings" },
  // { name: "Уведомления", to: "/me/notifications" },
];

export default {
  mixins: [],
  components: { shMe },
  head() {
    return {};
  },
  computed: {
    ...mapGetters({
      windowWidth: "v2/layout/windowWidth",

      leftBarVisible: "v2/layout/leftBarVisible",
      //
      isReady: "v2/app/isReady",
      isFormChanged: "v2/app/isFormChanged",
      //
      permissions: "v2/auth/permissions",
      hasRole: "v2/auth/hasRole",
      //
    }),
    //
    menu() {
      return cloneDeep(MENU);
    },
  },
  methods: {
    toggleSidenav() {
      this.$store.commit("v2/layout/TOGGLE_LEFT_BAR");
    },
    async logout() {
      try {
        await this.$auth.logout();
        window.location.reload();
      } catch (err) {
        this.handleError(err);
      }
    },
  },
};
</script>

<style lang="scss"></style>
