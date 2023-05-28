const LAYOUT_BREAKPOINT_XS = 576;
const LAYOUT_BREAKPOINT_SM = 768;
const LAYOUT_BREAKPOINT_MD = 992;
const LAYOUT_BREAKPOINT_LG = 1200;
const LAYOUT_BREAKPOINT_XL = 1440;
const LAYOUT_BREAKPOINT_XXL = 1920;

// --------- layout-helpers.es6 START

// ---
// export { layoutHelpers }
import { debounce } from 'lodash';

export default {
  data() {
    return {
      appWidth: 320,
      breakpoints: {
        xs: LAYOUT_BREAKPOINT_XS,
        sm: LAYOUT_BREAKPOINT_SM,
        md: LAYOUT_BREAKPOINT_MD,
        lg: LAYOUT_BREAKPOINT_LG,
        xl: LAYOUT_BREAKPOINT_XL,
        xxl: LAYOUT_BREAKPOINT_XXL
      }
    };
  },
  computed: {
    isXs() {
      return this.appWidth < LAYOUT_BREAKPOINT_XS;
    },
    isSm() {
      return LAYOUT_BREAKPOINT_XS < this.appWidth;
    },
    isMd() {
      return LAYOUT_BREAKPOINT_SM < this.appWidth;
    },
    isLg() {
      return LAYOUT_BREAKPOINT_MD < this.appWidth;
    },
    isXl() {
      return LAYOUT_BREAKPOINT_LG < this.appWidth;
    }
  },
  methods: {
    calcAppWidth() {
      this.appWidth = window?.innerWidth || document?.documentElement?.clientWidth || document?.body?.clientWidth;
    }
  },
  mounted() {
    this.calcAppWidth();
    window.addEventListener('resize', debounce(this.calcAppWidth, 200));
  },
  updated() {
    this.calcAppWidth();
  }
};
