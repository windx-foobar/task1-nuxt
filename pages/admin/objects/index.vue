<template>
  <div>
    <div class="row">
      <sh-input class="col" type="select" v-model="filter.status" :options="objectStatusLst" label="статус" />
      <div class="col-auto ml-auto">
        <sh-btn @click="setFilter">Применить</sh-btn>
      </div>
    </div>
    <b-table hover ref="table" :items="itemsProvider" :fields="fields" @row-clicked="rowClicked"></b-table>
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
      filter: { status: 2 },
      objectStatusLst: [],
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
      // console.log("ctx", ctx);
      const { rows, _meta } = await this.$axios.$get("/api/admin/objects", {
        params: { filter: JSON.stringify(this.filter) },
      });

      return rows;
    },

    async setFilter() {
      this.$refs.table.refresh();
    },

    rowClicked(item) {
      this.$router.push(`${this.$route.path}/${item.id}`);
    },
  },
  async fetch() {
    const lst = await this.$axios.$get(`/api/dictionary/object-status`);
    this.objectStatusLst = lst;
  },
  async mounted() {},
};
</script>
