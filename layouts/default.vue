<template>
  <div class="p-3">
    <div class="-container-fluid bLayout">
      <div class="row flex-nowrap bLayout__container">
        <!-- sidebar-menu -->
        <div class="col-auto bLayout__container__menu">
          <b-nav vertical pills>
            <b-nav-item to="/objects" active-class="active">Объекты публичные</b-nav-item>
            <b-nav-item @click="logout" active-class="active">Выход</b-nav-item>
          </b-nav>

          <hr />

          <b-nav vertical pills>
            <b-nav-item v-for="(item, key) in menu" :key="key" :to="item.to" active-class="active">
              {{ item.name }}
            </b-nav-item>
          </b-nav>
        </div>
        <div class="col bLayout__container__content">
          <nuxt />
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

const OWNER_MENU = [
  { name: "Объекты", to: "/me/objects" },
  { name: "Сервисы", to: "/me/services" },
  { name: "Бронирования", to: "/me/bookings" },
  { name: "Уведомления", to: "/me/notifications" },
];

const ADMIN_MENU = [
  { name: "Объекты", to: "/admin/objects" },
  { name: "Арендодатели", to: "/admin/users" },
];

export default {
  middleware: ["auth"],
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
      if (this.hasRole("owner")) {
        return cloneDeep(OWNER_MENU);
      } else if (this.hasRole("super_admin")) {
        return cloneDeep(ADMIN_MENU);
      }
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
