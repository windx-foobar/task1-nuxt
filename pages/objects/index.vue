<template>
  <div>
    <!-- <b-table hover :items="itemsProvider" :fields="fields" @row-clicked="rowClicked"></b-table> -->

    <div class="bFilters">
      <div class="row">
        <div class="col">
          <h1>Каталог креативных площадок</h1>
          <h2>Единый каталог креативных площадок Москвы</h2>
        </div>
      </div>
    </div>

    <nuxt-link v-for="(item, key) in rows" :key="key" class="bCard" :to="`/objects/${item.id}`">
      <div class="row no-gutters">
        <div class="col-auto">
          <div class="bCard__image"></div>
        </div>
        <div class="col">
          <div class="bCard__main">
            <h1>{{ item._name }}</h1>

            <div class="row">
              <div class="col-8">
                <p>{{ item._description }}</p>

                <div class="bCard__main__address">
                  <i-pin />
                  {{ item.payload?.address }}
                </div>
              </div>
              <div class="col-4 text-right">
                <div class="bCard__main__rating">
                  <i-star />
                  4.3 <small>(365)</small>
                </div>
                <div v-if="$auth.loggedIn" class="bCard__main__price">
                  {{ moneyFormat(1250) }} <small> / час</small>
                </div>
                <div class="bCard__main__size">55 м<sup>2</sup></div>
              </div>
            </div>

            <div class="row align-items-end">
              <div class="col">
                <div class="row bObject__options pb-0">
                  <div class="col-auto bObject__options__item">
                    <div class="bObject__options__item__icon"></div>
                    <div class="bObject__options__item__text">Wifi</div>
                  </div>

                  <div class="col-auto bObject__options__item">
                    <div class="bObject__options__item__icon"></div>
                    <div class="bObject__options__item__text">Площадь</div>
                  </div>

                  <div class="col-auto bObject__options__item">
                    <div class="bObject__options__item__icon"></div>
                    <div class="bObject__options__item__text">Можно с животными</div>
                  </div>

                  <div class="col-auto bObject__options__item">
                    <div class="bObject__options__item__icon"></div>
                    <div class="bObject__options__item__text">Хромакей</div>
                  </div>

                  <div class="col-auto bObject__options__item">
                    <div class="bObject__options__item__icon"></div>
                    <div class="bObject__options__item__text">Большие окна</div>
                  </div>
                </div>
              </div>

              <div class="col-auto bCard__main__actions">
                <b-btn variant="default">Подробнее</b-btn>
                <b-btn variant="default" class="bCard__main__actions__main">Забронировать</b-btn>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- {{ item }} -->
    </nuxt-link>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  components: {},
  layout: 'public',
  data() {
    return {
      rows: [],
      _meta: {}
      //
    };
  },

  computed: {
    ...mapGetters({})
  },

  methods: {
    // --- GETTERS ---
    moneyFormat(value) {
      if (!+value) return '';

      const intl = new Intl.NumberFormat('ru', {
        style: undefined,
        currency: 'RUB',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
        currencyDisplay: 'name'
      });

      return `${intl.format(+value)} руб`;
    },

    async itemsProvider(ctx = {}) {
      const { rows, _meta } = await this.$axios.$get('/api/objects');

      return rows;
    },

    rowClicked(item) {
      this.$router.push(`${this.$route.path}/${item.id}`);
    }
  },
  async fetch() {
    this.rows = await this.itemsProvider();
  },
  async mounted() {}
};
</script>
