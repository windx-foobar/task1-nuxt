<template>
  <div>
    <b-btn @click="create">Добавить новый</b-btn>
    <b-table hover :items="itemsProvider" :fields="fields" @row-clicked="rowClicked"></b-table>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  components: {},
  data() {
    return {
      rows: [],
      _meta: {},
      //
      fields: [
        {
          key: "id",
        },
        {
          label: "Наименование",
          key: "_name",
        },
        {
          label: "Родитель",
          key: "parent._name",
        },
        {
          label: "Статус",
          key: "_statusName",
        },
      ],
    };
  },

  computed: {
    ...mapGetters({}),
  },

  methods: {
    async itemsProvider(ctx) {
      const { rows, _meta } = await this.$axios.$get("/api/me/objects");

      return rows;
    },

    create() {
      this.$router.push(`${this.$route.path}/new`);
    },

    rowClicked(item) {
      this.$router.push(`${this.$route.path}/${item.id}`);
    },
  },
  async fetch() {},
  async mounted() {},
};
</script>
