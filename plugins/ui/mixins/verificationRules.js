import { mapGetters, mapState, mapActions } from 'vuex';

export default {
  data() {
    return {};
  },

  computed: {
    ...mapGetters({ permissions: 'auth/permissions', roles: 'auth/roles' })
  },

  methods: {
    verifPermiss(permissions = []) {
      return !!this.permissions.find(permission => permissions.includes(permission));
    },

    verifRole(roles = []) {
      return !!this.roles.find(role => role === 'admin' || roles.includes(role));
    }
  }
};
