<template>
  <div>
    <div v-if="$fetchState.pending" class="d-flex justify-content-center align-items-center">
      <b-spinner />
    </div>
    <div v-else data-testid="is-ready">
      <div class="row">
        <sh-input class="col-12" v-model="form.payload.name" label="название" />
        <sh-input class="col-12" v-model="form.payload.price" label="цена" />
        <sh-input
          class="col-12"
          type="select"
          v-model="form.objectCategoryId"
          :options="objectCategoriesLst"
          label="категория"
        />
      </div>

      <h3>Время работы</h3>

      <div v-for="(item, key) in daysLst" :key="key" class="row">
        <h5 class="col-3">{{ item }}</h5>
        <sh-input class="col-3" type="select" v-model="form.payload.workTime[key][0]" :options="timesLst" label="с" />
        <sh-input class="col-3" type="select" v-model="form.payload.workTime[key][1]" :options="timesLst" label="по" />
      </div>

      <div class="row">
        <div v-if="canRefuse" class="col">
          <b-btn block @click="refuse" variant="danger">Отказать</b-btn>
        </div>
        <div v-if="canConfirm" class="col">
          <b-btn block @click="confirm">Утвердить</b-btn>
        </div>
        <!-- <div class="col">
          <b-btn block @click="save">Сохранить</b-btn>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
import { cloneDeep } from 'lodash';
import { normalize, serialize } from '~/utils/v2/json/object';

const MODEL = {
  status: 1,
  objectCategoryId: null,
  payload: {
    name: ''
  }
};

const FILE_MODEL = {
  id: null,
  name: '',
  file: null
};

const DAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

let TIMES = Array(23).fill({});
TIMES = TIMES.map((item, key) => ({ id: key + 1, name: key < 10 ? `0${key}:00` : `${key}:00` }));

console.log(TIMES);

export default {
  components: {},
  mixins: [],
  head() {
    return {};
  },

  data() {
    return {
      form: {},
      files: [],
      objectCategoriesLst: [],
      //
      daysLst: [...DAYS],
      timesLst: [...TIMES]
    };
  },

  computed: {
    canConfirm() {
      return this.form?.status === 2;
    },
    canRefuse() {
      return ![1, 4].includes(this.form?.status);
    }
  },
  watch: {},
  methods: {
    async confirm() {
      try {
        const { id } = this.form;
        await this.$axios.$post(`/api/admin/objects/${id}/confirm`);
      } catch (e) {
        this.handleError(e);
      }
    },
    async refuse() {
      try {
        const { id } = this.form;
        await this.$axios.$post(`/api/admin/objects/${id}/refuse`);
      } catch (e) {
        this.handleError(e);
      }
    }
  },
  async fetch() {
    const { rows: lst } = await this.$axios.$get(`/api/lst/object-categories`);
    this.objectCategoriesLst = lst;

    const data = await this.$axios.$get(`/api/admin/objects/${this.$route.params?.id}`);
    const _data = cloneDeep(data);
    this.form = _data;
  }
};
</script>
