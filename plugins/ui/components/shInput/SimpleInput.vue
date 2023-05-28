<template>
  <!-- <div> -->
  <!-- value:{{ value }} <br /> -->
  <!-- localValue:{{ localValue }} -->

  <b-form-input
    ref="input"
    v-model="localValue"
    v-mask="mask"
    v-bind="$attrs"
    :type="type"
    :class="{ focus: isFocus, 'was-focused': wasIsFocus }"
    trim
    :data-testid="dataTestid"
    @blur="onBlur"
    @focus="onFocus"
    @update="onUpdate"
    @change="onChange"
  />
  <!-- </div> -->
</template>

<script>
import { isEqual, isNumber, isNull } from 'lodash';
import { BFormInput } from 'bootstrap-vue';
import Inputmask from '../../plugins/mask';

import { INPUT_TYPES } from '../../config/ShInput';

export default {
  name: 'SimpleInput',
  components: {
    BFormInput,
  },
  directives: {
    mask: {
      bind: function (el, binding) {
        const { value } = binding;
        // console.log('Mask bind', value);
        if (value) {
          Inputmask(value).mask(el);
        }
      },
      update: function (el, binding, vnode) {
        const { value, oldValue } = binding;
        if (value) {
          // console.log('Mask update', value, oldValue);
          if (!isEqual(value, oldValue)) {
            Inputmask(binding.value).mask(el);
          }
        } else if (el.inputmask) {
          // console.log('Inputmask.remove');
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
    mask: {
      type: [String, Object],
      default: null,
    },
    requiredFull: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: 'text',
      validator: (type) => INPUT_TYPES.includes(type),
    },
    returnNumber: {
      type: Boolean,
      default: false,
    },
    testid: {
      type: String,
      default: '',
    },
  },
  data() {
    let localValue = [undefined, null].includes(this.value) ? '' : String(this.value);
    return {
      isFocus: false,
      wasIsFocus: false,
      timer: null,
      localValue,
    };
  },
  computed: {
    // Этот вариант приводит к тому что если редактировать данные в середине маси - прыгает курсор
    // computedLocalValue: {
    //   get() {
    //     if (this.type === 'text' && this.value) {
    //       console.log('get 1', this.value, String(this.value), this.value === String(this.value));
    //       return String(this.value);
    //     }
    //     console.log('get 2', this.value);
    //     return this.value;
    //   },

    //   set(newValue) {
    //     console.log('set');
    //     if (this.mask && this.mask !== 'mobile') {
    //       // if (this.requiredFull) {
    //       //   const isComplete = this.$refs['input']?.$el?.inputmask?.isComplete();
    //       //   if (isComplete) {
    //       //     this.$emit('input', this.this.$refs['input']?.$el?.inputmask?.unmaskedvalue());
    //       //   } else if (!isNull(newValue)) {
    //       //     // почему в момент когда вся маска заполнена возвращается true хз, я думаю магия, или проблема с наименованиями
    //       //     this.$emit('state', false);
    //       //   }
    //       // } else {
    //       this.$emit('input', this.$refs['input']?.$el?.inputmask?.unmaskedvalue());
    //       // }
    //     } else {
    //       this.$emit('input', newValue);
    //     }
    //   },
    // },
    dataTestid() {
      return this.testid ? `input-${this.testid}` : '';
    },
  },
  watch: {
    value(newVal) {
      // TODO: зачем?
      if (newVal !== this.localValue) {
        if (this.mask && newVal?.value) {
          this.localValue = newVal.value;
        } else {
          this.localValue = newVal;
        }
      }
    },
  },
  methods: {
    onUpdate($event) {
      this.$emit('input', $event);
    },
    onChange($event) {
      this.$emit('change', $event);
    },
    onBlur(event) {
      this.$emit('blur', event);
      this.isFocus = false;
      if (event.target.classList.contains('is-valid')) {
        this.wasIsFocus = true;
        this.timer = setTimeout(() => {
          this.wasIsFocus = false;
        }, 5000);
      }
    },
    onFocus(event) {
      this.$emit('focus', event);
      this.isFocus = true;
      if (this.timer) {
        clearTimeout(this.timer);
        this.wasIsFocus = false;
      }
    },
  },
};
</script>
