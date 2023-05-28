const getParentsTarget = (target, parentClass) => {
  let node = target;
  while (node != null) {
    //
    for (let key in node.classList) {
      if (node.classList[key] === parentClass) return node;
    }
    node = node.parentNode;
  }
  return false;
};

const REGEXP_SCROLL_PARENT = /^(visible|hidden)/;

const getScrollParent = (el) =>
  !(el instanceof HTMLElement) || typeof window.getComputedStyle !== "function"
    ? null
    : el.scrollHeight > el.clientHeight &&
      !REGEXP_SCROLL_PARENT.test(window.getComputedStyle(el).overflowY || "visible")
    ? el
    : getScrollParent(el.parentElement) || document.documentElement;

function onWheel(event) {
  event.preventDefault();

  const elementMouseIsOver = document.elementFromPoint(event.clientX, event.clientY);
  const elementScrolling = getParentsTarget(elementMouseIsOver, "horiz-js");

  if (elementScrolling) {
    if (event.deltaMode == event.DOM_DELTA_PIXEL) {
      var modifier = 1;
      // иные режимы возможны в Firefox
    } else if (event.deltaMode == event.DOM_DELTA_LINE) {
      var modifier = parseInt(getComputedStyle(elementScrolling).lineHeight);
    } else if (event.deltaMode == event.DOM_DELTA_PAGE) {
      var modifier = elementScrolling.clientHeight;
    }

    if (event.deltaY != 0) {
      const oldValue = elementScrolling.scrollLeft;

      elementScrolling.scrollLeft += modifier * event.deltaY;
      const newValue = oldValue + modifier * event.deltaY;

      if (oldValue !== elementScrolling.scrollLeft && elementScrolling.scrollLeft === newValue) {
      } else {
        const scrollParent = getScrollParent(elementMouseIsOver);

        if (scrollParent) scrollParent?.scroll(scrollParent.scrollLeft, scrollParent.scrollTop + -event.wheelDelta);
      }
    }
  } else {
    const scrollParent = getScrollParent(elementMouseIsOver);

    if (scrollParent) scrollParent?.scroll(scrollParent.scrollLeft, scrollParent.scrollTop + -event.wheelDelta);
  }
}

const extend = (app, mixin) => {
  if (!app.mixins) {
    app.mixins = [];
  }
  app.mixins.push(mixin);
};

export default async function ({ app }) {
  extend(app, {
    mounted() {
      this.$store.commit("v2/layout/SET_WINDOW_WIDTH", window.innerWidth);
      window.addEventListener("resize", () => this.$store.commit("v2/layout/SET_WINDOW_WIDTH", window.innerWidth));

      // document.addEventListener('wheel', onWheel, {
      //   passive: false
      // });
    },

    beforeDestroy() {
      window.removeEventListener("resize", () => this.$store.commit("v2/layout/SET_WINDOW_WIDTH", window.innerWidth));
    },
  });
}
