import { cloneDeep, isEmpty, get, set, merge } from "lodash";
import moment from "moment";

export const normalize = (model = {}) => {
  const nModel = cloneDeep(model);

  // delete nModel.createdAt;
  delete nModel.updatedAt;
  delete nModel.deletedAt;

  if (!Array.isArray(nModel?.payload?.workTime)) {
    nModel.payload.workTime = Array(7)
      .fill(null)
      .map((i) => [9 + 1, 21 + 1]);
  } else {
    nModel.payload.workTime = nModel.payload.workTime.map((i) => {
      let t1 = Number(String(i[0]).split(":")[0]) ?? 9;
      let t2 = Number(String(i[1]).split(":")[0]) ?? 21;

      return [t1, t2];
    });
  }

  return nModel;
};

export const serialize = (model = {}) => {
  const sModel = cloneDeep(model);

  if (!Array.isArray(sModel?.payload?.workTime)) {
    nModel.payload.workTime = nModel.payload.workTime.map((i) => {
      let t1 = Number(i[0]) - 1;
      let t2 = Number(i[1]) - 1;

      return [t1, t2];
    });
  }

  return sModel;
};

export default {};
