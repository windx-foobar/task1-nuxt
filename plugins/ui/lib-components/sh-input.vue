<template>
  <!-- eslint-disable vue/no-v-html vue/valid-v-bind-sync -->

  <ValidationProvider
    :id="`container-field-${id}`"
    ref="validationProvider"
    v-slot="{ valid, invalid, errors }"
    tag="div"
    :vid="vid"
    :name="localName"
    :rules="$attrs.rules"
    :class="['sh-input-wrapper', { noModel: noModel }]">
    <div v-if="showTestId" class="data-testid">input-{{ dataTestid }}</div>
    <b-form-group
      :id="`form-group-${id}`"
      :data-testid="`sh-input-${dataTestid}`"
      v-bind="$attrs"
      :state="errors[0] ? false : valid ? true : null"
      :class="[$attrs.variant === 'inline' ? 'inline' : '', fgClass]">
      <!-- LABEL -->

      <template #label>
        <span>{{ $attrs.label }}</span>

        <b-badge v-if="$attrs.badge" :variant="$attrs['badge-variant'] || 'info'"> {{ $attrs.badge }} </b-badge>

        <slot name="label" />
      </template>

      <!-- INPUT -->

      <div :id="`field-${id}`" class="input-slot" @mouseover.stop="onMouseover" @mouseleave.stop="onMouseleave">
        <slot v-bind="{ valid, invalid, errors }">
          <component
            :is="component"
            ref="component"
            v-model="computedLocalValue"
            :type="type"
            :state="errors[0] ? false : valid ? true : null"
            :vid="vid"
            :testid="dataTestid"
            v-bind="$attrs"
            v-on="$listeners"
            @state="setState">
            <template v-for="(_, slot) of $scopedSlots" #[slot]="scope">
              <slot :name="slot" v-bind="scope" />
            </template>
          </component>
        </slot>
      </div>

      <template #description>
        <b-popover
          v-if="showPopoverDescription"
          ref="popover-description"
          :show.sync="showPopoverDescription"
          :target="`description-${id}`"
          variant="description"
          placement="bottomright"
          triggers>
          {{ $attrs.description }}
        </b-popover>

        <div class="description">
          <slot name="description" />
        </div>
      </template>

      <!-- <template #invalid-feedback> -->
      <template v-if="isMobileDevice">
        <b-form-invalid-feedback :state="errors[0] ? false : valid ? true : null">
          <span v-html="errors[0]"></span>
        </b-form-invalid-feedback>
      </template>

      <template v-else>
        <b-popover
          ref="popover-invalid-feedback"
          :show.sync="errors.length > 0 && (isHover || isFocus)"
          :target="`field-${id}`"
          variant="invalid-feedback"
          placement="top"
          triggers>
          <span v-html="errors[0]"></span>
        </b-popover>
      </template>
      <!-- </template> -->
    </b-form-group>
  </ValidationProvider>
</template>

<script>
import { ValidationProvider } from "vee-validate";
import { BFormGroup, BPopover } from "bootstrap-vue";
import CyrillicToTranslit from "cyrillic-to-translit-js";

import {
  INPUT_TYPES,
  INPUT_DATE,
  INPUT_CHECKBOX,
  CHECKBOX_GROUP,
  CHECKBOX_GROUP_RADIO,
  INPUT_SELECT,
  INPUT_TEXTAREA,
} from "../config/ShInput";
import SimpleInput from "../components/shInput/SimpleInput";
import DatePicker from "../components/shInput/DatePicker";
import SimpleCheckbox from "../components/shInput/SimpleCheckbox";
import GroupCheckbox from "../components/shInput/GroupCheckbox";
import GroupRadio from "../components/shInput/GroupRadio";
import MultiselectCustom from "../components/shInput/MultiselectCustom";
import SimpleTextarea from "../components/shInput/SimpleTextarea";

const cyrillicToTranslit = new CyrillicToTranslit();

export default {
  components: {
    ValidationProvider,
    BFormGroup,
    BPopover,
    SimpleInput,
    DatePicker,
    SimpleCheckbox,
    GroupCheckbox,
    GroupRadio,
    MultiselectCustom,
    SimpleTextarea,
  },
  inheritAttrs: false,
  props: {
    value: {
      type: [String, Number, Array, Object, Boolean],
      default: null,
    },
    type: {
      type: String,
      default: "text",
      validator: (type) =>
        INPUT_TYPES.concat(INPUT_DATE)
          .concat(INPUT_CHECKBOX)
          .concat(CHECKBOX_GROUP)
          .concat(CHECKBOX_GROUP_RADIO)
          .concat(INPUT_SELECT)
          .concat(INPUT_TEXTAREA)
          .includes(type),
    },
    fgClass: {
      type: [String, Object, Array],
      default: "",
    },
    vid: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      id: null,
      isHover: false,
      isFocus: false,
      showTestId: process.env.NUXT_ENV_SHOW_TEST_ID,
    };
  },
  computed: {
    dataTestid() {
      if (this.$attrs.testid) return this.$attrs.testid;

      let id = "";
      let name = this.$attrs.fieldName || this.$attrs.name || this.$attrs.label;
      if (this.vid) {
        id = this.vid;
      } else if (name) {
        id = cyrillicToTranslit.transform(name, "_").toLowerCase();
      }

      return id ?? "";
    },

    computedLocalValue: {
      get() {
        return this.value;
      },
      set(newValue) {
        // мы подписались на все через v-on="$listeners"
        this.$emit("value-change", newValue);
      },
    },
    component() {
      if (INPUT_TYPES.includes(this.type)) return "SimpleInput";
      if (INPUT_DATE.includes(this.type)) return "DatePicker";
      if (INPUT_CHECKBOX.includes(this.type)) return "SimpleCheckbox";
      if (CHECKBOX_GROUP.includes(this.type)) return "GroupCheckbox";
      if (CHECKBOX_GROUP_RADIO.includes(this.type)) return "GroupRadio";
      if (INPUT_SELECT.includes(this.type)) return "MultiselectCustom";
      if (INPUT_TEXTAREA.includes(this.type)) return "SimpleTextarea";
      return null;
    },
    localName() {
      const name = this.$attrs.fieldName || this.$attrs.name || this.$attrs.label;
      return name ? `"${name}"` : "";
    },
    noModel() {
      return this.$config?.isDev && !this.$vnode?.data?.model;
    },
    showPopoverDescription() {
      return !!this.$attrs.description;
    },
    isMobileDevice() {
      return this.layoutHelpers?.isMobileDevice();
    },
  },
  watch: {},
  mounted() {
    this.id = this._uid;
  },
  methods: {
    onMouseover({ target }) {
      this.isHover = true;
    },
    onMouseleave({ target }) {
      this.isHover = false;
    },
    setState(state) {
      if (state) {
        this.$refs.validationProvider.reset();
      } else {
        this.$refs.validationProvider.applyResult({
          errors: ["Данные не заполнены полностью"], // array of string errors
          valid: false, // boolean state
        });
      }
    },
  },
};
</script>

<style></style>
