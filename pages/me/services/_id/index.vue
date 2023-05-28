<template>
  <div>
    <div v-if="$fetchState.pending" class="d-flex justify-content-center align-items-center">
      <b-spinner />
    </div>
    <div v-else data-testid="is-ready">
      <div class="row">
        <sh-input class="col-12" v-model="form.payload.name" label="название" />
        <sh-input class="col-12" v-model="form.payload.price" label="цена" />
        <sh-input class="col-12" type="textarea" v-model="form.payload.comment" label="комментарий" />
      </div>

      <b-btn block @click="save">Сохранить</b-btn>
      <b-btn v-if="!isNew" block @click="remove" variant="danger">Удалить</b-btn>
    </div>
  </div>
</template>

<script>
import { cloneDeep } from 'lodash';

const MODEL = {
  payload: {
    name: '',
    comment: ''
  }
};

export default {
  components: {},
  mixins: [],
  head() {
    return {};
  },

  data() {
    return {
      form: {}
    };
  },

  computed: {
    isNew() {
      return this.$route.params?.id === 'new';
    }
  },
  watch: {},
  methods: {
    async save() {
      try {
        if (this.isNew) {
          const { id } = await this.$axios.$post(`/api/me/services`, this.form);
          if (id) {
            const newPath = this.$route.path.replace('/new', `/${id}`);
            this.$router.push(newPath);
          }
        } else {
          const { id, ...form } = this.form;
          await this.$axios.$put(`/api/me/services/${id}`, form);
        }
      } catch (e) {
        this.handleError(e);
      }
    },
    async remove() {
      try {
        const { id } = this.form;
        await this.$axios.$delete(`/api/me/services/${id}`);
        const newPath = this.$route.path.replace(`/${id}`, ``);
        this.$router.push(newPath);
      } catch (e) {
        this.handleError(e);
      }
    }
  },
  async fetch() {
    if (this.isNew) {
      this.form = cloneDeep(MODEL);
    } else {
      const data = await this.$axios.$get(`/api/me/services/${this.$route.params?.id}`);
      console.log('data', data);
      const _data = cloneDeep(data);
      this.form = _data;
    }
  }
};
</script>
