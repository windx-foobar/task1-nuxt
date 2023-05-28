<template>
  <multiselect
    ref="multiselect"
    :key="`_multiselect-custom-${id}`"
    v-model="computedLocalValue"
    :placeholder="compPlaceholder"
    tag-placeholder=""
    select-label=""
    select-group-label=""
    selected-label=""
    deselect-label=""
    deselect-group-label=""
    :allow-empty="false"
    :preserve-search="true"
    :show-labels="false"
    tag-position="bottom"
    :options="compOptions"
    v-bind="$attrs"
    :track-by="$attrs['item-id'] || 'id'"
    :label="$attrs['item-name'] || 'name'"
    :class="['multiselect-custom', { 'multiselect__select-none': computedLocalValue }]"
    :searchable="compSearchable"
    :testid="testid"
    @select="select"
    @remove="onMultiselectRemove"
    @search-change="asyncFind"
  >
    <template #noOptions> {{ !!search ? 'Введите запрос' : 'Список пуст' }}</template>
    <template #noResult> Нет совпадений </template>
    <template v-if="$attrs.multiple ? false : clear" #clear="props">
      <div
        v-show="!!computedLocalValue"
        class="multiselect__clear"
        :data-testid="dataTestidBtnClear"
        @mousedown.prevent.stop="multiselectClearAll(props.search)"
      >
        <svg width="9" height="9" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M1.82091 0.312419C1.40435 -0.10414 0.728979 -0.10414 0.312419 0.312419C-0.10414 0.728979 -0.10414 1.40435 0.312419 1.82091L6.49151 8L0.31242 14.1791C-0.10414 14.5956 -0.10414 15.271 0.312419 15.6876C0.728979 16.1041 1.40435 16.1041 1.82091 15.6876L8 9.50849L14.1791 15.6876C14.5956 16.1041 15.271 16.1041 15.6876 15.6876C16.1041 15.271 16.1041 14.5956 15.6876 14.1791L9.50849 8L15.6876 1.82091C16.1041 1.40436 16.1041 0.728979 15.6876 0.31242C15.271 -0.10414 14.5956 -0.10414 14.1791 0.31242L8 6.49151L1.82091 0.312419Z"
            fill="currentColor"
          />
        </svg>
      </div>
    </template>
  </multiselect>
</template>

<script>
import Multiselect from './Multiselect';
import { cloneDeep } from 'lodash';
// import 'regenerator-runtime/runtime';

export default {
  components: {
    Multiselect,
  },
  props: {
    value: {
      type: [String, Number, Object, Array],
      default: null,
    },
    clear: {
      type: Boolean,
      default: true,
    },
    events: {
      type: Object,
      default: () => ({}),
    },
    search: {
      type: Object,
      default: null,
    },
    suggest: {
      type: Function,
      default: null,
    },
    formatting: {
      type: Boolean,
      default: true,
    },
    testid: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      id: null,
      localOptions: [],
      chooseOptions: [],
    };
  },
  computed: {
    computedLocalValue: {
      get() {
        if (this.formatting && this.value) {
          if (this.$attrs.multiple) {
            if (Array.isArray(this.value)) {
              return (
                this.value
                  .map((item) =>
                    this.compOptions.concat(this.chooseOptions).find((elem) => {
                      return elem[this.$attrs['item-id'] ?? 'id'] == item;
                    })
                  )
                  .filter(Boolean) ?? []
              );
            } else {
              return [];
            }
          } else {
            return this.compOptions
              .concat(this.chooseOptions)
              .find((elem) => elem[this.$attrs['item-id'] ?? 'id'] == this.value);
          }
        } else if (this.formatting && !this.value) {
          return this.$attrs.multiple ? [] : null;
        } else {
          return this.value;
        }
      },

      set(newValue) {
        if (this.formatting && newValue) {
          if (this.$attrs.multiple) {
            this.$set(this.$data, 'chooseOptions', newValue);
            this.$emit(
              'input',
              newValue.map((item) => item[this.$attrs['item-id'] ?? 'id'])
            );
          } else {
            this.$set(this.$data, 'chooseOptions', [newValue]);
            this.$emit('input', newValue[this.$attrs['item-id'] ?? 'id']);
          }
        } else {
          this.$emit('input', newValue);
          this.$refs['multiselect'].clear();
        }
      },
    },
    compPlaceholder() {
      if (this.$attrs.placeholder) return this.$attrs.placeholder;
      else if (this.search) return 'Начните ввод для поиска';
      else return 'Выберите значение';
    },
    compOptions() {
      return this.$attrs.options ?? this.localOptions;
    },
    compSearchable() {
      return this.search ? true : this.$attrs.searchable;
    },
    dataTestidBtnClear() {
      return this.testid ? `select-btn-clear-${this.testid}` : '';
    },
  },

  created() {
    this.id = this._uid;
  },
  async mounted() {
    // загрузка значений для отображения предворительно установленый id
    if (this.search && (Array.isArray(this.value) ? this.value.length : this.value)) {
      try {
        const options = this.search?.options;
        const hasOptions = Array.isArray(options) && !!options.length;
        if (!this.search?.defaultUrl && !hasOptions) throw new Error('defaultUrl не установлен или options пустой');

        if (hasOptions) {
          const found = options.find((i) => i.id == this.value);
          if (found) {
            this.$set(this.$data, 'chooseOptions', found);
          }
        } else {
          const options = {
            method: this.search.method || 'get',
            url: this.search.defaultUrl,
            progress: false,
          };

          if (this.search.method === 'post') {
            options.data = {
              [this.search?.defaultUrlQuery ?? 'ids']: Array.isArray(this.value) ? this.value : [this.value],
            };
          } else {
            options.params = {
              [this.search?.defaultUrlQuery ?? 'ids']: Array.isArray(this.value) ? this.value : [this.value],
            };
          }
          const { data } = await this.$axios(options);
          if (data) {
            this.$set(this.$data, 'chooseOptions', data);
          }
        }
      } catch (error) {
        console.error('sh-input@asyncFind', error);
      }
    }
  },
  methods: {
    setOptions(options) {
      this.localOptions = options;
    },
    setSelected(option) {
      this.$set(this.$data, 'chooseOptions', option);
    },
    select(opt, id) {
      this.$emit('select', opt, opt[this.$attrs['item-id'] || 'id']);
    },

    onMultiselectRemove() {
      this.computedLocalValue = null;
    },
    multiselectClearAll() {
      this.computedLocalValue = null;
    },
    async asyncFind(event) {
      if (this.suggest) {
        this.$set(this.$data, 'localOptions', await this.suggest(event));
      } else {
        try {
          const options = {
            method: this.search.method || 'get',
            url: this.search.url,
            progress: false,
          };

          if (this.search.method === 'post') {
            options.data = {
              ...this.search.query,
              [this.search.urlQuery ?? 'query']: event,
            };
          } else {
            options.params = {
              ...this.search.query,
              [this.search.urlQuery ?? 'query']: event,
            };
          }
          const { data } = await this.$axios(options);

          if (typeof this.search.mapper === 'function') {
            const mapped = this.search.mapper(data);
            this.$set(this.$data, 'localOptions', mapped);
          } else {
            this.$set(this.$data, 'localOptions', data);
          }
        } catch (error) {
          console.error('sh-input@asyncFind', error);
          this.$set(this.$data, 'localOptions', []);
        }
      }
    },
  },
};
</script>
