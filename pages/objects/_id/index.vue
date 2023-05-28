<template>
  <div>
    <div v-if="$fetchState.pending" class="d-flex justify-content-center align-items-center">
      <b-spinner />
    </div>
    <div v-else data-testid="is-ready">
      <div class="bObject">
        <div class="row">
          <div class="col-6">
            <h1>{{ form._name }}</h1>

            <div class="bObject__location">
              <i-pin />
              {{ form.payload?.address }}
            </div>

            <div class="bObject__rating">
              <i-star />
              Рейтинг 4.3 <small>(365 отзывов)</small></div>

            <div class="row bObject__options">
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

            <div class="bObject__text">
              {{ form._description }}
            </div>

            <div class="bObject__review">
              <h1>Отзывы</h1>

              <div class="bObject__review__card">
                <div class="row">
                  <div class="col-6">
                    <div class="bObject__review__card__cnt">
                      <i-star />
                      4.96
                    </div>
                    <div class="bObject__review__card__info">Основан на 235 отзывах</div>
                  </div>
                  <div class="col-auto ml-auto">
                    <sh-btn class="bObject__review__card__btn" variant="default">
                      <i-comment />
                      Оставить отзыв
                    </sh-btn>
                  </div>
                </div>

                <div class="row bObject__review__card__line">
                  <div class="col-6">
                    <p>Положительные</p>
                    <small>4 звезды и более</small>
                  </div>
                  <div class="col-auto ml-auto">
                    <p>80%</p>
                  </div>
                </div>

                <div class="row bObject__review__card__line">
                  <div class="col-6">
                    <p>Нейтральные</p>
                    <small>3 звезды и более</small>
                  </div>
                  <div class="col-auto ml-auto">
                    <p>15%</p>
                  </div>
                </div>

                <div class="row bObject__review__card__line">
                  <div class="col-6">
                    <p>Негативные</p>
                    <small>менее 2 звезд</small>
                  </div>
                  <div class="col-auto ml-auto">
                    <p>5%</p>
                  </div>
                </div>
              </div>

              <div class="bObject__review__item">
                <div class="row bObject__review__item__title">
                  <div class="col"><h2>Хорошая удобная студия</h2></div>
                  <div class="col-auto bObject__review__item__title__cnt">
                    <i-star />
                    4.91
                  </div>
                </div>
                <div class="bObject__review__item__text">
                  Записывали вокал здесь с группой на два трека, все быстро, качественно, плюс за счёт подсветки и
                  внутренней отделки создана приятная атмосфера в вокальной комнате и комнате звукорежиссера, это
                  скрашивает процесс записи.
                </div>

                <div class="row no-gutters bObject__review__item__author">
                  <div class="col-auto bObject__review__item__author__image"></div>
                  <div class="col">
                    <div class="bObject__review__item__author__name">Мила Йовович</div>
                    <div class="bObject__review__item__author__date">22 апреля 2023</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-auto ml-auto">
            <div class="bObject__image"></div>
            <div class="bObject__box">
              <div v-if="$auth.loggedIn" class="bObject__box__price">
                {{ moneyFormat(1250) }} <small>/ час</small>
              </div>

              <sh-input type="select" v-model="form.objectCategoryId" :options="dateLst" label="Дата" />

              <sh-input type="select" v-model="form.objectCategoryId" :options="timesLst" label="Время" />

              <div class="row bObject__box__total">
                <div class="col-6"><b>1 200</b><small> x 3 часа</small></div>
                <div class="col-6 text-right">3 600.00 руб.</div>
              </div>

              <div class="bObject__box__action">
                <b-btn variant="default" block>Забронировать</b-btn>
              </div>

              <p>
                <sh-input type="cb">
                  <template #placeholder>Подтверждаю согласие<br />с Договором-офертой</template>
                </sh-input
                >
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { cloneDeep } from 'lodash';
import moment from 'moment';
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

const DATE = Array(7).fill(null)
  .map((_, key) => {
    const momentedDate = moment('2023-06-01').locale('ru').add(key, 'days');

    return { id: momentedDate.toISOString(), name: momentedDate.format('D MMMM YYYY') };
  });

const TIMES = Array(23).fill(null)
  .map((_, key) => ({
    id: [key, key + 1],
    name: `${key < 10 ? '0' + key : key}:00 - ${key + 1 < 10 ? '0' + (key + 1) : key + 1}:00`
  }));

export default {
  layout: 'public',
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
      dateLst: [...DATE],
      timesLst: [...TIMES]
    };
  },

  computed: {},
  watch: {},
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
    }
  },
  async fetch() {
    const { rows: lst } = await this.$axios.$get(`/api/lst/object-categories`);
    this.objectCategoriesLst = lst;

    const data = await this.$axios.$get(`/api/objects/${this.$route.params?.id}`);
    const _data = cloneDeep(data);
    this.form = _data;
  }
};
</script>
