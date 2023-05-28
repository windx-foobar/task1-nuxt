import { cloneDeep } from "lodash";

const CONFIRM = {
  title: "Подтвердите действие",
  size: "md",
  buttonSize: "sm",
  okVariant: "danger",
  okTitle: "Да",
  cancelTitle: "нет",
  hideHeaderClose: false,
  centered: true,
  contentClass: "js-modal-confirm-content",
  footerClass: "js-modal-confirm-footer",
};

export default {
  get CONFIRM() {
    return cloneDeep(CONFIRM);
  },
  get CONFIRM_OK() {
    const data = cloneDeep(CONFIRM);
    data.okVariant = "primary";
    return data;
  },
};
