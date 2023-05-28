<template>
  <date-picker-vue
    v-model="computedLocalValue"
    format="DD.MM.YYYY"
    value-type="DD.MM.YYYY"
    title-format="DD MMM YYYY"
    v-bind="$attrs"
    :open.sync="datePickerOpen"
    :data-testid="dataTestid"
    :class="{ 'is-invalid': $attrs.state === false, 'is-valid': $attrs.state === true }"
    @change="$emit('change', $event)"
    @open="$emit('open', $event)"
    @close="$emit('close', $event)"
    @confirm="$emit('confirm', $event)"
    @clear="$emit('clear', $event)"
    @input-error="$emit('input-error', $event)"
    @focus="$emit('focus', $event)"
    @blur="$emit('blur', $event)"
    @pick="$emit('pick', $event)"
    @calendar-change="$emit('calendar-change', $event)"
    @panel-change="$emit('panel-change', $event)"
  >
    <template #input>
      <b-form-input
        ref="date-picker-input"
        v-model="datePickerValue"
        v-mask="'99.99.9999'"
        type="text"
        autocomplete="off"
        trim
        :data-testid="dataTestidInput"
        :state="$attrs.state"
        :placeholder="$attrs.placeholder"
        @keyup.enter="onEnterDatePicker"
        @change="onChangeDatePicker"
        @input="onChangeInputDatePicker"
      />
    </template>

    <template #icon-calendar><IconCalendar :data-testid="dataTestidBtnCalendar" /></template>

    <template #footer="{ emit }">
      <b-button
        class="w-100"
        variant="outline-primary"
        size="sm"
        :data-testid="dataTestidBtnToday"
        @click="
          emit(new Date());
          datePickerOpen = false;
        "
        >Сегодня</b-button
      >
    </template>
  </date-picker-vue>
</template>

<script>
import { isEqual, isNull } from 'lodash';
import { BFormInput, BButton } from 'bootstrap-vue';
import Inputmask from '../../plugins/mask';
import DatePickerVue from 'vue2-datepicker';
import 'vue2-datepicker/locale/ru';
import IconCalendar from '../icons/calendar';
import moment from 'moment';

import { INPUT_DATE } from '../../config/ShInput';

export default {
  name: 'DatePicker',
  components: {
    BFormInput,
    DatePickerVue,
    BButton,
    IconCalendar,
  },
  directives: {
    mask: {
      bind: function (el, binding) {
        const { value } = binding;
        if (value) {
          Inputmask(value).mask(el);
        }
      },
      update: function (el, binding, vnode) {
        const { value, oldValue } = binding;
        if (value) {
          if (!isEqual(value, oldValue)) Inputmask(binding.value).mask(el);
        } else if (el.inputmask) {
          Inputmask.remove(el);
        }
      },
    },
  },
  inheritAttrs: false,
  props: {
    value: {
      type: [String, Number],
      default: null,
    },
    type: {
      type: String,
      default: 'date',
      validator: (type) => INPUT_DATE.includes(type),
    },
    formatDate: {
      type: String,
      default: 'YYYY-MM-DD',
    },
    requiredFull: {
      type: Boolean,
      default: false,
    },
    testid: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      isFocus: false,
      wasIsFocus: false,
      datePickerOpen: false,
    };
  },
  computed: {
    datePickerValue: {
      get() {
        return this.computedLocalValue;
      },
      set(newValue) {
        const isComplete = this.$refs['date-picker-input']?.$el?.inputmask?.isComplete();
        if (isComplete) {
          this.computedLocalValue = newValue;
        } else if (!isNull(newValue) && this.requiredFull) {
          // почему в момент когда вся маска заполнена возвращается true хз, я думаю магия, или проблема с наименованиями
          this.$emit('state', false);
        }
      },
    },
    computedLocalValue: {
      get() {
        return moment(this.value, this.formatDate, true).isValid() ? moment(this.value).format('DD.MM.YYYY') : '';
      },

      set(newValue) {
        this.$emit(
          'input',
          moment(newValue, 'DD.MM.YYYY', true).isValid() ? moment(newValue, 'DD.MM.YYYY').format(this.formatDate) : ''
        );
      },
    },
    dataTestid() {
      return this.testid ? `date-${this.testid}` : '';
    },
    dataTestidInput() {
      return this.testid ? `date-input-${this.testid}` : '';
    },
    dataTestidBtnToday() {
      return this.testid ? `date-btn-today-${this.testid}` : '';
    },
    dataTestidBtnCalendar() {
      return this.testid ? `date-btn-calendar-${this.testid}` : '';
    },
  },
  watch: {},
  methods: {
    onEnterDatePicker($event) {
      const isComplete = this.$refs['date-picker-input']?.$el?.inputmask?.isComplete();
      if (isComplete) {
        this.datePickerOpen = false;
      }
    },
    onChangeDatePicker(value) {
      this.$emit('change', value);
      // const isComplete = this.$refs['date-picker-input']?.$el?.inputmask?.isComplete();
      // console.log('@onChangeDatePicker', isComplete);
      // if (value && isComplete) {
      //   const v = value.split('.');
      //   const localValue = `${v[2]}-${v[1]}-${v[0]}`;
      //   this.localValue = localValue;
      //   this.onChange(localValue);
      // }
    },
    onChangeInputDatePicker(value) {
      // const unmasked = this.$refs['date-picker-input']?.$el?.inputmask?.unmaskedvalue();
      // if (unmasked === '') {
      //   this.localValue = '';
      //   this.onChange('');
      // } else if (/^(0?[1-9]|[12][0-9]|3[01])[\.](0?[1-9]|1[012])[\.]\d{4}$/g.test(value)) {
      //   this.onChangeDatePicker(value);
      // }
    },
  },
};
</script>
